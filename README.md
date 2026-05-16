# MyStore - Modern Microservices eCommerce Platform

MyStore is a high-performance, production-grade eCommerce platform built with a modern microservices architecture. It features a stunning, responsive frontend and a robust backend designed for scalability and security.

## 🚀 Key Features

- **Full Product Catalog**: 60+ pre-seeded items across multiple categories (Electronics, Fashion, Home, etc.).
- **Smart Search & Filters**: Easily find products by category or name.
- **Wishlist System**: Persistent user-specific wishlists to save items for later.
- **Secure Authentication**: Multi-layered security with JWT and support for both username and email-based login.
- **Flexible Payments**: Integration with **Razorpay** for online payments and support for **Cash on Delivery (COD)**.
- **Real-time Updates**: Live order status tracking using Server-Sent Events (SSE).
- **Admin Dashboard**: Premium "Seller Central" for managing inventory, tracking orders, and monitoring users.
- **Responsive Design**: Premium UI/UX with glassmorphism, micro-animations, and full mobile compatibility.

## 🏗️ Architecture

The application is built using a **Microservices Architecture**:

- **Gateway Service (8080)**: Central entry point with security filtering and request routing.
- **Auth Service (8081)**: Manages user identity, roles, and JWT issuance.
- **Product Service (8082)**: Manages the product catalog, inventory, and wishlists.
- **Order Service (8089)**: Handles order processing, payments (Razorpay/COD), and email notifications.
- **Discovery Service (8761)**: Eureka-based service registry for microservice coordination.
- **Frontend (5173)**: React-based single-page application built with Vite.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Axios, Lucide Icons.
- **Backend**: Java 17+, Spring Boot 3.x, Spring Cloud, Spring Data JPA.
- **Security**: Spring Security, JWT.
- **Database**: MySQL (Microservice-specific databases).
- **Other**: Razorpay SDK, Jakarta Mail, Hibernate.

## 🏁 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js & npm
- MySQL Server

### 1. Database Setup
Create the following databases in your MySQL instance:
```sql
CREATE DATABASE ecommerce_auth;
CREATE DATABASE ecommerce_product;
CREATE DATABASE ecommerce_order;
```

### 2. Environment Configuration
Create a `.env` file in the root directory (and in individual service folders if preferred) with the following:
```env
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
SMTP_USERNAME=your_gmail
SMTP_PASSWORD=your_app_password
```

### 3. Run the Services
Start the services in the following order:
1. `discovery-service`
2. `auth-service`, `product-service`, `order-service`
3. `gateway-service`
4. `frontend` (using `npm run dev`)

## 🔑 Default Credentials
- **Super Admin**: `admin@mystore.com` / `Admin@123`

## 📄 License
This project is for demonstration purposes. All rights reserved.
