

Here’s a solid version you can drop into your repo:

````markdown
# RMA Mart Test (Frontend)

This is the **frontend** for the RMA (Return Merchandise Authorization) Management System, built with **React + Vite**.  
It provides both **customer-facing pages** and an **admin dashboard** for managing RMAs, products, and customers.

---

## 🚀 Features

- **Authentication**  
  - Login & signup with token-based authentication (via Laravel backend API & Sanctum).  
  - `AuthContext` handles token storage and Axios header management.

- **Customer Portal**  
  - Submit RMA requests.  
  - Track status of requests.  
  - Update personal details.

- **Admin Dashboard**  
  - Manage **RMA cases** (view, filter, approve/reject, bulk update, export).  
  - Manage **Customers** (list, create, edit, delete).  
  - Manage **Products** (list, create, edit, delete).  
  - Sidebar navigation, responsive UI, and modern tables with search/filter/pagination.

- **Reusable Components**  
  - Dynamic **tables** with pagination, sorting, and bulk actions.  
  - **Filters** with advanced search & saved presets.  
  - **Forms** for customers and products (create/edit).  

---

## 📂 Project Structure

```bash
rmaMartTest/
 ├── src/
 │   ├── Components/     # Reusable UI components (tables, forms, filters, etc.)
 │   ├── pages/          # Main pages (Dashboard, Login, Customers, Products, etc.)
 │   ├── admin/          # Admin-specific pages (RMA Dashboard, Customers, Products, Bulk Management)
 │   ├── context/        # AuthContext for authentication & token management
 │   ├── api/            # Axios API services
 │   └── App.jsx         # App routes & layout
 ├── public/             # Static assets
 ├── package.json        # Dependencies & scripts
 └── vite.config.js      # Vite config
````

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nyamanyi22/rmaMartTest.git
cd rmaMartTest
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Add a `.env` file in the project root with your backend API URL:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Run development server

```bash
npm run dev
```

App will be available at:
👉 `http://localhost:5173`

---

## 🔑 Authentication

* Uses **Laravel Sanctum** on the backend.
* Stores token in `localStorage` (planned switch to HTTP-only cookies).
* All API calls go through `api/` services (Axios instance).

---

## 📦 Build for Production

```bash
npm run build
```

---

## 🛠️ Tech Stack

* **React 18 + Vite**
* **Axios** – API communication
* **React Context API** – authentication
* **Tailwind CSS / custom CSS** – styling
* **shadcn/ui + lucide-react** – UI components & icons

---

## ✨ Roadmap

* [ ] Improve dark mode support.
* [ ] Add role-based permissions (Customer, CSR, Admin).
* [ ] Switch to cookie-based auth.
* [ ] Add charts/analytics to admin dashboard.

---


---

## 👩🏽‍💻 Author

**Elizabeth Nyamanyi Omari**
Frontend for RMA Portal @ Mart Network (Kenya)

```

---

👉 Do you want me to also include **sample screenshots section** (placeholders you can replace with real images later) so it looks more professional on GitHub?
```
