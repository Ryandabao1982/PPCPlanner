import React, { useState } from 'react';

interface UserLoginModalProps {
    onLogin: (username: string) => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedUsername = username.trim();
        
        if (!trimmedUsername) {
            setError('Please enter a username');
            return;
        }
        
        if (trimmedUsername.length < 2) {
            setError('Username must be at least 2 characters');
            return;
        }
        
        onLogin(trimmedUsername);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content user-login-modal">
                <div className="modal-header">
                    <i className="fa-solid fa-user-circle modal-icon"></i>
                    <h2>Welcome to PPC Planner</h2>
                    <p className="modal-subtitle">Please enter your name to continue</p>
                </div>
                
                <form onSubmit={handleSubmit} className="user-login-form">
                    <div className="form-group">
                        <label htmlFor="username">Your Name</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g., John Doe"
                            autoFocus
                            className={error ? 'input-error' : ''}
                        />
                        {error && <span className="error-message">{error}</span>}
                    </div>
                    
                    <button type="submit" className="btn btn-primary">
                        <i className="fa-solid fa-check"></i>
                        Continue
                    </button>
                </form>
                
                <p className="modal-note">
                    <i className="fa-solid fa-info-circle"></i>
                    This information is stored locally on your device and helps track tool usage.
                </p>
            </div>
        </div>
    );
};
