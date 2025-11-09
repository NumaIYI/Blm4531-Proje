import React from "react";
import { Helmet } from "react-helmet";
import './App.css';

function About() {
    return (
         <>
            <Helmet>
                <meta charSet="UTF-8" />
            </Helmet>
            <div style={{ minHeight: "calc(100vh - 120px)", padding: "40px", color: "#333", fontFamily: "Arial, sans-serif" }}>
                <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>About Hospital Record System</h1>

                <p style={{ maxWidth: "800px", lineHeight: "1.8", fontSize: "1.1rem", marginBottom: "15px" }}>
                    The Hospital Record System is a modern web application designed to make patient
                    record management and prescription tracking faster and more efficient. It allows
                    healthcare professionals to add new patients, update prescriptions, and monitor
                    visit history in a seamless digital environment.
                </p>

                <p style={{ maxWidth: "800px", lineHeight: "1.8", fontSize: "1.1rem", marginBottom: "15px" }}>
                    Users can benefit from a structured and intuitive interface where all critical
                    patient data is stored securely. This system aims to reduce paperwork, prevent
                    errors, and provide instant access to medical information, helping healthcare
                    providers deliver better care.
                </p>

                <p style={{ maxWidth: "800px", lineHeight: "1.8", fontSize: "1.1rem", marginBottom: "15px" }}>
                    <strong>Technologies Used:</strong> React, Bootstrap, .NET Core Web API, Entity Framework.
                    This combination ensures a responsive, fast, and reliable application.
                </p>

                <p style={{ maxWidth: "800px", lineHeight: "1.8", fontSize: "1.1rem" }}>
                    <strong>Developer:</strong> Numa IYI  2025
                </p>
            </div>
        </>
    );
}

export default About;
