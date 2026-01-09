# Hospital Record System

A web-based application for managing patient records in a hospital. This system allows doctors to manage patient information, track visits, and write prescriptions.

# Youtube video link:
https://youtu.be/BwziIiJfS4Y

## Features

*   **Patient Management:** Doctors can add, view, and manage patient records.
*   **Visit and Prescription Tracking:** Each patient has a history of visits, including diagnoses, notes, and prescriptions.
*   **User Authentication:** Secure login for doctors and patients with role-based access control.
*   **AI-Powered Prescription Suggestions:** The system provides drug suggestions to the doctor based on the diagnosis. This feature pulls information from an API connected to an older version of an AI model.

## Technologies Used

*   **Backend:** ASP.NET Core
*   **Frontend:** React.js
*   **Database:** Microsoft SQL Server
*   **Authentication:** JWT (JSON Web Tokens)

## Setup and Installation

### Prerequisites

*   .NET SDK
*   Node.js and npm
*   Microsoft SQL Server

### Backend Setup

1.  Navigate to the `src/Hospital.Api` directory.
2.  Restore the NuGet packages: `dotnet restore`
3.  Update the database with the latest migrations: `dotnet ef database update`
4.  Run the backend server: `dotnet run`

### Frontend Setup

1.  Navigate to the `frontend` directory.
2.  Install the npm packages: `npm install`
3.  Run the frontend development server: `npm start`

The application will be accessible at `http://localhost:3000`.
