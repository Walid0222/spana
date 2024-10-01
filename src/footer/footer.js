import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>iMarket</h3>
          <p>التوصيل خلال 24 ساعة - الدفع عند الاستلام</p>
        </div>

        <div className="footer-column">
          <h3>روابط سريعة</h3>
          <ul>
            <li><a href="/">الرئيسية</a></li>
            <li><a href="/collections">المجموعات</a></li>
            <li><a href="/contact">اتصل بنا</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>اتصل بنا</h3>
          <p>contact.imarketma@gmail.com</p>
{/*           <p> +212</p>
 */}          <div className="social-icons">
            <a href="https://facebook.com"><i className="fab fa-facebook"></i></a>
            <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
            <a href="https://instagram.com"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 iMarket - جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
};

export default Footer;