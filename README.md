# Full Stack Ecommerce Site

A complete, modern ecommerce application with React frontend and Express.js backend. Features full user authentication, product management, shopping cart functionality, and order processing with SQLite database. Now with **modular architecture** and **scalable structure** ready for enterprise-level features.

> **Last Updated:** December 15, 2024 - Major architecture migration to modular structure with enhanced scalability

## ✨ Current Capabilities

### 🛍️ **Frontend Features**
- **Modular Components**: Reusable UI components with consistent design system
- **Product Catalog**: Dynamic product listing with enhanced ProductGrid component
- **Product Details**: Individual product pages with ProductCard components
- **Shopping Cart**: Advanced cart management with custom hooks
- **User Authentication**: Complete auth system with useAuth hook
- **Checkout Process**: Multi-step checkout with form validation
- **Admin Dashboard**: Admin panel interface (ready for full implementation)
- **Error Boundaries**: Comprehensive error handling and user feedback
- **Custom Hooks**: Business logic abstraction (useProducts, useOrders, useCart)
- **Responsive Design**: Mobile-first with modular Layout component
- **Loading States**: Enhanced UX with Loading components and error handling

### 🔧 **Backend Features**
- **Modular Architecture**: MVC pattern with controllers, routes, and middleware
- **RESTful API**: Complete Express.js API with centralized error handling
- **User Management**: Registration, login, JWT authentication with role-based access
- **Product Management**: Full CRUD operations with admin controls
- **Order Processing**: Complete order lifecycle management
- **Admin Panel**: Dashboard and management interfaces (ready for expansion)
- **Payment Integration**: Payment gateway support (placeholder for Razorpay/Stripe)
- **Database**: Enhanced SQLite schema with relationships and constraints
- **Security**: Advanced middleware for auth, validation, and rate limiting
- **Logging**: Comprehensive logging system for debugging and monitoring

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
├── src/                        # Frontend Source Code
│   ├── components/             # Modular UI Components
│   │   ├── common/            # Reusable components
│   │   │   ├── Button/        # Button component with variants
│   │   │   ├── Loading/       # Loading spinner component
│   │   │   ├── Modal/         # Modal dialog component
│   │   │   ├── ErrorBoundary/ # Error boundary wrapper
│   │   │   └── Layout/        # Main layout with navigation
│   │   ├── product/           # Product-specific components
│   │   │   ├── ProductCard/   # Individual product card
│   │   │   └── ProductGrid/   # Product grid layout
│   │   └── forms/             # Form components (ready for expansion)
│   ├── hooks/                 # Custom React Hooks
│   │   ├── useAuth.js         # Authentication hook
│   │   ├── useCart.js         # Cart management hook
│   │   ├── useProducts.js     # Products data hook
│   │   └── useOrders.js       # Orders management hook
│   ├── pages/                 # Application Pages
│   │   ├── public/            # Public pages
│   │   │   ├── Home.jsx       # Product catalog
│   │   │   ├── Cart.jsx       # Shopping cart
│   │   │   ├── Checkout.jsx   # Checkout process
│   │   │   └── ProductDetails.jsx # Product details
│   │   └── admin/             # Admin panel pages
│   │       └── Dashboard/     # Admin dashboard
│   ├── services/              # API & Utilities
│   │   ├── api/               # Modular API services
│   │   │   ├── auth.js        # Authentication API
│   │   │   ├── products.js    # Products API
│   │   │   └── orders.js      # Orders API
│   │   ├── utils/             # Utility functions
│   │   │   ├── constants.js   # App constants
│   │   │   ├── validation.js  # Validation utilities
│   │   │   ├── formatting.js  # Formatting utilities
│   │   │   └── helpers.js     # General helpers
│   │   └── storage/           # Storage utilities
│   │       ├── localStorage.js # Local storage wrapper
│   │       └── sessionStorage.js # Session storage wrapper
│   ├── context/               # React Context
│   │   ├── AuthContext.jsx    # Authentication context
│   │   └── CartContext.jsx    # Cart context
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Application entry point
│
├── backend/                   # Backend Source Code
│   ├── src/                   # Modular Backend Structure
│   │   ├── controllers/       # Business Logic Controllers
│   │   │   ├── authController.js     # Authentication logic
│   │   │   ├── productController.js  # Product CRUD operations
│   │   │   ├── orderController.js    # Order management
│   │   │   ├── adminController.js    # Admin operations
│   │   │   └── paymentController.js  # Payment processing
│   │   ├── routes/            # API Route Definitions
│   │   │   ├── auth.js        # Authentication routes
│   │   │   ├── products.js    # Product routes
│   │   │   ├── orders.js      # Order routes
│   │   │   ├── admin.js       # Admin routes
│   │   │   └── payments.js    # Payment routes
│   │   ├── middleware/        # Express Middleware
│   │   │   ├── auth.js        # JWT authentication
│   │   │   ├── errorHandler.js # Error handling
│   │   │   ├── validation.js  # Input validation
│   │   │   └── rateLimiter.js # Rate limiting
│   │   ├── services/          # Business Services
│   │   │   └── emailService.js # Email notifications
│   │   ├── utils/             # Backend Utilities
│   │   │   └── logger.js      # Logging utility
│   │   ├── config/            # Configuration
│   │   │   └── database.js    # Database setup
│   │   └── server.js          # Main server file
│   ├── server.js              # Legacy compatibility wrapper
│   ├── ecommerce.db           # SQLite database
│   ├── package.json           # Backend dependencies
│   └── .env                   # Backend environment
│
├── MIGRATION_SUMMARY.md       # Architecture migration details
├── README.md                  # This documentation
├── LICENSE                    # MIT License
└── .env.example              # Environment template
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
- `POST /api/auth/register` - User registration with validation
- `POST /api/auth/login` - User login with JWT token
- `GET /api/auth/health` - Auth service health check

