import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const DoctorDashboard = () => {
    const { protectedAxios, user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({
        name: "", tcNo: "", phone: "", address: "",
        gender: "", age: "", username: "", password: ""
    });
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showVisits, setShowVisits] = useState(false);

    const [editingPrescription, setEditingPrescription] = useState(null);
    const [prescriptionForm, setPrescriptionForm] = useState({ Id: null, Medication: "", Dosage: "", Instructions: "" });
    const [editingVisit, setEditingVisit] = useState(null);
    const [visitForm, setVisitForm] = useState({ diagnosis: '', notes: '' });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPatients = async () => {
        try {
            const res = await protectedAxios.get("/Patient");
            setPatients(res.data);
        } catch (err) {
            console.error("Hasta çekme hatası:", err);
            setError("Hasta listesi çekilirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const addPatient = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const payload = {
                tcNo: form.tcNo,
                phone: form.phone,
                address: form.address,
                BirthDate: new Date(new Date().getFullYear() - parseInt(form.age), 0, 1).toISOString(),
                user: {
                    username: form.username,
                    fullName: form.name,
                    role: "Patient",
                    passwordHash: form.password
                }
            };
            await protectedAxios.post("/Patient", payload);
            alert("Hasta başarıyla eklendi ve ilk kaydı oluşturuldu.");
            fetchPatients();
            setForm({ name: "", tcNo: "", phone: "", address: "", gender: "", age: "", username: "", password: "" });
        } catch (err) {
            console.error("Hasta ekleme hatası:", err.response?.data || err.message);
            setError(err.response?.data?.title || "Hasta eklenirken bir hata oluştu.");
        }
    };

    const toggleVisits = (patient) => {
        if (selectedPatient && selectedPatient.id === patient.id) {
            setShowVisits(!showVisits);
        } else {
            setSelectedPatient(patient);
            setShowVisits(true);
        }
        setEditingVisit(null);
        setEditingPrescription(null);
    };

    
    const startEditPrescription = (prescription) => {
        setEditingVisit(null); 
        setEditingPrescription(prescription);
        setPrescriptionForm({ Id: prescription.id, Medication: prescription.medication, Dosage: prescription.dosage, Instructions: prescription.instructions });
    };

    const updatePrescription = async () => {
        if (!editingPrescription) return;
        try {
            const payload = { ...prescriptionForm };
            await protectedAxios.put(`/Prescriptions/${editingPrescription.id}`, payload);
            alert("Reçete başarıyla güncellendi.");
            setEditingPrescription(null);
            fetchPatients();
        } catch (err) {
            console.error("Reçete güncelleme hatası:", err.response?.data || err.message);
            setError("Reçete güncellenemedi. Yetkiniz olmayabilir.");
        }
    };

    const startEditVisit = (visit) => {
        setEditingPrescription(null); 
        setEditingVisit(visit);
        setVisitForm({ diagnosis: visit.diagnosis, notes: visit.notes });
    };

    const handleVisitUpdate = async () => {
        if (!editingVisit) return;
        try {
            const payload = { ...visitForm, id: editingVisit.id };
            await protectedAxios.put(`/Visits/${editingVisit.id}`, payload);
            alert("Tanı bilgileri güncellendi.");
            setEditingVisit(null);
            fetchPatients();
        } catch (err) {
            console.error("Tanı güncelleme hatası:", err);
            const errorData = err.response?.data;
            const errorMessage = typeof errorData === 'string' 
                ? errorData 
                : JSON.stringify(errorData, null, 2);
            setError(`Backend Hatası: ${errorMessage || err.message}`);
        }
    };

    if (loading) return <div className="p-5 text-center">Yükleniyor...</div>;
    if (error) return <div className="p-5 text-center alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4 text-primary">Doktor Paneli - Hasta Yönetimi</h1>
            <p className="lead text-center mb-4">Hoş geldiniz, Dr. {user.fullName}.</p>

            <h2 className="text-center mb-4">Yeni Hasta Ekleme</h2>
            <form onSubmit={addPatient} className="card p-4 shadow-sm mb-5">
                <div className="row g-3">
                    <div className="col-md-6"><label className="form-label">Ad Soyad</label><input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                    <div className="col-md-6"><label className="form-label">TC No</label><input type="text" className="form-control" value={form.tcNo} onChange={e => setForm({ ...form, tcNo: e.target.value })} required /></div>
                    <div className="col-md-6"><label className="form-label">Telefon</label><input type="text" className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                    <div className="col-md-6"><label className="form-label">Adres</label><input type="text" className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                    <div className="col-md-4"><label className="form-label">Yaş</label><input type="number" className="form-control" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required /></div>
                    <div className="col-md-4"><label className="form-label">Kullanıcı Adı</label><input type="text" className="form-control" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required /></div>
                    <div className="col-md-4"><label className="form-label">Şifre</label><input type="password" className="form-control" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
                    <div className="col-12"><button type="submit" className="btn btn-success w-100 mt-3">Hasta ve Kullanıcı Ekle</button></div>
                </div>
            </form>

            <h3 className="mb-3">Tüm Hasta Kayıtları</h3>
            <ul className="list-group mb-4">
                {patients.map(p => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{p.user?.fullName ?? "Adı Belirtilmemiş"} - TC: {p.tcNo}</span>
                        <button className="btn btn-sm btn-info" onClick={() => toggleVisits(p)}>Ziyaretleri/Reçeteleri Gör</button>
                    </li>
                ))}
            </ul>

            {showVisits && selectedPatient && (
                <div className="card p-3 shadow-sm mt-4">
                    <h5>{selectedPatient.user.fullName} - Ziyaret ve Reçeteler</h5>
                    {selectedPatient.visits && selectedPatient.visits.length > 0 ? (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Tarih</th>
                                    <th>Tanı (Diagnosis)</th>
                                    <th>Notlar (Notes)</th>
                                    <th>Reçeteler</th>
                                    <th>İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedPatient.visits.map((v) => (
                                    <tr key={v.id}>
                                        <td>{new Date(v.date).toLocaleDateString()}</td>
                                        <td>{v.diagnosis || "Yok"}</td>
                                        <td>{v.notes || "Yok"}</td>
                                        <td>
                                            {v.prescriptions.map((pres) => (
                                                <div key={pres.id} className="d-flex align-items-center mb-1 pb-1">
                                                    <span className='me-2'>{pres.medication} ({pres.dosage})</span>
                                                    <button className="btn btn-sm btn-warning" onClick={() => startEditPrescription(pres)}>Reçete Düzenle</button>
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-primary" onClick={() => startEditVisit(v)}>Tanı/Not Düzenle</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>Henüz ziyaret veya reçete kaydı bulunamadı.</p>}
                    
                    {/* Ziyaret Düzenleme Formu */}
                    {editingVisit && (
                        <div className="card p-3 mt-4 border-info">
                            <h6 className="mb-3">Ziyareti Düzenle (Tarih: {new Date(editingVisit.date).toLocaleDateString()})</h6>
                            <div className="mb-2">
                                <label className="form-label">Tanı (Diagnosis)</label>
                                <input type="text" className="form-control" value={visitForm.diagnosis} onChange={e => setVisitForm({ ...visitForm, diagnosis: e.target.value })}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Notlar (Notes)</label>
                                <textarea className="form-control" rows="3" value={visitForm.notes} onChange={e => setVisitForm({ ...visitForm, notes: e.target.value })}></textarea>
                            </div>
                            <div className="d-flex">
                                <button className="btn btn-success me-2" onClick={handleVisitUpdate}>Değişiklikleri Kaydet</button>
                                <button className="btn btn-secondary" onClick={() => setEditingVisit(null)}>İptal</button>
                            </div>
                        </div>
                    )}

                    {/* Reçete Düzenleme Formu */}
                    {editingPrescription && (
                        <div className="card p-3 mt-3 border-primary">
                            <h6>Reçeteyi Düzenle (ID: {editingPrescription.id})</h6>
                            <input type="text" className="form-control mb-2" placeholder="İlaç (Medication)" value={prescriptionForm.Medication} onChange={e => setPrescriptionForm({ ...prescriptionForm, Medication: e.target.value })} />
                            <input type="text" className="form-control mb-2" placeholder="Dozaj (Dosage)" value={prescriptionForm.Dosage} onChange={e => setPrescriptionForm({ ...prescriptionForm, Dosage: e.target.value })} />
                            <input type="text" className="form-control mb-2" placeholder="Talimatlar (Instructions)" value={prescriptionForm.Instructions} onChange={e => setPrescriptionForm({ ...prescriptionForm, Instructions: e.target.value })} />
                            <div className='d-flex'>
                                <button className="btn btn-success me-2" onClick={updatePrescription}>Kaydet ve Güncelle</button>
                                <button className="btn btn-secondary" onClick={() => setEditingPrescription(null)}>İptal</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;