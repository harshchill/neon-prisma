<div align="center">
  
  # 🍽️ MealMate Management System
  
  **A Modern, Sleek, and Real-Time Mess & Meal Booking Dashboard**
  
  <br />

  [![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React_19-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![Prisma](https://img.shields.io/badge/Prisma_7.2-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
  [![Neon Serverless](https://img.shields.io/badge/Neon_DB-00e599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![NextAuth](https://img.shields.io/badge/NextAuth-purple?style=for-the-badge&logo=next.js)](https://next-auth.js.org/)

  <br />
</div>

## ✨ Overview

Welcome to the **MealMate Management System**, a comprehensive full-stack application engineered to streamline meal planning, booking, attendance, and feedback tracking. Whether it is for a hostel mess, corporate cafeteria, or event catering, this platform guarantees a premium, hassle-free administrative and user experience. 

Designed with a sleek, minimalist UI, the project leverages state-of-the-art serverless database architecture (Neon DB) and robust ORM features via Prisma.

---

## 🚀 Key Features

### 🏢 **For Administrators**
- **Intuitive Dashboard:** Get a bird's-eye view of total meal bookings and attendance trends powered by robust visual charts (`recharts`).
- **Meal Scheduling:** Easily create and manage Breakfast, Lunch, and Dinner schedules seamlessly.
- **Inventory/ERP Logic:** Calculate total ingredient requirements per user (e.g., grams per pax) to drastically reduce food waste.
- **Attendance Tracking:** Monitor check-ins (`hasEaten`) to see who claimed their meal in real-time.

### 👤 **For Users (Students / Employees)**
- **Effortless Meal Booking:** View upcoming meals and book slots easily through a gorgeous interactive dashboard.
- **Secure Authentication:** Secure sign-up, login, and session persistence handled out-of-the-box by NextAuth and `bcryptjs`.
- **Food Feedback:** Rate meals (1-5 stars) and optionally provide feedback for continuous culinary improvement.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19, Tailwind CSS 4, Lucide React (Icons), Recharts (Data Visualization)
- **Backend/API:** Next.js Server Components and Route Handlers
- **Database:** PostgreSQL on [Neon Serverless DB](https://neon.tech/)
- **ORM:** Prisma 7.2 (w/ `@prisma/adapter-neon` for Edge / Worker environments)
- **Authentication:** NextAuth.js (v4) with JWT-based session strategies

---

## 🗄️ Database Schema Snapshot

The application relies on a closely coupled relational schema designed for high operational throughput:
- `User` - Handles credential storage and role-based policies (ADMIN vs USE).
- `Meal` - Core entity cataloging standard meal runs (Breakfast/Lunch/Dinner) with scheduled dates.
- `Attendance` - Junction mapping between `User` and `Meal` serving as an event ticket validator.
- `Feedback` - Collects post-meal ratings and user commentary.
- `IngredientRequirement` - Stores underlying recipe metric mappings for ERP-level forecasting.

---

## 💻 Getting Started

Follow these instructions to get the project up and running locally.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/neon-prisma.git
cd neon-prisma
```

### 2. Install Dependencies

Ensure you have Node.js 18+ installed on your machine.

```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables

Create a `.env` file at the root of the project and add your database configuration and NextAuth secrets:

```env
# Neon Database Connection String
DATABASE_URL="postgresql://<user>:<password>@<neon-host-url>/<dbname>?sslmode=require"

# NextAuth Config
NEXTAUTH_SECRET="your_ultra_secure_super_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Prisma Setup

Run migrations to integrate your schema into the database and build the Prisma client.

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

---

## 🎨 UI/UX Philosophy

The interface is driven by highly responsive styling mapped closely to Tailwind CSS `v4` and augmented with customized class aggregators (`clsx`, `tailwind-merge`). The design principles embrace wide paddings, soft dropshadows (`ui/card` layouts), clear typography, and subtle interactive animations to manifest an overarching **Modern & Sleek** identity.

---

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
  <i>Built with ❤️ using Next.js & Neon.</i>
</div>
