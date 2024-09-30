import React, { useState } from 'react';
import './header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <div className="header-top">
                <p>عرض خاص: التوصيل بالمجان و الدفع عند الاستلام</p>
                <p style={{fontWeight:'bold'}}> اسرع واطلب الآن
                </p>
            </div>

            <header className="header-main">
                <div className="logo">
                    <h1>iMarket</h1>
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
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Collections</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </nav>

                {/* <div className="cart">
          <a href="/cart">
            <span className="cart-icon">🛒</span> 0 MAD
          </a>
        </div> */}
            </header>

            {/* Overlay pour le fond lorsqu'on ouvre le menu */}
            {menuOpen && <div className="backdrop" onClick={toggleMenu}></div>}
        </>
    );
};

export default Header;