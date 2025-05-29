# FitnessMA - Gym Management System

A modern, full-stack web application for gym management that allows customers to book appointments with specific coaches and provides admin functionality for user management.

## 🚀 Features

### For Clients
- **User Registration & Authentication** - Secure signup and login system
- **Coach Browsing** - View available coaches with their specialties and rates
- **Appointment Booking** - Book sessions with preferred coaches
- **Appointment Management** - View, cancel, and manage bookings
- **Profile Management** - Update personal information

### For Coaches
- **Schedule Management** - View and manage appointment schedules
- **Client Information** - Access client details for booked sessions
- **Availability Settings** - Set working hours and available days

### For Admins
- **User Management** - Create new clients, coaches, and admins
- **User Control** - Block/unblock unwanted users
- **System Analytics** - View gym statistics and reports
- **Appointment Oversight** - Monitor all appointments across the system

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js framework
- **SQLite** database for data storage
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Lucide React** for icons

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fitnessma
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Start the Application
```bash
# Start both server and client concurrently
npm run dev
```

This will start:
- **Backend server** on `http://localhost:5000`
- **Frontend client** on `http://localhost:3000`

### Alternative: Start Separately
```bash
# Terminal 1 - Start the server
npm run server

# Terminal 2 - Start the client
npm run client
```

## 🗄️ Database

The application uses SQLite database which will be automatically created when you first run the server. The database includes:

### Default Users
- **Admin**: `admin@fitnessma.com` / `admin123`
- **Coach 1**: `john.smith@fitnessma.com` / `coach123` (Weight Training)
- **Coach 2**: `sarah.johnson@fitnessma.com` / `coach123` (Yoga)
- **Coach 3**: `mike.davis@fitnessma.com` / `coach123` (Cardio & HIIT)

### Database Schema
- **users** - User accounts with roles (client, coach, admin)
- **coaches** - Coach profiles with specialties and availability
- **appointments** - Booking records with status tracking

## 🎯 Usage Guide

### Getting Started
1. Open `http://localhost:3000` in your browser
2. Register a new account or use demo credentials
3. Explore the features based on your role

### For New Clients
1. Click "Sign Up" and create an account
2. Browse available coaches
3. Book appointments with your preferred coach
4. Manage your bookings from the dashboard

### For Admins
1. Login with admin credentials
2. Access the Admin Panel from the navigation
3. Create new users, manage existing ones
4. Block/unblock users as needed
5. View system statistics

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Coaches
- `GET /api/coaches` - Get all coaches
- `GET /api/coaches/:id` - Get coach details
- `GET /api/coaches/:id/availability/:date` - Check availability

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/my-appointments` - Get user appointments
- `PATCH /api/appointments/:id/cancel` - Cancel appointment

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PATCH /api/admin/users/:id/status` - Block/unblock user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get system statistics

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Interface** - Clean, professional design with Tailwind CSS
- **Interactive Elements** - Hover effects, transitions, and animations
- **Role-based Navigation** - Different menu items based on user role
- **Form Validation** - Client-side and server-side validation
- **Error Handling** - User-friendly error messages

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Role-based Access Control** - Different permissions for different roles
- **Input Validation** - Comprehensive validation on all inputs
- **Protected Routes** - Authentication required for sensitive pages

## 📁 Project Structure

```
fitnessma/
├── package.json                 # Root package configuration
├── README.md                   # Project documentation
├── server/                     # Backend application
│   ├── package.json           # Server dependencies
│   ├── index.js              # Server entry point
│   ├── config.js             # Configuration settings
│   ├── database/
│   │   └── init.js           # Database initialization
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   └── routes/               # API routes
│       ├── auth.js           # Authentication routes
│       ├── users.js          # User routes
│       ├── coaches.js        # Coach routes
│       ├── appointments.js   # Appointment routes
│       └── admin.js          # Admin routes
└── client/                    # Frontend application
    ├── package.json          # Client dependencies
    ├── public/
    │   └── index.html        # HTML template
    └── src/
        ├── index.js          # React entry point
        ├── App.js            # Main App component
        ├── index.css         # Global styles
        ├── contexts/
        │   └── AuthContext.js # Authentication context
        ├── components/
        │   ├── Navbar.js     # Navigation component
        │   └── ProtectedRoute.js # Route protection
        └── pages/            # Page components
            ├── Home.js
            ├── Login.js
            ├── Register.js
            ├── Dashboard.js
            ├── Coaches.js
            ├── BookAppointment.js
            ├── MyAppointments.js
            └── AdminDashboard.js
```

## 🚧 Development Status

This is a foundational implementation with core features. The following pages are currently placeholders and can be extended:
- Coach listings with full functionality
- Complete appointment booking system
- Full admin dashboard with user management
- Appointment management interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**FitnessMA** - Transforming gym management with modern technology! 💪 