import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Ajouter plusieurs utilisateurs ici
        const validUsers = {
            'abdbk': 'abdbk',
            'walid': 'walid'
        };

        // Vérification si le login et mot de passe sont corrects
        if (validUsers[username] && validUsers[username] === password) {

            const loginData = {
                "public_key": "e0ed77ed811d84a706365e65caa6ded6",
                "secret_key": "tVYDdomF4onzjrJgGPxaRL5t9FQ6R8ex"
            };

            try {
                // Effectuer la requête POST vers l'API
                const response = await fetch('https://app.sendit.ma/api/v1/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });

                const data = await response.json();

                if (data.success) {
                    // Sauvegarder le token et l'authentification dans localStorage
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('auth', 'true');  // Marquer l'utilisateur comme connecté
                    localStorage.setItem('username', username); // Stocker le nom d'utilisateur connecté

                    // Rediriger vers la page protégée
                    navigate('/orderspage');
                } else {
                    setError('Login ou mot de passe incorrect.');
                }
            } catch (error) {
                setError('Une erreur est survenue lors de la connexion.');
                console.error('Erreur lors de la requête API:', error);
            }
        } else {
            setError('Nom d\'utilisateur ou mot de passe incorrect.');
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