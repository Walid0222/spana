import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './header/header';
import ProductList from './products/ProductList';
import ProductPage from './products/ProductPage';
import OrdersPage from './orders/OrdersPage';
import Footer from './footer/footer';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Login from './components/Login'; // La page de connexion
import ProtectedRoute from './components/ProtectedRoute'; // La route protégée
import FacebookPixel from './FacebookPixel'; // Make sure the path is correct

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('auth') === 'true');
  const [showPopup, setShowPopup] = useState(false);
  const [showFirstPopup, setShowFirstPopup] = useState(false); // Nouveau state pour le premier pop-up

  const location = useLocation();

  useEffect(() => {
    // Afficher le premier pop-up après 5 secondes
    const timerFirstPopup = setTimeout(() => {
      setShowFirstPopup(true);
    }, 1000);

    return () => clearTimeout(timerFirstPopup); // Nettoyage du timer
  }, []);

  useEffect(() => {
    // Afficher le deuxième pop-up après 10 secondes
    const timerSecondPopup = setTimeout(() => {
      setShowPopup(true);
    }, 22000);

    return () => clearTimeout(timerSecondPopup); // Nettoyage du timer
  }, []);

  useEffect(() => {
    // Charger Tawk.to uniquement si la route actuelle n'est pas OrdersPage
    if (!location.pathname.startsWith('/orderspage') && !location.pathname.startsWith('/login')) {
      var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
      (function () {
        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/67b87235045d091905c8c2b9/1ikk7s8ur'; // Votre code d'intégration
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
      })();
    }
  }, [location.pathname]); // Exécutez l'effet chaque fois que la route change


  return (
    <div className="App">
      <FacebookPixel /> {/* Add the Facebook Pixel component here */}
      <Header />
      <Routes>
        <Route path="/login" element={<Login onLogin={setIsAuthenticated} />} />

        {/* Route protégée */}
        <Route
          path="/OrdersPage"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:productId" element={<ProductPage />} />
      </Routes>
      <Footer />
      {!location.pathname.startsWith('/orderspage' && !location.pathname.startsWith('/login')) && (
        <a
          href="https://wa.me/+2126" // Remplacez avec votre numéro de téléphone
          className="whatsapp_float"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp whatsapp-icon"></i>
        </a>
      )}

      {/* Premier pop-up */}
      {showFirstPopup && (
        <div className="popup">
          <div className="popup-content">
          <p>
{/*     نحن متجر إسباني يقع في <strong>مدريد، إسبانيا</strong>.
 */}    <br />
    نقدم خدمات الشحن إلى المغرب والسعودية مع توصيل في غضون 
    <strong>24 إلى 48 ساعة</strong> كحد أقصى.
    <br />
    <span className="popup-flags">🇪🇸</span>
    <span className="popup-flags">🇲🇦</span>
    <span className="popup-flags">🇸🇦</span>
  </p>

  <p className="popup-warranty">
    نحن نقدم <strong>ضمان حقيقي</strong> على جميع منتجاتنا، لتكون مطمئنًا حول جودتها وأدائها.
    <br />
    في حال واجهت أي مشكلة مع المنتج، <strong>فريقنا المختص في التوصيل</strong> سيقوم 
    <strong>بإستلام المنتج من عندك</strong> واستبداله أو <strong>إرجاع المبلغ المالي</strong> لك.
  </p>

  <div className="popup-buttons">
    <button
      className="popup-close-btn"
      onClick={() => setShowFirstPopup(false)}
    >
      إغلاق
    </button>
  </div>
</div>

          </div>
      )}

          {/* Deuxième pop-up */}
          {/* {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <p>
                  إلا عندك شي سؤال على منتج او بغيتي تدير(ي) الطلب ديالك عبر الواتساب، ماعليك غي تسيفط(ي)  لينا ميساج وغادي نجاوبوك ف أقرب وقت 😊
                </p>
                <div className="popup-buttons">
                  <a
                    href="https://wa.me/+2126"
                    className="popup-whatsapp-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-whatsapp"></i> اسألنا
                  </a>
                  <button
                    className="popup-close-btn"
                    onClick={() => setShowPopup(false)}
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          )} */}

        </div>
      );
}

      function App() {
  return (
      <Router>
        <AppContent />
      </Router>
      );
}

      export default App;
