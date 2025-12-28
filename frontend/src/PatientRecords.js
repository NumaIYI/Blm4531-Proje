import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientRecords = () => {
    const { protectedAxios, user } = useAuth();
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const fetchMyRecords = async () => {
        if (!user || user.role !== 'Patient') {
            setError("Yetkisiz erisim veya rol uyusmazlik.");
            setLoading(false);
            return;
        }

        try {
          
            const res = await protectedAxios.get(`/Patient/user/${user.userId}`);
            setPatientData(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Kayit cekme hatasi:", err.response?.data || err.message);
            setError("Kendi kayitlariniz cekilirken bir hata olustu. Erisim reddedildi.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRecords();
    }, [user]);

    if (loading) return <div className="p-5 text-center">Kisisel Kayitlariniz Yukleniyor...</div>;
    if (error) return <div className="p-5 text-center alert alert-danger">{error}</div>;
    if (!patientData) return <div className="p-5 text-center">Kayit Bulunamadi.</div>;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4 text-info">Hasta Paneli - Kendi Kayıtlarım</h1>
            <div className="card shadow-lg p-4 mb-4">
                <h3 className='text-primary'>{patientData.user.fullName}</h3>
                <p><strong>TC Kimlik No:</strong> {patientData.tcNo}</p>
                <p><strong>Telefon:</strong> {patientData.phone}</p>
                <p><strong>Adres:</strong> {patientData.address}</p>

                <h4 className='mt-4 border-bottom pb-2'>Tanı ve Reçete</h4>

                {patientData.visits && patientData.visits.length > 0 ? (
                    patientData.visits.map((v, idx) => (
                        <div key={idx} className="card p-3 mb-3 bg-light">
                            <p><strong>Tanı Tarihi:</strong> {new Date(v.date).toLocaleDateString()}</p>
                            <p><strong>Tanı:</strong> {v.diagnosis || 'Belirtilmemiş'}</p>
                            <p><strong>Notlar:</strong> {v.notes || 'Yok'}</p>

                            <h6 className='mt-2'>Reçeteler:</h6>
                            <ul className='list-group list-group-flush'>
                                {v.prescriptions.map((pres, i) => (
                                    <li key={i} className="list-group-item d-flex justify-content-between bg-transparent">
                                        <span>
                                            <strong className='text-success'>{pres.medication}</strong> - Dozaj: {pres.dosage}
                                        </span>
                                        <span className='text-muted'>
                                            Talimat: {pres.instructions}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>Size ait gecmis muayene veya recete kaydi bulunmamaktadir.</p>
                )}
            </div>
        </div>
    );
};

export default PatientRecords;