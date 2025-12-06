# InternKaro - Smart Internship Discovery Platform

A personalized internship discovery platform that helps students find opportunities based on their skills and GitHub activity.

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB (Mongoose ORM)
- JWT Authentication
- GitHub API Integration

### Frontend
- React.js (Vite)
- React Router
- TailwindCSS
- Axios
- React Toastify

## Features

✅ **User Authentication**
- JWT-based signup and login
- Secure password hashing with bcrypt
- Role-based access control (student/admin)

✅ **Internship Management**
- Browse all internships
- Filter and search by skills, company, title
- View detailed internship information
- Save/bookmark favorite internships

✅ **GitHub Integration**
- Connect GitHub account
- Automatic skill extraction from repositories
- Display GitHub profile and repos

✅ **Smart Recommendations**
- Personalized internship suggestions
- Skill-based matching algorithm

✅ **User Profile**
- View and manage saved internships
- Sync GitHub skills
- Track application history

✅ **Modern, Human-Centric UI**
- Clean, minimalist design
- Premium aesthetics with soft color palettes
- Responsive and interactive elements

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- GitHub account (optional, for GitHub integration)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the backend directory with:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/internkaro
   JWT_SECRET=your_jwt_secret_key_here
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## Usage

1. **Sign Up**: Create a new account with your details
2. **Login**: Access your dashboard
3. **Browse Internships**: Explore available opportunities
4. **View Details**: Click on any internship to see full details
5. **Save Internships**: Bookmark internships for later
6. **Connect GitHub**: Link your GitHub account for personalized recommendations
7. **Get Recommendations**: See internships matched to your skills

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Authenticate user

### Internships
- `GET /api/internships` - Get all internships
- `GET /api/internships/:id` - Get single internship
- `POST /api/internships` - Create internship (Admin only)

### User
- `GET /api/user/saved` - Get saved internships
- `POST /api/user/saved/:id` - Toggle save internship

### GitHub
- `GET /api/github/profile` - Fetch GitHub data and skills

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations

## Troubleshooting

### GitHub Sync "Not Found" Error
If you encounter a "Not Found" error when syncing your GitHub profile:
1. Go to your **Profile** page.
2. Click **Edit Profile**.
3. Ensure your **GitHub Username** is correct. It must match your actual GitHub username exactly.
4. Save changes and try syncing again.

## Project Structure

```
INTERN_KARO/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── internshipController.js
│   │   ├── githubController.js
│   │   ├── recommendationController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Internship.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── internshipRoutes.js
│   │   ├── githubRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Internships.jsx
    │   │   ├── InternshipDetails.jsx
    │   │   └── Profile.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Notes

- Make sure MongoDB is running before starting the backend
- Update the `.env` file with your actual credentials
- For GitHub integration, create a GitHub OAuth App and add credentials
- The app uses bcrypt for password hashing and JWT for authentication

## Future Enhancements

- Email notifications
- Advanced filters (location, stipend range, duration)
- Application tracking
- Company profiles
- Resume upload and parsing
- Interview preparation resources

---

Built with ❤️ for students seeking their dream internships!
