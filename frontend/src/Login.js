import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError("Kullanıcı adı ve şifre boş bırakılamaz.");
            return;
        }

        try {
            const result = await login(username, password);

            
            if (result.role === 'Doctor') {
                navigate('/'); 
            } else if (result.role === 'Patient') {
                navigate('/my-records'); 
            } else {
                navigate('/'); 
            }

        } catch (err) {
           
            setError(err.message || "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
            setPassword(''); 
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: '400px' }}>
                <h2 className="card-title text-center mb-4 text-primary">Kullanıcı Girişi</h2>

                {error && <div className="alert alert-danger" role="alert">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Kullanıcı Adı</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Şifre</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Giriş Yapılıyor...
                            </>
                        ) : 'Giriş Yap'}
                    </button>
                </form>
                <p className="text-center mt-3 text-muted">Yetkiniz mi yok? Yönetici ile iletişime geçin.</p>
            </div>
        </div>
    );
};

export default LoginComponent;