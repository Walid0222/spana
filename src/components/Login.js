import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Ajouter plusieurs utilisateurs ici
        const validUsers = {
            'abdbk': 'abdbk',
            'walid': 'walid'
        };

        // Vérification si le login et mot de passe sont corrects
        if (validUsers[username] && validUsers[username] === password) {
            localStorage.setItem('auth', 'true');  // Marquer l'utilisateur comme connecté
            localStorage.setItem('username', username); // Stocker le nom d'utilisateur connecté
            navigate('/orderspage'); // Rediriger vers la page protégée
        } else {
            setError('Login ou mot de passe incorrect.');
        }
    };

    return (
        <div className="login-page">
            <h2></h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default Login;