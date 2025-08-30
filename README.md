# 📚 DavNotes  
[![Live Preview](https://img.shields.io/badge/🌐_Live_Preview-00C853?style=for-the-badge&logo=netlify&logoColor=white)](https://davnotes.netlify.app/)

> A student-friendly platform to **download notes, previous year question papers, assignments, and syllabus** — with a robust CMS for verified uploaders and admins.  

![DavNotes Screenshot](https://github.com/user-attachments/assets/b307f2de-d7ba-4945-b300-a418563e3c18)

---

## 🚀 Feature 

- 🎓 **Student Resources** – Notes, PYQs, Assignments, Syllabus (by semester & stream)  
- 🔑 **Role-Based Access** – Admin & Verified Uploader system  
- 📊 **Admin Dashboard** – Manage users, uploads, and view real-time stats  
- 📂 **Resource Management** – Upload, filter, search, delete files easily  
- 🌙 **Dark/Light Mode** – Full mobile responsive theme toggle  
- ⚡ **Local Caching** – Faster repeated downloads  
- 🔍 **Smart Search & Filters** – Find resources quickly  
- 📈 **Google Analytics Integration** – Track usage & engagement  
- 🎭 **Smooth Animations** – Powered by Framer Motion  
- ✉️ **EmailJS Support** – Contact form & uploader contribution requests  

---

## 🛠️ Tech Stack  

- **Frontend:** React 19, Vite, TailwindCSS, Flowbite  
- **Backend/Services:** Firebase (Auth, Firestore, Storage), Node.js  
- **UI/UX Enhancements:** Framer Motion, SweetAlert2, Lucide Icons  
- **Data Visualization:** Recharts  
- **Other Integrations:** EmailJS, Google Analytics  
- **Utilities:** React Router v7, React Hot Toast, DOMPurify, pdf-lib  

---

## 📂 Folder Structure  

```bash
DavNotes/
├── public/                # Static assets (images, favicons)
├── src/
│   ├── api/               # Firebase config & API calls
│   ├── cms/               # CMS pages (Admin & Uploader)
│   ├── components/        # Reusable UI components
│   ├── context/           # Context API (Auth, Theme)
│   ├── data/              # Static data (semesters, programs, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Google Analytics helper
│   ├── pages/             # Public & CMS pages
│   ├── routes/            # Protected routes
│   └── utils/             # Helpers & utilities
├── .env                   # Environment variables (ignored in git)
├── package.json           # Dependencies & scripts
├── vite.config.js         # Vite config
└── README.md
```

---

## ⚙️ Installation & Setup  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/DavNotes.git
   cd DavNotes/main
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Setup environment variables**  
   Create a `.env` file in the project root with the following:  

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_TEMPLATE_CONTACT=your_emailjs_contact_template
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

   VITE_GA_TRACKING_ID=your_google_analytics_tracking_id
   ```

4. **Run the development server**  
   ```bash
   npm run dev
   ```

---

## 🎮 Usage  

- Students can **browse, search, and download** resources freely.  
- Verified uploaders can **log in and contribute** notes & papers.  
- Admins can **manage users, uploads, and monitor analytics** in real-time.  

---

## 📸 Screenshots / Demo  

| Home Page | Admin Dashboard |
|-----------|-----------------|
| ![DavNotes Screenshot](https://github.com/user-attachments/assets/b307f2de-d7ba-4945-b300-a418563e3c18) | ![Admin Dashboard](https://github.com/user-attachments/assets/891ed413-77a1-4d89-ab35-ccf9a19ec67c) |

| Manage Resource Page | Mobile View |
|----------------------|-------------|
| <img width="1581" height="741" alt="Manage Resource Page" src="https://github.com/user-attachments/assets/86d22853-8885-49e5-b137-61cab1163937" /> | ![Mobile View](https://github.com/user-attachments/assets/9a19b143-7bb3-4def-99fc-d4bdacd78fdf) |

---

## 📊 Roadmap  

- [ ] Add support for more file formats  
- [ ] Introduce AI-powered resource recommendations  
- [ ] Add user feedback system for notes  
- [ ] Implement offline support (PWA)  

---

## 🤝 Contributing  

Contributions are welcome!  

1. Fork the repo  
2. Create a new branch (`feature/your-feature`)  
3. Commit changes (`git commit -m "Add your feature"`)  
4. Push the branch (`git push origin feature/your-feature`)  
5. Open a Pull Request  

---

## 📜 License  

This project is licensed under the **MIT License** – feel free to use and modify.  

---

## 🙏 Acknowledgements  

- Firebase for backend services  
- EmailJS for mail handling  
- Google Analytics for insights  
- Flowbite & TailwindCSS for UI  
- Open source contributors & student community ❤️  