### **Products**
- `GET /api/products` - Get all products with pagination support
- `GET /api/products/:id` - Get single product details
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### **Orders** (Protected Routes)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's order history
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### **Admin Panel** (Admin Only)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

### **Payments** (Ready for Integration)
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Payment history (Admin only)

### **Enhanced Security Features**
- **Rate Limiting**: API endpoints protected against abuse
- **Role-based Access**: Admin vs User permissions
- **Input Validation**: Comprehensive validation middleware
- **Error Handling**: Centralized error responses
- **JWT Authentication**: Secure token-based authentication

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

## 🚀 Current Status & Architecture

### **✅ Completed Core Features**
- ✅ **Modular Architecture**: Complete MVC pattern implementation
- ✅ **Full-stack Integration**: React + Express with modular structure
- ✅ **Advanced Authentication**: JWT with role-based access control
- ✅ **Product Management**: Full CRUD with admin controls
- ✅ **Shopping Cart**: Advanced cart management with custom hooks
- ✅ **Order Processing**: Complete order lifecycle management
- ✅ **Database Schema**: Enhanced SQLite with relationships
- ✅ **Security Middleware**: Auth, validation, rate limiting, error handling
- ✅ **Reusable Components**: Modular UI component library
- ✅ **Custom Hooks**: Business logic abstraction layer
- ✅ **API Services**: Modular API integration with backward compatibility
- ✅ **Utility Libraries**: Formatting, validation, storage, helpers

### **🏗️ Architecture Benefits**
- **Scalability**: Easy to add new features and modules
- **Maintainability**: Clear separation of concerns
- **Reusability**: Component and hook libraries
- **Testing Ready**: Modular structure facilitates unit testing
- **Type Safety Ready**: Structure prepared for TypeScript migration
- **Performance**: Optimized for lazy loading and code splitting

### **🔄 Ready for Implementation** (Placeholders Created)
- 🔄 **Payment Integration**: Razorpay/Stripe gateway integration
- 🔄 **Complete Admin Panel**: Dashboard, analytics, user management
- 🔄 **Advanced Features**: Search, filtering, reviews, wishlist
- 🔄 **Email System**: Notifications, confirmations, marketing
- 🔄 **File Management**: Image uploads, optimization
- 🔄 **Analytics**: User behavior, sales tracking
- 🔄 **Security Enhancements**: CSRF protection, input sanitization
- 🔄 **Performance**: Caching, database optimization
- 🔄 **Testing Suite**: Unit, integration, and E2E tests

### **📈 Scalability Features**
- **Modular Backend**: Controllers, routes, middleware separation
- **Component Library**: Reusable UI components with variants
- **Hook System**: Custom hooks for business logic
- **API Abstraction**: Modular API services with error handling
- **Utility Libraries**: Comprehensive helper functions
- **Configuration Management**: Environment-based settings
- **Logging System**: Comprehensive logging for debugging
- **Error Boundaries**: Frontend error handling and recovery

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
1. **Frontend Components**: Add to `src/components/` with index.js exports
2. **Custom Hooks**: Create in `src/hooks/` for business logic
3. **API Services**: Add to `src/services/api/` for new endpoints
4. **Backend Controllers**: Create in `backend/src/controllers/`
5. **Backend Routes**: Add to `backend/src/routes/`
6. **Middleware**: Add to `backend/src/middleware/` for cross-cutting concerns
7. **Database**: Modify schema in `backend/src/config/database.js`
8. **Utilities**: Add helpers to `src/services/utils/`

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

## 🔄 Architecture Migration

This project has undergone a major architecture migration to a **modular, scalable structure**. See [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) for detailed information about:

- **Backend Migration**: From monolithic to MVC pattern
- **Frontend Migration**: From basic structure to modular components
- **Backward Compatibility**: All existing functionality preserved
- **New Features**: Enhanced security, validation, error handling
- **Scalability**: Ready for enterprise-level feature additions

### **Migration Benefits**
- 🏗️ **Modular Architecture**: Easy to maintain and extend
- 🔒 **Enhanced Security**: Advanced middleware and validation
- 🎯 **Better Organization**: Clear separation of concerns
- 🚀 **Performance Ready**: Optimized for scaling
- 🧪 **Testing Ready**: Structure facilitates comprehensive testing
- 📚 **Documentation**: Comprehensive code organization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the modular structure when adding new features
4. Use the established patterns for components, hooks, and services
5. Test both frontend and backend functionality
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request with detailed description

### **Development Guidelines**
- Follow the modular structure for new components
- Use custom hooks for business logic
- Create reusable components with proper prop interfaces
- Add proper error handling and validation
- Include JSDoc comments for complex functions
- Follow the established naming conventions

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

For questions or support, please contact [hisham12334](https://github.com/hisham12334).

---

Built with ❤️ using React and Vite