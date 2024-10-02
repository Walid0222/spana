import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';  
import Header from './header/header';  
import ProductList from './products/ProductList';  
import ProductPage from './products/ProductPage';  
import Footer from './footer/footer';  
import './App.css';

function AppContent() {
  const location = useLocation(); 

  useEffect(() => {
    // Code d'intégration Tawk.to
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function() {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/66fc8eab4cbc4814f7e1c187/1i958qjgl'; // Votre code d'intégration
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:productName" element={<ProductPage />} />
      </Routes>
      <Footer />
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