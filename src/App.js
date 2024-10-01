import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';  // Tout importé ici
import Header from './header/header';  
import ProductList from './products/ProductList';  
import ProductPage from './products/ProductPage';  
import Footer from './footer/footer';  
import './App.css';

function AppContent() {
  const location = useLocation();  // On utilise useLocation à l'intérieur d'un composant encapsulé dans Router

  return (
    <div className="App">
      <Header />
      {/* Afficher la bannière seulement sur la page d'accueil */}
      
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
      {/* Le contenu principal de l'application */}
      <AppContent />
    </Router>
  );
}

export default App;