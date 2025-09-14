# Full Stack Ecommerce Site

A complete, modern ecommerce application with React frontend and Express.js backend. Features full user authentication, product management, shopping cart functionality, and order processing with SQLite database.

> **Last Updated:** September 13, 2025 - Full-stack implementation with working backend API

## ✨ Current Capabilities

### 🛍️ **Frontend Features**
- **Product Catalog**: Dynamic product listing with real-time data from backend
- **Product Details**: Individual product pages with images, descriptions, sizes, and colors
- **Shopping Cart**: Add/remove items, quantity management, persistent cart state
- **User Authentication**: Complete login/register system with JWT tokens
- **Checkout Process**: Multi-step checkout with shipping address and order summary
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: Enhanced UX with Framer Motion
- **Context State Management**: Global state for cart and authentication

### 🔧 **Backend Features**
- **RESTful API**: Complete Express.js API with proper error handling
- **User Management**: Registration, login, JWT authentication
- **Product Management**: CRUD operations for products with categories
- **Order Processing**: Create and retrieve user orders
- **Database**: SQLite database with proper schema and relationships
- **Security**: Password hashing with bcrypt, JWT token validation
- **CORS Support**: Cross-origin requests enabled for frontend integration

### 📊 **Database Schema**
- **Users Table**: User accounts with encrypted passwords
- **Products Table**: Product catalog with images, pricing, variants
- **Orders Table**: Order history with user relationships and status tracking

## 🛠️ Tech Stack

### **Frontend**
- **React**: 18.3.1 - Modern React with hooks and context
- **Vite**: 5.2.0 - Fast build tool and dev server
- **Tailwind CSS**: 3.4.3 - Utility-first CSS framework
- **React Router DOM**: 7.9.1 - Client-side routing
- **Framer Motion**: 10.16.4 - Animation library
- **Context API**: Global state management

### **Backend**
- **Node.js**: Runtime environment
- **Express.js**: 4.18.2 - Web framework
- **SQLite3**: 5.1.6 - Embedded database
- **JWT**: 9.0.2 - Authentication tokens
- **bcryptjs**: 2.4.3 - Password hashing
- **CORS**: 2.8.5 - Cross-origin resource sharing
- **dotenv**: 16.3.1 - Environment variables

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn package manager

### **1. Clone the Repository**
```bash
git clone https://github.com/hisham12334/full_ecommerse_site.git
cd full_ecommerse_site
```

### **2. Frontend Setup**
```bash
# Install frontend dependencies
npm install

# Create environment file
cp .env.example .env
```

### **3. Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Create backend environment file
cp .env.example .env
# Edit backend/.env and update JWT_SECRET for production
```

### **4. Database Setup**
The SQLite database will be automatically created when you first run the backend server. Sample products are automatically seeded.

### **5. Start the Application**

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### **6. Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

## 🏗️ Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components (ready for expansion)
│   │   ├── context/            # React Context providers
│   │   │   ├── AuthContext.jsx # JWT authentication & user state
│   │   │   └── CartContext.jsx # Shopping cart state management
│   │   ├── pages/              # Main application pages
│   │   │   ├── Home.jsx        # Product catalog with filtering
│   │   │   ├── Cart.jsx        # Shopping cart management
│   │   │   ├── Checkout.jsx    # Multi-step checkout process
│   │   │   └── ProductDetails.jsx # Individual product view
│   │   ├── services/           # API integration layer
│   │   │   └── api.js          # Centralized API service with auth
│   │   ├── hooks/              # Custom React hooks (ready for expansion)
│   │   ├── data/               # Static data and constants
│   │   ├── assets/             # Images, icons, static files
│   │   ├── styles/             # CSS and styling
│   │   │   └── index.css       # Tailwind CSS configuration
│   │   ├── App.jsx             # Main app component with routing
│   │   └── main.jsx            # Application entry point
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite build configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── .env                    # Frontend environment variables
│
├── backend/
│   ├── server.js               # Express.js server with all routes
│   ├── ecommerce.db            # SQLite database (auto-generated)
│   ├── package.json            # Backend dependencies
│   └── .env                    # Backend environment variables
│
├── README.md                   # This documentation
├── LICENSE                     # MIT License
└── .env.example               # Environment variables template
```

