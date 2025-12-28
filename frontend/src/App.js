
import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from './AuthContext';
import LoginComponent from './Login';
import About from "./About";
import DoctorDashboard from './DoctorDashboard';
import PatientRecords from './PatientRecords';
import './App.css';


const AppContent = () => {
    
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            
            if (window.location.pathname === '/login') {
                if (user.role === 'Doctor') {
                    navigate('/'); 
                } else if (user.role === 'Patient') {
                    navigate('/my-records'); 
                }
            }
        }
    }, [isAuthenticated, user, navigate]);



    const renderContent = () => {
        if (!isAuthenticated) {
           
            return <LoginComponent />;
        }

        if (user.role === 'Doctor') {
            return <DoctorDashboard />;
        } else if (user.role === 'Patient') {
            return <PatientRecords />;
        } else {
            
            return (
                <div className="container mt-5 p-5 text-center">
                    <h2 className="text-warning">Yetkilendirme Gerekli</h2>
                    <p>Hoş geldiniz, {user.fullName}! Rolünüz: {user.role}. Bu rol için özel bir panel tanımlanmadı.</p>
                </div>
            );
        }
    };

    return (
        <div className="App d-flex flex-column min-vh-100">
            {isAuthenticated && (
              
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <div className="container">
                        <Link className="navbar-brand" to="/">🏥 Hasta Sistemi</Link>
                        <div>
                            <span className="navbar-text text-light me-3">
                                Merhaba, {user.fullName} ({user.role})
                            </span>

                            {/* Role Bazlı Navigasyon Linkleri */}
                            {user.role === 'Doctor' && (
                                <Link className="nav-link text-light d-inline mx-2" to="/">Hasta Listesi</Link>
                            )}
                            {user.role === 'Patient' && (
                                <Link className="nav-link text-light d-inline mx-2" to="/my-records">Kayıtlarım</Link>
                            )}
                            <Link className="nav-link text-light d-inline mx-2" to="/about">Hakkında</Link>
                            <button className="btn btn-warning btn-sm ms-3" onClick={logout}>Çıkış Yap</button>
                        </div>
                    </div>
                </nav>
            )}

            <main className="flex-grow-1">
                <Routes>
                    {/* Login Sayfası */}
                    <Route path="/login" element={<LoginComponent />} />

                    {/* Ana Sayfa: */}
                    <Route path="/" element={isAuthenticated && user?.role === 'Doctor' ? <DoctorDashboard /> : renderContent()} />

                    {/* Hasta Kayıtları Sayfası*/}
                    <Route path="/my-records" element={isAuthenticated && user?.role === 'Patient' ? <PatientRecords /> : renderContent()} />

                    {/* Hakkında Sayfası */}
                    <Route path="/about" element={<About />} />

                    {/* Diğer tüm rotalar */}
                    <Route path="*" element={renderContent()} />

                </Routes>
            </main>

            <footer className="footer mt-auto py-3 bg-dark text-light text-center">
                <div className="container">
                    <p className="mb-1">📍 Ankara, Türkiye</p>
                    <p className="mb-1">📞 info@hospitalsystem.com | ☎️ +90 (312) 555 55 55</p>
                    <p className="mb-0">© 2025 Hasta Takip ve Reçete Yönetim Sistemi</p>
                </div>
            </footer>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;