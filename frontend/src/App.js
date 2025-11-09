import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./About"; 
import './App.css';


function App() {
    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({
        name: "",
        tcNo: "",
        phone: "",
        address: "",
        gender: "",
        age: "",
        username: "",
        password: ""
    });
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showVisits, setShowVisits] = useState(false);
    const [editingPrescription, setEditingPrescription] = useState(null);
    const [prescriptionForm, setPrescriptionForm] = useState({
        Id: null,
        Medication: "",
        Dosage: "",
        Instructions: ""
    });

    const fetchPatients = async () => {
        const res = await axios.get("http://localhost:5028/api/Patients");
        setPatients(res.data);
    };

    const addPatient = async (e) => {
        e.preventDefault();
        const payload = {
            name: form.name,
            tcNo: form.tcNo,
            phone: form.phone,
            address: form.address,
            age: parseInt(form.age),
            gender: form.gender,
            user: {
                username: form.username,
                fullName: form.name,
                role: "Patient",
                passwordHash: form.password
            },
            visits: []
        };
        await axios.post("http://localhost:5028/api/Patients", payload);
        fetchPatients();
        setForm({
            name: "", tcNo: "", phone: "", address: "",
            gender: "", age: "", username: "", password: ""
        });
    };

    const toggleVisits = (patient) => {
        if (selectedPatient && selectedPatient.id === patient.id) {
            setShowVisits(!showVisits);
        } else {
            setSelectedPatient(patient);
            setShowVisits(true);
        }
    };

    const startEditPrescription = (prescription) => {
        setEditingPrescription(prescription);
        setPrescriptionForm({
            Id: prescription.id,
            Medication: prescription.medication,
            Dosage: prescription.dosage,
            Instructions: prescription.instructions
        });
    };

    const updatePrescription = async () => {
        if (!editingPrescription) return;

        try {
            const payload = {
                Id: editingPrescription.id,
                Medication: prescriptionForm.Medication,
                Dosage: prescriptionForm.Dosage,
                Instructions: prescriptionForm.Instructions
            };

            const res = await axios.put(
                `http://localhost:5028/api/prescriptions/${editingPrescription.id}`,
                payload
            );

            const updatedPrescription = res.data;

            setSelectedPatient(prev => ({
                ...prev,
                visits: prev.visits.map(v => ({
                    ...v,
                    prescriptions: v.prescriptions.map(pr =>
                        pr.id === updatedPrescription.id ? updatedPrescription : pr
                    )
                }))
            }));

            setEditingPrescription(null);
            setPrescriptionForm({ Id: null, Medication: "", Dosage: "", Instructions: "" });
        } catch (err) {
            console.error("Güncelleme hatası:", err);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div className="App">
            <Router>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <Link className="navbar-brand" to="/">🏥 Hasta Sistemi</Link>
                    <div>
                        <Link className="nav-link text-light d-inline mx-2" to="/">Ana Sayfa</Link>
                        <Link className="nav-link text-light d-inline mx-2" to="/about">Hakkında</Link>
                    </div>
                </div>
            </nav>
            

                    {/* Sayfa içeriği */}
            <Routes>
                    <Route path="/" element={
                    <div className="main-content">
                            <div className="container mt-5">
                                <h1 className="text-center mb-4">🏥 Hasta Takip ve Reçete Yönetim Sistemi</h1>

                                <div className="intro-paragraph mb-4 p-3 bg-light rounded shadow-sm">
                                    Bu uygulama, hastaların kayıtlarını ve reçetelerini dijital ortamda takip etmek için geliştirilmiştir.
                                    Kullanıcılar, hasta ekleme, reçete düzenleme, ziyaret geçmişini görüntüleme ve güncel tedavi bilgilerini
                                    kolayca yönetebilir. Ayrıca, sistem sayesinde hastane personeli zaman kaybetmeden verimli bir şekilde
                                    hasta bilgilerine ulaşabilir, tedavi süreçlerini planlayabilir ve geçmiş reçeteleri inceleyebilir.
                                    Bu sayede hem hasta memnuniyeti artar hem de sağlık hizmetlerinin kalitesi yükselir.
                                </div>
                        <h2 className="text-center mb-4">Hasta Ekleme</h2>

                        <form onSubmit={addPatient} className="card p-4 shadow-sm mb-5">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Ad Soyad</label>
                                    <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">TC No</label>
                                    <input type="text" className="form-control" value={form.tcNo} onChange={e => setForm({ ...form, tcNo: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Telefon</label>
                                    <input type="text" className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Adres</label>
                                    <input type="text" className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Cinsiyet</label>
                                    <input type="text" className="form-control" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Yaş</label>
                                    <input type="number" className="form-control" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Kullanıcı Adı</label>
                                    <input type="text" className="form-control" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Şifre</label>
                                    <input type="password" className="form-control" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary w-100 mt-3">Hasta Ekle</button>
                                </div>
                            </div>
                        </form>

                        <h3 className="mb-3">Hasta Listesi</h3>
                        <ul className="list-group mb-4">
                            {patients.map(p => (
                                <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{p.user?.fullName ?? "No Name"} – {p.tcNo} – {p.phone}</span>
                                    <button className="btn btn-sm btn-info" onClick={() => toggleVisits(p)}>Reçeteleri Gör</button>
                                </li>
                            ))}
                        </ul>

                        {showVisits && selectedPatient && (
                            <div className="card p-3 shadow-sm">
                                <h5>{selectedPatient.user.fullName} – Ziyaret ve Reçeteler</h5>
                                {selectedPatient.visits.length === 0 ? (
                                    <p>Henüz ziyaret veya reçete yok.</p>
                                ) : (
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Tarih</th>
                                                <th>Tanı</th>
                                                <th>Notlar</th>
                                                <th>Reçeteler</th>
                                                <th>İşlem</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPatient.visits.map((v, idx) => (
                                                <tr key={idx}>
                                                    <td>{v.date}</td>
                                                    <td>{v.diagnosis}</td>
                                                    <td>{v.notes}</td>
                                                    <td>
                                                        {v.prescriptions.map((pres, i) => (
                                                            <div key={i} className="d-flex align-items-center">
                                                                {pres.medication} – {pres.dosage} – {pres.instructions}
                                                                <button className="btn btn-sm btn-warning ms-2" onClick={() => startEditPrescription(pres)}>Düzenle</button>
                                                            </div>
                                                        ))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {editingPrescription && (
                                    <div className="card p-3 mt-3 border border-primary">
                                        <h6>Reçeteyi Düzenle</h6>
                                        <input type="text" className="form-control mb-2" placeholder="Medication"
                                            value={prescriptionForm.Medication}
                                            onChange={e => setPrescriptionForm({ ...prescriptionForm, Medication: e.target.value })} />
                                        <input type="text" className="form-control mb-2" placeholder="Dosage"
                                            value={prescriptionForm.Dosage}
                                            onChange={e => setPrescriptionForm({ ...prescriptionForm, Dosage: e.target.value })} />
                                        <input type="text" className="form-control mb-2" placeholder="Instructions"
                                            value={prescriptionForm.Instructions}
                                            onChange={e => setPrescriptionForm({ ...prescriptionForm, Instructions: e.target.value })} />
                                        <button className="btn btn-success me-2" onClick={updatePrescription}>Güncelle</button>
                                        <button className="btn btn-secondary" onClick={() => setEditingPrescription(null)}>İptal</button>
                                    </div>
                                )}
                            </div>
                        )}
                            </div>
                        </div>
                } />
               
                        <Route path="/about" element={<About />} />
                    </Routes>
             

            {/* Footer */}
            <footer className="footer mt-5 py-4 text-light text-center">
                <div className="container">
                    <p className="mb-1">📍 Ankara, Türkiye</p>
                    <p className="mb-1">📞 info@hospitalsystem.com | ☎️ +90 (312) 555 55 55</p>
                    <p className="mb-0">© 2025 Hasta Takip ve Reçete Yönetim Sistemi</p>
                </div>
                </footer>
            
            </Router>
        </div>
    );
}

export default App;
