import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { Link } from 'react-router-dom';
import productsData from '../db/products.json'; // Importer le fichier JSON des produits

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setProducts(productsData); // Charger les produits depuis le fichier JSON
    const uniqueCategories = [...new Set(productsData.map(product => product.category))];
    setCategories(uniqueCategories); // Obtenir les catégories uniques
  }, []);

  // Fonction pour générer un stock aléatoire entre 2 et 15
  const getRandomStock = () => {
    return Math.floor(Math.random() * (15 - 2 + 1)) + 2;
  };

  return (
    
    <div className="product-section">
      <div className="banner">
      <img src={`${process.env.PUBLIC_URL}/banner.png`} alt="Bannière" className="banner-image" />
      
    </div>

      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="category-section">
          <h2 className="section-title"><span>{category}</span></h2>
          <div className="product-grid">
            {products
              .filter(product => product.category === category)
              .map((product, index) => (
                <div key={index} className="product-card">

                  <Link to={`/product/${encodeURIComponent(product.name)}`} className="view-details">
                    <img src={product.primaryImage} alt={product.name} className="product-image" />
                    <h2 className="categoryCard">{category}</h2>

                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">
                      <span className="new-price">{product.price}Dh</span>
                      <span className="old-price">{product.oldPrice}Dh</span>
                    </p>
                    <div className="product-stock">
                      Stock: {getRandomStock()} {/* Affichage du stock aléatoire */}
                    </div>
                    <div className="product-rating">
                      {/* Affichage des étoiles et du nombre d'étoiles entre parenthèses */}
                      <span className="stars">
                        {'★'.repeat(product.rating)} {/* Afficher le nombre d'étoiles basé sur la note */}
                        {'☆'.repeat(5 - product.rating)} {/* Compléter jusqu'à 5 étoiles */}
                      </span>
                      <span className="rating-count"> ({product.rating})</span> {/* Nombre d'étoiles entre parenthèses */}
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;