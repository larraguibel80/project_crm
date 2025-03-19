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
   psql -U your_username

   Then, in the PostgreSQL prompt:

``` CREATE DATABASE crm_db;
\c crm_db;
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
