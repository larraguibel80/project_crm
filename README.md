# CRM System with Email Confirmation and Chat

This project is a CRM system built with **ASP.NET Core** (backend), **PostgreSQL** (database), and **React** (frontend). It allows users to submit forms, receive email confirmations with chat links, and chat with agents.

---

## **Technologies Used**

- **.NET 6 or 7 (ASP.NET Core)** – Backend API  
- **MailKit** – For sending emails via SMTP  
- **MimeKit** – For constructing email messages  
- **Entity Framework Core (EF Core)** – For database access  
- **PostgreSQL** – Database system  
- **React** – Frontend for form submission and chat interface  
- **Dependency Injection (DI)** – For service registration

---

## **Prerequisites**

Ensure the following tools are installed:

1. **.NET 6 or 7 SDK**  
   Download from [Microsoft .NET Downloads](https://dotnet.microsoft.com/download)

2. **PostgreSQL**  
   Download from [PostgreSQL Downloads](https://www.postgresql.org/download/)

3. **Node.js and npm** (for React)  
   Download from [Node.js Downloads](https://nodejs.org/)

4. **SMTP Email Credentials** (e.g., Gmail credentials for email service)

---

## **Required Packages**

### Backend (.NET) Packages:

Install the required NuGet packages:

```bash
dotnet add package MailKit
dotnet add package MimeKit
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.Extensions.Configuration
dotnet add package Microsoft.Extensions.Configuration.Json
dotnet add package Microsoft.Extensions.DependencyInjection


Create the PostgreSQL database and tables required by the CRM.

- **Create Database and Tables:**

   Open your terminal or command prompt and execute the following commands:

   ```
   psql -U your_username (ours is postgres)

   Then, create the following tables:

``` 
-- Create "companies" table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name TEXT,
    address TEXT
);

-- Create "admins" table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    firstname TEXT,
    lastname TEXT,
    email TEXT,
    password TEXT,
    company_id INTEGER,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create "agents" table
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    firstname TEXT,
    lastname TEXT,
    email TEXT,
    password TEXT,
    company_id INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create "chat" table
CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    username TEXT NOT NULL,
    token TEXT,
    form_id INTEGER,
    FOREIGN KEY (form_id) REFERENCES forms(id)
);

-- Create "employees" table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer service'
);

-- Create "forms" table
CREATE TABLE forms (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    service_product TEXT NOT NULL,
    message TEXT NOT NULL,
    created TIMESTAMP DEFAULT NOW(),
    token TEXT,
    company_id INTEGER,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create "service_list" table
CREATE TABLE service_list (
    id SERIAL PRIMARY KEY,
    form_id INTEGER,
    agent_id INTEGER,
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Create "users" table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer', 'customer_service')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```
Clone the Repository:

```
git clone https://github.com/larraguibel80/project_crm.git
cd project_crm
```

install the following packages
```
dotnet add package Npgsql
dotnet add package MailKit
dotnet add package Microsoft.Extensions.Configuration
```


Configure appsettings.json:
```
{
  "SmtpSettings": {
    "Host": "smtp.your-email-provider.com",
    "Port": "587",
    "Username": "your-email@example.com",
    "Password": "your-email-password"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=crm_db;Username=your_username;Password=your_password"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

Run the Backend:
```
dotnet run
```
- **Frontend Setup (React)**
Navigate to the Frontend Directory:

```
cd client
```

Install Dependencies:

```
npm install
```
N.B. Explicit installation of vite might be necessary (npm install vite)


Start React Application:
```
npm run dev
```

The React frontend will be available at http://localhost:3000.
