import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { Link } from 'react-router-dom';
import productsData from '../db/products.json';
import BannerPromo from './BannerPromo';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stock, setStock] = useState({}); // État pour stock des produits

  useEffect(() => {
    setProducts(productsData);
    const uniqueCategories = [...new Set(productsData.map(product => product.category))];
    setCategories(uniqueCategories);

    // Initialiser le stock uniquement lors du chargement de la page
    const initialStock = {};
    productsData.forEach(product => {
      initialStock[product.name] = getRandomStock(); // Générer un stock aléatoire
    });
    setStock(initialStock);
  }, []);

  const getRandomStock = () => {
    return Math.floor(Math.random() * (15 - 2 + 1)) + 2;
  };

  return (
    <div className="product-section">
            <BannerPromo />

      <div className="bannerPromo">
        
        <p className="promotion-text"> 🎉 تخفيض %57 على هذه المنتجات! لا تفوت الفرصة! 🎉
        </p>
      </div>

      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="category-section">
          <h2 className="section-title"><span>{category}</span></h2>
          <div className="product-grid">
            {products
              .filter(product => product.category === category)
              .map((product, index) => (
                <div key={index} className="product-card">
                  <Link to={product.stock === "out of stock" ? "#" : `/product/${product.id}`} className={`view-details ${product.stock === "out of stock" ? "disabled-link" : ""}`}>                    <img src={product.primaryImage} alt={product.name} className="product-image" />
                    <h2 className="categoryCard">{category}</h2>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">
                      <span className="new-price">{product.price} Dh</span>
                      <span className="old-price">{product.oldPrice} Dh</span>
                      <span className="bonus">{product.bonus}</span>

                    </p>
                  {/*   <span className="garantie">Garantie incluse</span>
                    <div className="promotion-badge">Promo -65%</div> */}

                    {product.stock === "out of stock" ? (
                      <div className="promotion-badge">Rupture de stock</div>
                    ) : (
                      <div className="product-stock">
                        Stock: {stock[product.name]} {/* Affichage du stock basé sur l'état */}
                      </div>
                    )}

                    <div className="product-rating">
                      <span className="stars">
                        {'★'.repeat(product.rating)}
                        {'☆'.repeat(5 - product.rating)}
                      </span>
                      <span className="rating-count"> ({product.nombreRating}) Satisfait</span>
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