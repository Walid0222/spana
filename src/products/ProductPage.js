import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';
import productsData from '../db/products.json'; // Importer les produits
import reviewsData from '../db/reviews.json';  // Importer les avis
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from '../Firebase';  // Importer la config Firebase
import Swal from 'sweetalert2'; // Importer SweetAlert

const ProductPage = () => {
    const { productId } = useParams(); // Get the productId from URL parameters
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [price, setPrice] = useState(''); // Prix dynamique selon sélection
    const [isZoomed, setIsZoomed] = useState(false); // Pour gérer le zoom des images des avis
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        quantity: 'one' // Par défaut, une pièce
    });
    const [docId, setDocId] = useState(''); // Ajouter un état pour stocker l'ID
    const [nextId, setNextId] = useState(1); // L'ID incrémenté
    const [errors, setErrors] = useState({});

    // Références pour le scroll vers les champs
    const formRef = useRef(null);
    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const addressRef = useRef(null);
    const cityRef = useRef(null);

    // Fonction pour obtenir le prochain ID
    const getNextId = async () => {
        const q = query(collection(db, "formSubmissions"), orderBy("id", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            setNextId(1); // Si aucune entrée, commencer à 1
        } else {
            const lastDoc = querySnapshot.docs[0].data();
            setNextId(lastDoc.id + 1); // Incrémenter le dernier ID trouvé
        }
    };

    useEffect(() => {
        getNextId(); // Appeler la fonction pour récupérer l'ID dès le chargement
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = "الاسم مطلوب";
        }
        if (!formData.phone) {
            newErrors.phone = "رقم الهاتف مطلوب";
        }
        if (!formData.address) {
            newErrors.address = "العنوان مطلوب";
        }
        if (!formData.city) {
            newErrors.city = "المدينة مطلوبة";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validation du formulaire
        if (!validateForm()) {
            scrollToError();  // Scroll vers le champ manquant
            setTimeout(() => {
                Swal.fire({
                    title: 'خطأ!',
                    text: "يرجى التأكد من أنك قد ملأت جميع معلومات النموذج.",
                    icon: 'error',
                    confirmButtonText: 'حسناً'
                });
            }, 1200);
            return;
        }

        // Ajoute la date et l'heure actuelles
        const currentDateTime = new Date();

        try {
            // Sélectionne le prix et la quantité en fonction de l'option choisie
            const selectedPrice = formData.quantity === 'one' ? product.price : product.twoPrice;
            const quantitySelected = formData.quantity === 'one' ? 1 : 2;

            // Ajouter les données du formulaire à Firestore
            const docRef = await addDoc(collection(db, "formSubmissions"), {
                id: nextId, // Utiliser le prochain ID généré
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                quantity: quantitySelected, // Enregistrer la quantité
                productTitle: product.name, // Enregistrer le titre du produit
                price: selectedPrice, // Enregistrer le prix selon la sélection
                date: currentDateTime.toLocaleDateString(),
                time: currentDateTime.toLocaleTimeString(),
                status: 'pending' // Statut par défaut
            });

            // Enregistrer l'ID du document dans l'état
            setDocId(docRef.id);

            // SweetAlert pour confirmation
            Swal.fire({
                title: '<h2 style="color: #4CAF50;">🎉 نجاح!</h2>',
                html: `
                    <p style="font-size: 18px; color: #333;">
                        تم تقديم النموذج بنجاح.<br> 
                        <strong>الرقم التعريفي:</strong> ${nextId}<br>
                        سنقوم بالاتصال بك في غضون لحظات لتأكيد الشراء وشحن الطرد الخاص بك. 
                        يرجى الاحتفاظ بهاتفك بالقرب منك.
                    </p>
                    <p style="font-size: 16px; color: #FF9800;">
                        📞 رجاءً، تأكد من أن هاتفك جاهز.
                    </p>
                `,
                icon: 'success',
                confirmButtonText: '<span style="font-size: 18px;">👌 حسناً</span>',
                background: '#f9f9f9',
                backdrop: `
                    rgba(0, 123, 255, 0.4)
                    url("/images/celebration.gif")
                    left top
                    no-repeat
                `,
                customClass: {
                    popup: 'animated tada'
                }
            });

            // Mettre à jour le prochain ID
            setNextId(nextId + 1);
        } catch (e) {
            // SweetAlert pour erreur
            Swal.fire({
                title: 'خطأ!',
                text: `خطأ أثناء تقديم النموذج: ${e.message}`,
                icon: 'error',
                confirmButtonText: 'حسناً'
            });
        }
    };

    // Fonction pour scroller vers le premier champ manquant en cas d'erreur
    const scrollToError = () => {
        document.getElementById('firstForm').scrollIntoView({ behavior: 'smooth' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        // Trouver le produit correspondant
        const foundProduct = productsData.find(p => p.id === parseInt(productId)); // Use productId
        setProduct(foundProduct || {});
        setReviews(reviewsData || []);

        // Définir le prix par défaut comme celui d'une seule pièce
        if (foundProduct) {
            setPrice(foundProduct.price);
        }

        // Si le produit est trouvé, définir l'image principale comme première image
        if (foundProduct && foundProduct.images && foundProduct.images.length > 0) {
            setSelectedImage(foundProduct.images[0]);
        }

        // Gestion du compte à rebours avec 6 heures restantes
        const storedTargetTime = localStorage.getItem('targetTime');
        let targetTime;

        if (storedTargetTime) {
            targetTime = parseInt(storedTargetTime, 10);
        } else {
            targetTime = new Date().getTime() + 6 * 60 * 60 * 1000; // 6 heures
            localStorage.setItem('targetTime', targetTime);
        }

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetTime - now;

            if (difference < 0) {
                clearInterval(interval);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                setTimeLeft({ hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [productId]); // Use productId here

    const scrollToReviews = () => {
        const reviewsSection = document.querySelector('.reviews');
        if (reviewsSection) {
            reviewsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Zoom sur l'image des avis
    const handleImageClick = () => {
        setIsZoomed(!isZoomed); // Toggle zoom
    };

    // Gérer la sélection du prix en fonction du nombre d'articles
    const handlePriceChange = (e) => {
        const selectedOption = e.target.value;
        setFormData({ ...formData, quantity: selectedOption });
        if (selectedOption === 'one') {
            setPrice(product.price);
        } else if (selectedOption === 'two') {
            setPrice(product.twoPrice);
        }
    };

    const handleScrollToFormAndSubmit = (e) => {
        // Appel de la fonction de défilement
        scrollToError();

        // Soumettre le formulaire avec un délai pour le défilement
        setTimeout(() => {
            handleFormSubmit(e);
        }, 300); // Ajustez le délai si nécessaire
    };

    if (!product || !product.name) {
        return (
            <div className="not-found-container">
                <h2 className="not-found-message">المنتج غير موجود.</h2>
                <p className="not-found-description">يبدو أن المنتج الذي تبحث عنه غير متوفر.</p>
                <button className="back-to-menu-button" onClick={() => window.location.href = '/'}>
                    العودة إلى القائمة
                </button>
            </div>
        );
    }

    return (
        <div className="product-page">
            <div className="sidebar">
                <img src={selectedImage || ''} alt="منتج" className="main-image" />
                <div className="image-thumbnails">
                    {product.images && product.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index}`}
                            className={`thumbnail ${selectedImage === image ? 'active' : ''}`}
                            onClick={() => setSelectedImage(image)}
                        />
                    ))}
                </div>
            </div>
            <div id='firstForm' ref={formRef}></div>

            <div className="product-content">
                <p className="promotion-text">PROMOTION -57%</p>

                <h1 style={{ fontSize: '20px' }}>{product.name} {product.name.includes("Spotify premium") && (
                    <img src={`${process.env.PUBLIC_URL}/spotify.png`} alt="شعار Spotify" className="spotify-logo" />
                )}</h1>
                <h1 style={{ fontSize: '16px' }}>{product.bonus1} </h1>
                <h1 style={{ fontSize: '16px' }}>{product.bonus2} </h1>
                <h1 style={{ fontSize: '16px' }}>{product.bonus1_ar} </h1>
                <h1 style={{ fontSize: '16px' }}>{product.bonus2_ar} </h1>
                <h1 style={{ fontSize: '16px' }}>{product.bonus3_ar} </h1>
                <h1 style={{ fontSize: '16px' }}>{product.bonus4_ar} </h1>
                <h3> ⚠️ راه كاين تخفيض مؤقت ⚠️                </h3>
                <ul style={{    listStyleType:'none'}}>
                    {product.description && product.description.map((description, index) => (
                        <li key={index}>{description}</li>
                    ))}
                </ul>                <h1 style={{ fontSize: '16px', fontWeight: 'bold' }}>   {product.infos}</h1>
                <p className="price">
                    <span className="new-price">د.م{price} </span>
                    <span className="old-price">د.م{product.oldPrice} </span>
                </p>

                {/* Formulaire d'achat */}
                <div id="orderForm" className="order-form" ref={formRef}>
                    <form onSubmit={handleFormSubmit}>
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="الاسم "
                                value={formData.name}
                                onChange={handleChange}
                                ref={nameRef}
                            />
                            {errors.name && <p className="error-message">{errors.name}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="phone"
                                placeholder="06XXXXXXXX رقم الهاتف"
                                value={formData.phone}
                                onChange={handleChange}
                                ref={phoneRef}
                            />
                            {errors.phone && <p className="error-message">{errors.phone}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="address"
                                placeholder="العنوان"
                                value={formData.address}
                                onChange={handleChange}
                                ref={addressRef}
                            />
                            {errors.address && <p className="error-message">{errors.address}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="city"
                                placeholder="المدينة"
                                value={formData.city}
                                onChange={handleChange}
                                ref={cityRef}
                            />
                            {errors.city && <p className="error-message">{errors.city}</p>}
                        </div>

                        <h3>اختر خيارًا :</h3>
                        <div className="radio-group">
                            <input
                                type="radio"
                                id="one-piece"
                                name="quantity"
                                value="one"
                                defaultChecked
                                onChange={handlePriceChange}
                            />
                            <p> واحدة ب {product.price} درهم </p><span className="promotion-small">-50%</span>
                        </div>
                        <div className="radio-group">
                            <input
                                type="radio"
                                id="two-pieces"
                                name="quantity"
                                value="two"
                                onChange={handlePriceChange}
                            />
                            <p>العرض الثاني 2 ب {product.twoPrice} درهم </p><span className="promotion-small">-57%</span>
                        </div>

                        <button type="submit" className="order-button">➤  اشتري الآن وادفع لاحقا</button>
                    </form>
                </div>
                <div className="fixed-bottom-order">
                    <button type="button" className="fixed-order-button" onClick={handleScrollToFormAndSubmit}>➤   اشتري الآن وادفع لاحقا</button>
                </div>

                {/* Compte à rebours */}
                <div className="countdown">
                    <h3>سينتهي العرض في :</h3>
                    <div className="countdown-timer">
                        <span>{String(timeLeft.hours).padStart(2, '0')} :</span>
                        <span>{String(timeLeft.minutes).padStart(2, '0')} :</span>
                        <span>{String(timeLeft.seconds).padStart(2, '0')}:</span>
                        <span>0 </span>
                    </div>
                    <div className="countdown-days">
                        <span> أيام</span>
                        <span> ثواني</span>
                        <span> دقائق</span>
                        <span> ساعات</span>
                    </div>
                </div>

                {/* Caractéristiques du produit */}
                <div className="features">
                    <h3>الميزات الرئيسية</h3>
                    <ul>
                        {product.features && product.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>

                {/* Images du produit */}
                <div className="product-images-section mobile-only">
                    <div className="product-images-container">
                        {product.images && product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                className="product-image"
                                alt={`Product Image ${index + 1}`} // Ajoutez un alt pour l'accessibilité
                            />
                        ))}
                    </div>
                </div>

                {/* Avis clients (mobile only) */}
                {/*<div className="reviews mobile-only">
                    <h3>آراء العملاء</h3>
                    <div className="reviews-container">
                        {reviews.map((review, index) => (
                            <div key={index} className="review">
                                <strong>{review.name} :</strong>
                                <p>{review.comment}</p>
                                <img
                                    src={review.image}
                                    alt={`Avis de ${review.name}`}
                                    className="review-image"
                                    onClick={handleImageClick}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="arrows-decoration">
                        <span className="left-arrow-decoration">&lt;</span>
                        <span className="right-arrow-decoration">&gt;</span>
                    </div>
                </div>*/}
            </div>
        </div>
    );
};

export default ProductPage;