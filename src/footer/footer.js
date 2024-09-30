import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>iMarket</h3>
          <p>Livraison sous 24 heures - paiement à la livraison</p>
        </div>

        <div className="footer-column">
          <h3>Liens rapides</h3>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/collections">Collections</a></li>
            <li><a href="/contact">Contactez-nous</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>
          <p>Email : contact.imarketma@gmail.com</p>
          <p>Téléphone : +212</p>
          <div className="social-icons">
            <a href="https://facebook.com"><i className="fab fa-facebook"></i></a>
            <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
            <a href="https://instagram.com"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 iMarket - Tous droits réservés</p>
      </div>
    </footer>
  );
};

export default Footer;