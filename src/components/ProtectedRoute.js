import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('auth') === 'true');

    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.removeItem('auth'); // Retirer l'authentification après 5 minutes
            setIsAuthenticated(false);
        }, 5 * 60 * 1000); // 5 minutes en millisecondes

        return () => clearTimeout(timeout); // Nettoyer le timeout si le composant est démonté
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/login" />; // Si non authentifié, rediriger vers login
    }

    return children; // Sinon, afficher le contenu de la route protégée
};

export default ProtectedRoute;