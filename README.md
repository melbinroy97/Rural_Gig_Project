# RuralConnect - Gig Economy Platform

A full-stack MERN application designed to bridge the gap between rural talent and urban/global employers. RuralConnect enables seamless gig work opportunities with role-based access, real-time messaging, and comprehensive job management.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node Version](https://img.shields.io/badge/node-v18%2B-green)
![React Version](https://img.shields.io/badge/react-18-61dafb)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Demo Accounts](#demo-accounts)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Authentication & Authorization
- User registration and login with role-based access control (Worker/Employer/Admin)
- JWT-based authentication with secure httpOnly cookies
- Password hashing using bcryptjs
- Email validation and secure token generation

### Worker Features
- Browse available gigs with detailed information
- Apply for gig opportunities
- View accepted orders and manage work status
- Complete gigs and submit work for review
- Build professional profile with ratings and reviews
- View earnings and work history

### Employer Features
- Post new gigs/job opportunities
- Manage posted gigs and applications
- Review worker profiles and ratings
- Approve/reject applications
- Track order status and worker performance
- Leave reviews for completed work

### Admin Features
- Access comprehensive metrics dashboard
- View platform statistics and analytics
- Manage users, gigs, and orders
- Monitor platform activity and performance

### Real-Time Features
- Socket.io powered real-time messaging between workers and employers
- Live notifications for job applications and messages
- Real-time order status updates

### Additional Features
- Landing page with animations and call-to-action
- Responsive UI with Tailwind CSS and mobile-first design
- Advanced form validation with React Hook Form
- Data visualization with Recharts
- Image uploads via Cloudinary
- Comprehensive error handling and logging

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons
- **Animations**: Framer Motion
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Yup
- **Real-time Communication**: Socket.io Client
- **Data Visualization**: Recharts
- **Notifications**: React Toastify
- **Routing**: React Router DOM v7

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: 
  - bcryptjs for password hashing
  - Helmet for HTTP headers security
  - CORS for cross-origin requests
  - Express Rate Limiting for DDoS protection
- **Real-time**: Socket.io
- **File Upload**: Multer + Cloudinary
- **Logging**: Morgan
- **Input Validation**: Express Validator
- **Environment**: dotenv

---

## 📁 Project Structure

```
Rural_Gig_Project/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   └── ui/                  # UI components (Navbar, Footer, GigCard)
│   │   ├── pages/                   # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── GigListingPage.jsx
│   │   │   ├── GigDetailPage.jsx
│   │   │   ├── WorkerDashboard.jsx
│   │   │   ├── EmployerDashboard.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── MessagingPage.jsx
│   │   │   ├── PostJobPage.jsx
│   │   │   └── WorkerProfilePage.jsx
│   │   ├── context/                 # Context API (AuthContext)
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # API service layer
│   │   └── utils/                   # Utility functions
│   ├── public/                      # Static assets
│   ├── App.jsx                      # Main App component
│   ├── main.jsx                     # Entry point
│   ├── index.css                    # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── eslint.config.js
│
├── server/                          # Node.js Backend
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Gig.js
│   │   ├── Job.js
│   │   ├── Order.js
│   │   ├── Message.js
│   │   └── Review.js
│   ├── controllers/                 # Route handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── gigController.js
│   │   ├── jobController.js
│   │   ├── orderController.js
│   │   ├── messageController.js
│   │   └── reviewController.js
│   ├── routes/                      # Express routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── gigRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── messageRoutes.js
│   │   └── reviewRoutes.js
│   ├── middleware/                  # Custom middleware
│   │   └── authMiddleware.js
│   ├── config/                      # Configuration files
│   │   └── db.js
│   ├── utils/                       # Utility functions
│   │   └── generateToken.js
│   ├── server.js                    # Express app setup
│   ├── seed.js                      # Database seed script
│   └── package.json
│
└── README.md                        # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)
- **MongoDB** v5.0 or higher ([Download](https://www.mongodb.com/try/download/community))
- **Git** for version control

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/RuralConnect.git
cd RuralConnect
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ruralconnect
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

**Note:** Ensure MongoDB is running before proceeding:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

Seed the database with initial data:
```bash
npm run seed
```

### 3. Frontend Setup

Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

The frontend will run on `http://localhost:5173` with Vite's default configuration.

---

## ⚙️ Configuration

### Environment Variables

**Server (.env)**
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/ruralconnect |
| JWT_SECRET | Secret key for JWT signing | your_secret_key |
| JWT_EXPIRE | JWT expiration time | 7d |
| NODE_ENV | Environment mode | development/production |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | your_cloud_name |
| CLOUDINARY_API_KEY | Cloudinary API key | your_api_key |
| CLOUDINARY_API_SECRET | Cloudinary API secret | your_api_secret |
| CLIENT_URL | Frontend URL | http://localhost:5173 |

---

## 🏃 Running the Project

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

The frontend will automatically connect to the backend API.

### Production Build

**Frontend Build:**
```bash
cd client
npm run build
npm run preview
```

**Backend Production:**
```bash
cd server
NODE_ENV=production npm start
```

---

## 👥 Demo Accounts

After seeding the database, use these credentials to test the platform:

| Role | Email | Password |
|------|-------|----------|
| Worker | ramesh@example.com | password123 |
| Employer | anita@example.com | password123 |

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User Endpoints
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/reviews` - Get user reviews

### Gig Endpoints
- `GET /api/gigs` - List all gigs
- `GET /api/gigs/:id` - Get gig details
- `POST /api/gigs` - Create new gig (Employer only)
- `PUT /api/gigs/:id` - Update gig
- `DELETE /api/gigs/:id` - Delete gig

### Order Endpoints
- `GET /api/orders` - List orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/:id` - Get order details

### Message Endpoints
- `GET /api/messages/:conversationId` - Get conversation messages
- `POST /api/messages` - Send message
- `GET /api/conversations` - List user conversations

### Review Endpoints
- `POST /api/reviews` - Post review for completed work
- `GET /api/reviews/:userId` - Get user reviews

---

## 🏗 Architecture

### MVC Pattern
The backend follows the Model-View-Controller (MVC) pattern:
- **Models**: Mongoose schemas in `/models`
- **Controllers**: Business logic in `/controllers`
- **Routes**: API endpoints in `/routes`

### Component-Based Frontend
The frontend uses React's component-based architecture with:
- Container components for pages
- Presentational components for UI
- Custom hooks for reusable logic
- Context API for global state management

### Real-Time Communication
Socket.io enables:
- Real-time messaging between users
- Live notification updates
- Instant order status changes

---

## 🌐 Deployment

### Deploy Backend (Heroku Example)
```bash
cd server
heroku create your-app-name
heroku config:set MONGO_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
git push heroku main
```

### Deploy Frontend (Vercel Example)
```bash
cd client
npm install -g vercel
vercel --env VITE_API_URL=https://your-backend.herokuapp.com
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Enable `secure` flag on JWT cookies
- [ ] Use HTTPS for all connections
- [ ] Set up MongoDB Atlas or production MongoDB
- [ ] Configure Cloudinary for production
- [ ] Set proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up logging and monitoring
- [ ] Configure environment variables securely

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 📞 Support

For support, email support@ruralconnect.com or open an issue in the GitHub repository.

---

## 🙏 Acknowledgments

- React and Vite communities for excellent documentation
- MongoDB and Mongoose for database solutions
- Socket.io for real-time communication
- Tailwind CSS for styling utilities
- All open-source contributors

---

**Made with ❤️ by the RuralConnect Team**

Last Updated: May 17, 2026
- Use a MongoDB Atlas cluster instead of local MongoDB.
- Setup a reverse proxy like Nginx or use Vercel/Render for automatic deployments.
