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

  const location = useLocation();

  useEffect(() => {
    // Afficher le pop-up après 10 secondes
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 12000);

    return () => clearTimeout(timer); // Nettoyage du timer
  }, []);

  useEffect(() => {
    // Charger Tawk.to uniquement si la route actuelle n'est pas OrdersPage
    if (!location.pathname.startsWith('/orderspage') && !location.pathname.startsWith('/login')) {
      var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
      (function () {
        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/66fc8eab4cbc4814f7e1c187/1i958qjgl'; // Votre code d'intégration
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
          href="https://wa.me/+212678811463" // Remplacez avec votre numéro de téléphone
          className="whatsapp_float"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp whatsapp-icon"></i>
        </a>
      )}

      {/* Pop-up */}
      {showPopup && (
  <div className="popup">
    <div className="popup-content">
      <p>
        إلا عندك شي سؤال على منتج او بغيتي تدير(ي) الطلب ديالك عبر الواتساب، ماعليك غي تسيفط(ي)  لينا ميساج وغادي نجاوبوك ف أقرب وقت 😊
      </p>
      <div className="popup-buttons">
        <a
          href="https://wa.me/+212678811463"
          className="popup-whatsapp-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp"></i> اسألنا
        </a>
        {/* Nouveau bouton "إغلاق" à côté */}
        <button
          className="popup-close-btn"
          onClick={() => setShowPopup(false)}
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
)}

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
