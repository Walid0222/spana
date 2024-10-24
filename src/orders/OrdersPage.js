import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from '../Firebase'; // Importer Firestore
import Swal from 'sweetalert2'; // Importer SweetAlert
import './OrdersPage.css'; // Importer les styles

const OrdersPage = () => {
    const [orders, setOrders] = useState([]); // État pour stocker les commandes
    const [loading, setLoading] = useState(true); // État de chargement
    const [expandedOrder, setExpandedOrder] = useState(null); // État pour gérer l'ordre actif
    const [showModal, setShowModal] = useState(false); // État pour afficher le modal
    const [selectedOrder, setSelectedOrder] = useState(null); // État pour stocker l'ordre sélectionné pour le modal
    const [createdParcelOrderId, setCreatedParcelOrderId] = useState(null); // État pour stocker l'ID de la commande pour laquelle le colis a été créé

    const username = localStorage.getItem('username'); // Récupérer l'utilisateur connecté
    const [districts, setDistricts] = useState([]); // État pour stocker les districts
    const [pickupDistrictId, setPickupDistrictId] = useState(2); // District de ramassage par défaut (Rabat)
    const [selectedDistrictId, setSelectedDistrictId] = useState(2); // District de livraison par défaut
    const [allowOpen, setAllowOpen] = useState(true); // Autoriser à ouvrir par défaut
    const [allowTry, setAllowTry] = useState(true); // Autoriser à essayer par défaut
    const [useDeliveryExchange, setUseDeliveryExchange] = useState(false); // Utiliser l'échange de livraison par défaut
    const [comment, setComment] = useState(''); // Champ pour le commentaire

    // États pour les entrées de recherche
    const [pickupDistrictInput, setPickupDistrictInput] = useState('');
    const [selectedDistrictInput, setSelectedDistrictInput] = useState('');

    // États pour les districts filtrés
    const [filteredPickupDistricts, setFilteredPickupDistricts] = useState([]);
    const [filteredSelectedDistricts, setFilteredSelectedDistricts] = useState([]);

    // Fonction pour récupérer tous les districts depuis l'API
    const fetchDistricts = async () => {
        const token = localStorage.getItem('token'); // Récupérer le token stocké
        try {
            let allDistricts = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const response = await fetch(`https://app.sendit.ma/api/v1/districts?page=${page}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Log the response for debugging
                console.log('Response:', response);

                if (!response.ok) {
                    throw new Error(`Erreur ${response.status} : ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Fetched districts:', data.data); // Log the fetched districts

                allDistricts = [...allDistricts, ...data.data];

                // Vérifiez si moins de 10 résultats sont retournés, ce qui signifie que c'est la dernière page
                if (data.data.length < 10) {
                    hasMore = false; // Si moins de 10 résultats, on arrête
                } else {
                    page++;
                }
            }

            setDistricts(allDistricts); // Traitez les données
            setFilteredPickupDistricts(allDistricts); // Initialisez avec tous les districts
            setFilteredSelectedDistricts(allDistricts); // Initialisez avec tous les districts
        } catch (error) {
            console.error('Erreur lors de la récupération des districts :', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const q = query(collection(db, "formSubmissions"), orderBy("id", "desc"));
            const querySnapshot = await getDocs(q);
            const ordersList = querySnapshot.docs.map(doc => ({
                docId: doc.id,
                ...doc.data()
            }));
            setOrders(ordersList);
            setLoading(false);
            console.log('Fetched orders:', ordersList); // Log fetched orders
        } catch (error) {
            console.error("Erreur lors de la récupération des commandes: ", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchDistricts();
    }, []);

    // Fonction pour afficher les détails de la commande
    const toggleDetails = (orderId) => {
        setExpandedOrder(prevOrder => (prevOrder === orderId ? null : orderId));
    };

    // Filtrer les districts selon l'entrée
    const filterDistricts = (input, type) => {
        const filtered = districts.filter(district => district.name.toLowerCase().includes(input.toLowerCase()));
        if (type === 'pickup') {
            setFilteredPickupDistricts(filtered);
            setPickupDistrictInput(input);
        } else {
            setFilteredSelectedDistricts(filtered);
            setSelectedDistrictInput(input);
        }
    };

    // Fonction pour ouvrir le modal pour ajouter un colis
    const openAddParcelModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
        setComment(''); // Réinitialiser le commentaire
    };

    const closeModal = () => {
        setShowModal(false);
        setPickupDistrictInput('');
        setSelectedDistrictInput('');
        setFilteredPickupDistricts(districts);
        setFilteredSelectedDistricts(districts);
    };

    const handleAddParcel = async () => {
        const parcelData = {
            pickup_district_id: pickupDistrictId,
            district_id: selectedDistrictId,
            name: selectedOrder.name,
            amount: selectedOrder.price,
            address: selectedOrder.address,
            phone: selectedOrder.phone,
            products: selectedOrder.productTitle,
            allow_open: allowOpen ? 1 : 0,
            allow_try: allowTry ? 1 : 0,
            comment: comment,
            products_from_stock: 0,
            option_exchange: useDeliveryExchange ? 1 : 0,
            delivery_exchange_id: useDeliveryExchange ? "some_exchange_id" : ''
        };

        const token = localStorage.getItem('token');
        console.log('Envoi des données du colis :', parcelData); // Journalisez les données envoyées
        console.log('Token :', token); // Journalisez le jeton

        try {
            const response = await fetch('https://app.sendit.ma/api/v1/deliveries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(parcelData)
            });

            const textResponse = await response.text(); // Obtenez la réponse en tant que texte
            console.log('Réponse :', textResponse); // Journalisez la réponse brute

            if (!response.ok) {
                throw new Error(`Erreur HTTP! statut : ${response.status}, réponse : ${textResponse}`);
            }

            const data = JSON.parse(textResponse); // Essayez de l'analyser en tant que JSON
            console.log('Données de réponse :', data);

            if (data.success) {
                setCreatedParcelOrderId(selectedOrder.docId); // Stockez l'ID de la commande pour laquelle un colis a été créé
                Swal.fire({
                    title: 'Succès!',
                    text: 'Colis ajouté avec succès.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                // Mettez à jour l'état de l'ordre pour indiquer que le colis a été créé
                const orderRef = doc(db, "formSubmissions", selectedOrder.docId);
                await updateDoc(orderRef, {
                    parcelCreatedBy: username // Mettez à jour avec le nom de l'utilisateur
                });
                closeModal(); // Fermez le modal après succès
                fetchOrders(); // Rafraîchir les commandes
            } else {
                Swal.fire({
                    title: 'Erreur!',
                    text: 'Une erreur est survenue lors de l\'ajout du colis.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du colis :', error);
            Swal.fire({
                title: 'Erreur!',
                text: `Une erreur est survenue lors de l'ajout du colis : ${error.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    // Fonction pour confirmer une commande
    const handleConfirmOrder = async (docId) => {
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Vous êtes sur le point de confirmer cette commande. Cette action est irréversible.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, confirmer',
            cancelButtonText: 'Annuler'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const orderRef = doc(db, "formSubmissions", docId);
                await updateDoc(orderRef, {
                    status: 'confirmed',
                    confirmedBy: username
                });

                fetchOrders(); // Rafraîchir les commandes après confirmation
                Swal.fire({
                    title: 'Succès!',
                    text: `La commande a été confirmée par : ${username}.`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }
        });
    };

    // Fonction pour annuler une commande
    const handleCancelOrder = async (docId) => {
        Swal.fire({
            title: 'Êtes-vous sûr d\'annuler cette commande?',
            input: 'textarea',
            inputLabel: 'Raison de l\'annulation (facultatif)',
            inputPlaceholder: 'Écrivez ici la raison...',
            showCancelButton: true,
            confirmButtonText: 'Annuler la commande',
            cancelButtonText: 'Retour'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const cancelReason = result.value || '';
                const orderRef = doc(db, "formSubmissions", docId);
                await updateDoc(orderRef, {
                    status: 'cancelled',
                    cancelledBy: username, // Ajouter qui a annulé
                    cancelReason: cancelReason
                });

                fetchOrders(); // Rafraîchir les commandes après annulation
                Swal.fire({
                    title: 'Commande annulée!',
                    text: `Annulée par : ${username} ${cancelReason ? '\nRaison: ' + cancelReason : ''}`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }
        });
    };

    // Fonction pour afficher la raison d'annulation
    const showCancelReason = (cancelReason, cancelledBy) => {
        Swal.fire({
            title: 'Raison de l\'annulation',
            text: `${cancelReason ? cancelReason : 'Aucune raison fournie'}\n `,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    };

    if (loading) {
        return <div>Chargement des commandes...</div>;
    }

    return (
        <div className="orders-page">
            {orders.length === 0 ? (
                <p>Aucune commande trouvée.</p>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Heure d'achat</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
    {orders.map(order => (
        <React.Fragment key={order.docId}>
            <tr onClick={() => toggleDetails(order.docId)} className="main-row">
                <td>{order.name}</td>
                <td>{order.time}</td>
                <td className={order.status === 'confirmed' ? 'status-green' : order.status === 'cancelled' ? 'status-red' : 'status-pending'}>
                    {order.status === 'confirmed' ? (
                        <>
                            Confirmée par {order.confirmedBy}<br />
                            {order.parcelCreatedBy && <span>Colis créé par {order.parcelCreatedBy}</span>}
                        </>
                    ) : order.status === 'cancelled' ? (
                        <>
                            Annulée par {order.cancelledBy}
                            <p
                                className="btn btn-link p-0"
                                onClick={() => showCancelReason(order.cancelReason, order.cancelledBy)}
                                aria-label="Info"
                            >
                                <i className="fas fa-info-circle" style={{ fontSize: '1.5em', marginLeft: '5px', color: '#4765c3' }}></i>
                            </p>
                        </>
                    ) : (
                        'En attente'
                    )}
                </td>
                <td>
                    {order.status === 'pending' && (
                        <>
                            <button onClick={() => handleConfirmOrder(order.docId)} className="button-confirm">
                                Confirmer
                            </button>
                            <button onClick={() => handleCancelOrder(order.docId)} className="button-cancel">
                                Annuler
                            </button>
                        </>
                    )}
                    {order.status === 'cancelled' && (
                        <span style={{ color: 'red', fontWeight: 'bold' }}> Annulée </span>
                    )}
                    {order.status === 'confirmed' && order.parcelCreatedBy ? ( // Afficher "Ajouté à Sendit" si le colis a été créé
                        <span style={{ fontWeight: 'bold' }}>Colis ajouté a Sendit</span>
                    ) : (
                        order.status === 'confirmed' && (
                            <button onClick={() => openAddParcelModal(order)} className="button-add-parcel">
                                Ajouter Colis
                            </button>
                        )
                    )}
                </td>
            </tr>

            {expandedOrder === order.docId && (
                <tr className="details-row">
                    <td colSpan="5">
                        <div className="details">
                            <p><strong>ID :</strong> {order.id} </p>
                            <p><strong>Nom :</strong> {order.name} </p>
                            <p><strong>Date d'achat :</strong> {order.date} </p>
                            <p><strong>Heure d'achat :</strong> {order.time}</p>
                            <p><strong>Téléphone :</strong> {order.phone}</p>
                            <p><strong>Adresse :</strong> {order.address}</p>
                            <p><strong>Ville :</strong> {order.city}</p>
                            <p><strong>Produit :</strong> {order.productTitle}</p>
                            <p><strong>Quantité :</strong> {order.quantity}</p>
                            <p><strong>Prix :</strong> {order.price} درهم</p>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    ))}
</tbody>
                </table>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Ajouter Colis</h2>
                        <p><strong>Nom :</strong> {selectedOrder.name} </p>

                        <label>Ville de ramassage :</label>
                        <input
                            type="text"
                            placeholder="Rechercher la ville"
                            value={pickupDistrictInput}
                            onChange={(e) => {
                                setPickupDistrictInput(e.target.value);
                                filterDistricts(e.target.value, 'pickup');
                            }}
                        />
                        <select
                            value={pickupDistrictId}
                            onChange={(e) => setPickupDistrictId(Number(e.target.value))}
                        >
                            <option value="">Chargement des villes</option>
                            {filteredPickupDistricts.map(district => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>

                        <label>Ville du client :</label>
                        <input
                            type="text"
                            placeholder="Rechercher la ville"
                            value={selectedDistrictInput}
                            onChange={(e) => {
                                setSelectedDistrictInput(e.target.value);
                                filterDistricts(e.target.value, 'selected');
                            }}
                        />
                        <select
                            value={selectedDistrictId}
                            onChange={(e) => setSelectedDistrictId(Number(e.target.value))}
                        >
                            <option value="">Chargement des villes</option>
                            {filteredSelectedDistricts.map(district => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>

                        <label>Note (facultatif) :</label>
                        <input
                            type="text"
                            placeholder="Ajouter un commentaire"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        <label>
                            <input
                                type="checkbox"
                                checked={allowOpen}
                                onChange={(e) => setAllowOpen(e.target.checked)}
                            />
                            Autoriser à ouvrir
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={allowTry}
                                onChange={(e) => setAllowTry(e.target.checked)}
                            />
                            Autoriser à essayer
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={useDeliveryExchange}
                                onChange={(e) => setUseDeliveryExchange(e.target.checked)}
                            />
                            Utiliser l'échange de livraison
                        </label>

                        <div className="modal-actions">
                            <button onClick={handleAddParcel} className="button-add-parcel">Soumettre</button>
                            <button onClick={closeModal} className="button-cancel">Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;