## 🎯 Available Scripts

### **Frontend Scripts**
```bash
npm run dev          # Start Vite development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### **Backend Scripts**
```bash
cd backend
npm start            # Start production server
npm run dev          # Start development server with nodemon (auto-restart)
```

## 🔧 Configuration

### **Environment Variables**

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (backend/.env):**
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### **Configuration Files**
- `vite.config.js` - Vite build and development server configuration
- `tailwind.config.js` - Tailwind CSS customization and theme
- `postcss.config.js` - PostCSS configuration for Tailwind processing

### **Database Configuration**
- SQLite database is automatically created on first run
- Database file: `backend/ecommerce.db`
- Sample products are seeded automatically
- No additional database setup required

## 🌟 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/health` - Server health check

### **Products**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### **Orders** (Protected Routes)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's order history

### **Authentication Flow**
1. User registers/logs in → Receives JWT token
2. Token stored in localStorage
3. Token sent in Authorization header for protected routes
4. Backend validates token for secure operations

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Order operations require authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin setup
- **Error Handling**: Comprehensive error responses

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind
- **Loading States**: User feedback during API calls
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: Framer Motion for enhanced UX
- **Persistent Cart**: Cart state maintained across sessions
- **User Avatars**: Dynamic avatar generation
- **Form Validation**: Client-side validation with feedback

## 🚀 Current Status & Next Steps

### **✅ Completed Features**
- ✅ Full-stack architecture with React + Express
- ✅ User authentication (register/login/logout)
- ✅ Product catalog with dynamic data
- ✅ Shopping cart functionality
- ✅ Order processing and history
- ✅ SQLite database with proper schema
- ✅ JWT-based security
- ✅ Responsive UI with Tailwind CSS
- ✅ API integration layer
- ✅ Error handling and validation

### **🔄 Ready for Enhancement**
- 🔄 Payment gateway integration (Stripe/PayPal)
- 🔄 Product search and filtering
- 🔄 Admin panel for product management
- 🔄 Email notifications
- 🔄 Product reviews and ratings
- 🔄 Inventory management
- 🔄 Order status tracking
- 🔄 User profile management

### **📁 Expandable Structure**
The project is structured for easy expansion:
- `src/components/` - Ready for reusable UI components
- `src/hooks/` - Ready for custom React hooks
- `backend/routes/` - Can be split into separate route files
- `backend/models/` - Ready for database models/schemas

## 🚀 Deployment

### **Frontend Deployment**
```bash
npm run build
# Deploy the 'dist' folder to your hosting platform
# (Vercel, Netlify, GitHub Pages, etc.)
```

### **Backend Deployment**
```bash
# For production, consider:
# - Using PostgreSQL instead of SQLite
# - Setting up proper environment variables
# - Using PM2 for process management
# - Setting up reverse proxy with Nginx
```

### **Environment Setup for Production**
- Update `JWT_SECRET` in backend/.env
- Configure production database
- Set proper CORS origins
- Update API URLs in frontend .env

## 🛠️ Development Workflow

### **Adding New Features**
1. **Frontend**: Add components in `src/components/`
2. **Backend**: Add routes in `backend/server.js` or create separate route files
3. **Database**: Modify schema in the database initialization section
4. **API**: Update `src/services/api.js` for new endpoints

### **Testing the Application**
1. Start both frontend and backend servers
2. Test user registration and login
3. Add products to cart
4. Complete checkout process
5. Verify order creation in backend

### **Troubleshooting**
- **"Failed to fetch"**: Ensure backend server is running on port 5000
- **CORS errors**: Check CORS configuration in backend/server.js
- **Database issues**: Delete `backend/ecommerce.db` to reset database
- **Token issues**: Clear localStorage and re-login

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the existing code structure
4. Test both frontend and backend functionality
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request with detailed description

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

For questions or support, please contact [hisham12334](https://github.com/hisham12334).

---

Built with ❤️ using React and Vite