# CRM System with Email Confirmation and Chat

This project is a CRM system built with **ASP.NET Core** (backend), **PostgreSQL** (database), and **React** (frontend). It allows users to submit forms, receive email confirmations with chat links, and chat with agents.

---

## **Technologies Used**

- **.NET 8** – Backend API  
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

   Then, check the dump file for the database (see  learnpoint inlämning)


 **N.B.**  The following tables are relevant to the earlier stages of the 'chat_email_link' branch. Not creating them does not affect the main branch

-- Create "users" table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'customer', 'customer_service')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```
-- Create "employees" table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer service'
);


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
backend runs on http://localhost:3000

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

The React frontend will be available at http://localhost:4000 which leads to the form to be filled with email, subject and message.
 - Clicking on 'Send' will trigger the Mailkit System and enable the sending of a link containing a unique code to the used email address.
Clicking on the link received via email redirects the user to the chat page where commmunication with a customer service representative
is enabled.

- http://localhost:4000/login allows customer service employees to verify their credential and access the same chat initiated by the customer.
- Admin can login and get access to all cases and manage them and those assigned to them by rearranging, deleting info and adding others. 
- Adding new employees enables the Mailkit system into sending them a link where they can change their initial password

Additonal details are in the user stories
