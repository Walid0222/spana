import React, { useState } from 'react';
import './header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <div className="header-top">
                <p style={{ fontSize: '15px', fontWeight: 'bold' }}>✨ عرض خاص: التوصيل بالمجان و الدفع عند الاستلام 🚚</p>
                <p style={{ fontWeight: 'bold', fontSize: '17px' }}> سارع واطلب الآن ⏰</p>
            </div>

            <header className="header-main">
                <div className="cart-login">
                <Link to="/login">
                        {/* Icône de connexion */}
                        <span className="login-icon"><i className="fas fa-user"></i></span>
                    </Link>
                    <Link to="">
                        {/* Icône de panier */}
                        <span className="cart-icon"><i className="fas fa-shopping-cart"></i></span>
                    </Link>
                    
                </div>
                
                <div className="logo">
                    <h1>
                        <a href="/">
                            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="logo-image" />
                        </a>
                    </h1>
                </div>

                {/* Bouton menu burger pour petits écrans */}
                <div className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </div>

                <nav className={`side-drawer ${menuOpen ? 'open' : ''}`}>
                    <div className="close-btn" onClick={toggleMenu}>
                        &times;
                    </div>
                    <ul>
                        <li><a href="#">الرئيسية</a></li>
                        <li><a href="#">المجموعات</a></li>
                        <li><a href="#">اتصل بنا</a></li>
                        </ul>
                </nav>
            </header>

            {/* Overlay pour le fond lorsqu'on ouvre le menu */}
            {menuOpen && <div className="backdrop" onClick={toggleMenu}></div>}
        </>
    );
};

export default Header;