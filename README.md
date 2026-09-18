# Notes Nexus 🎓

> **Disclaimer:** This is a **student-run, unofficial** initiative and is not affiliated with or endorsed by JIS University. There is no access to university email records or student databases.

**Notes Nexus** is an open-source, university-wide platform for sharing academic resources. Built by students for students, it provides a seamless way to discover, rate, and share lecture notes, previous year questions (PYQs), and second-hand marketplace items across all departments.

---

## ✨ Features

- 📚 **Comprehensive Study Materials**: Browse lecture notes and PYQs filtered by your department and semester.
- 🔐 **Secure PDF Viewer**: In-app PDF viewer designed to deter casual downloading and sharing.
- 🛒 **Student Marketplace**: Buy and sell second-hand books, drafters, aprons, and other instruments.
- 🤝 **Community-Driven**: Upload your own notes, rate other materials, and build a repository for your juniors.
- 🛡️ **Role-Based Access**: 
  - **Visitors**: Browse and read materials without logging in.
  - **Contributors**: Sign in via Google OAuth to rate, upload, and sell (requires one-time admin approval).
  - **Admins**: Approve accounts, moderate uploads, and manage platform taxonomies.

## 🛠️ Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **Storage:** [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) (S3-compatible)
- **PDF Rendering:** [PDF.js](https://mozilla.github.io/pdf.js/) via native iframe viewer

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- A Cloudflare R2 bucket (or any S3-compatible storage)

### 1. Clone the repository
```bash
git clone https://github.com/dasouvik122005/Notes_Nexus.git
cd Notes_Nexus
```

### 2. Install dependencies
```bash
npm install
```

### 3. Database Setup
Run the SQL migration found in `supabase/migrations/0001_init.sql` inside your Supabase SQL Editor to generate the necessary tables (departments, papers, users, materials, ratings, listings, audit_log).

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing
Contributions are always welcome! Feel free to open an issue or submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is open-source. Please see the `LICENSE` file for details.