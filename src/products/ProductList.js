import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { Link } from 'react-router-dom';
import productsData from '../db/products.json'; // Importer le fichier JSON des produits

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productsData); // Charger les produits depuis le fichier JSON
  }, []);

  return (
    <div className="product-section">
      {products.map((product, index) => (
        <div key={index} className="product-card">
          <img src={product.primaryImage} alt={product.name} className="product-image" />
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">
            <span className="old-price">{product.oldPrice}</span> <span className="new-price">{product.price}</span>
          </p>
          <Link to={`/product/${encodeURIComponent(product.name)}`} className="view-details">
            Voir les détails
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;