# Full Stack Ecommerce Site

A complete, modern ecommerce application with React frontend and Express.js backend. Features full user authentication, product management, shopping cart functionality, order processing with SQLite database, **complete admin panel**, and **Cloudinary image upload integration**. Built with **modular architecture** and **scalable structure** ready for enterprise-level features.

> **Last Updated:** December 23, 2024 - Multiple Image Gallery & Mobile-Optimized Admin Panel

## ✨ Current Capabilities

### 🛍️ **Frontend Features**
- **Complete Admin Panel**: Full-featured admin dashboard with product, order, and user management
- **Multiple Image Gallery**: Interactive product image gallery with swipe navigation and thumbnails
- **Mobile-Optimized Orders**: Enhanced mobile scaling for admin order management
- **Role-Based Access Control**: Admin routes protected with AdminRoute component
- **Advanced Product Management**: Create, edit, delete products with multiple image upload (up to 3 images)
- **Real-time Dashboard**: Live statistics, recent orders, and analytics overview
- **Modular Components**: Reusable UI components with consistent design system
- **Product Catalog**: Dynamic product listing with enhanced ProductGrid component
- **Product Details**: Individual product pages with interactive image galleries
- **Shopping Cart**: Advanced cart management with custom hooks
- **User Authentication**: Complete auth system with role-based permissions
- **Checkout Process**: Multi-step checkout with form validation
- **Error Boundaries**: Comprehensive error handling and user feedback
- **Custom Hooks**: Business logic abstraction (useProducts, useOrders, useCart)
- **Responsive Design**: Mobile-first with modular Layout component
- **Loading States**: Enhanced UX with Loading components and error handling
- **Lucide React Icons**: Modern icon system throughout the application

### 🔧 **Backend Features**
- **Complete Admin API**: Full admin endpoints for products, orders, users, and dashboard stats
- **Multiple Image Support**: Backend ready for multiple product images with array handling
- **Cloudinary Integration**: Professional image upload, storage, and transformation
- **File Upload System**: Multer integration with automatic image processing
- **Advanced Product Management**: Full CRUD with multiple image upload, SKU, variants, and inventory
- **Order Management System**: Complete order lifecycle with status updates
- **User Role Management**: Admin vs User permissions with role-based access control
- **Dashboard Analytics**: Real-time statistics and business metrics
- **Modular Architecture**: MVC pattern with controllers, routes, and middleware
- **RESTful API**: Complete Express.js API with centralized error handling
- **Payment Integration**: Payment gateway support (Razorpay integration ready)
- **Database**: Enhanced SQLite schema with relationships and constraints
- **Security**: Advanced middleware for auth, validation, and rate limiting
- **Logging**: Comprehensive logging system for debugging and monitoring
- **Email Service**: Nodemailer integration for notifications (ready for implementation)

### 📊 **Database Schema**
- **Users Table**: User accounts with encrypted passwords
- **Products Table**: Product catalog with images, pricing, variants
- **Orders Table**: Order history with user relationships and status tracking

## 🛠️ Tech Stack

### **Frontend**
- **React**: 18.3.1 - Modern React with hooks and context
- **Vite**: 5.2.0 - Fast build tool and dev server
- **Tailwind CSS**: 3.4.3 - Utility-first CSS framework
- **React Router DOM**: 7.9.1 - Client-side routing with protected routes
- **Framer Motion**: 10.16.4 - Animation library
- **Lucide React**: 0.544.0 - Modern icon library
- **Context API**: Global state management with role-based auth

### **Backend**
- **Node.js**: Runtime environment
- **Express.js**: 4.18.2 - Web framework with modular routing
- **SQLite3**: 5.1.6 - Embedded database with enhanced schema
- **Cloudinary**: 1.41.3 - Cloud-based image management
- **Multer**: 1.4.5 - File upload middleware
- **JWT**: 9.0.2 - Authentication tokens with role-based access
- **bcryptjs**: 2.4.3 - Password hashing
- **Nodemailer**: 6.9.7 - Email service integration
- **Razorpay**: 2.9.2 - Payment gateway integration
- **PostgreSQL**: 8.16.3 - Production database support
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

### **5. Cloudinary Setup (Required for Image Upload)**
```bash
# Add these to your backend/.env file
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**To get Cloudinary credentials:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add them to your backend/.env file

### **6. Start the Application**

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

### **7. Access the Application**
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **Admin Panel**: `http://localhost:5173/admin` (requires admin account)
- **Health Check**: `http://localhost:5000/api/health`

### **8. Admin Account Setup**
To access the admin panel, you need an admin account:
1. Register a regular user account
2. Manually update the user's role in the database:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
3. Or use the API endpoint (if you have admin access):
   ```bash
   PUT /api/admin/users/:id/role
   Body: { "role": "admin" }
   ```

## 🏗️ Project Structure

```
├── src/                        # Frontend Source Code
│   ├── components/             # Modular UI Components
│   │   ├── common/            # Reusable components
│   │   │   ├── AdminRoute.jsx # Admin route protection component
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
│   │   ├── Home.jsx           # Product catalog homepage
│   │   ├── Cart.jsx           # Shopping cart page
│   │   ├── Checkout.jsx       # Checkout process
│   │   ├── ProductDetails.jsx # Product details page
│   │   ├── Dashboard/         # User dashboard (placeholder)
│   │   │   ├── Dashboard.jsx  # User dashboard component
│   │   │   └── index.js       # Dashboard exports
│   │   └── admin/             # Admin panel pages
│   │       └── AdminPanel.jsx # Complete admin panel with all features
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
│   │   │   ├── cloudinary.js  # Cloudinary image upload config
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

# Cloudinary Configuration (Required for image upload)
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Payment Gateway (Optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
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
- `GET /api/admin/dashboard/stats` - Dashboard statistics and analytics
- `GET /api/admin/products` - Get all products for admin management
- `POST /api/admin/products` - Create new product with image upload
- `PUT /api/admin/products/:id` - Update product with image upload
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders with customer details
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users with role information
- `PUT /api/admin/users/:id/role` - Update user role (admin/user)
- `DELETE /api/admin/users/:id` - Delete user account

### **Payments** (Razorpay Integration Ready)
- `POST /api/payments/create-intent` - Create Razorpay payment intent
- `POST /api/payments/confirm` - Confirm payment and update order
- `GET /api/payments/history` - Payment history (Admin only)
- `POST /api/payments/refund` - Process refunds (Admin only)

### **Enhanced Security Features**
- **Role-based Access Control**: Complete admin vs user permission system
- **Protected Admin Routes**: AdminRoute component for frontend protection
- **JWT Authentication**: Secure token-based auth with role verification
- **Rate Limiting**: API endpoints protected against abuse
- **Input Validation**: Comprehensive validation middleware
- **File Upload Security**: Secure image upload with format validation
- **Error Handling**: Centralized error responses
- **Session Management**: Automatic token expiry and cleanup
- **Payment Idempotency**: Implemented idempotency keys to prevent double payments and ensure transaction safety

## 🔐 Security Features

- **Role-Based Authentication**: Complete admin/user role system
- **Protected Admin Panel**: AdminRoute component with role verification
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth with expiry
- **Protected Routes**: All sensitive operations require authentication
- **File Upload Security**: Secure Cloudinary integration with validation
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Proper cross-origin setup
- **Error Handling**: Comprehensive error responses
- **Session Management**: Automatic cleanup of expired tokens
- **Payment Security**: Idempotency implementation prevents double payments and ensures transaction integrity
- **Transaction Safety**: Unique payment identifiers and duplicate transaction detection

## 🎨 UI/UX Features

- **Interactive Image Gallery**: Multi-image product galleries with swipe navigation and thumbnails
- **Mobile-First Design**: Touch-optimized interface with swipe gestures and proper touch targets
- **Complete Admin Dashboard**: Professional admin panel with statistics
- **Mobile-Optimized Admin**: Enhanced mobile scaling for order management with card layouts
- **Modern Icon System**: Lucide React icons throughout the application
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: User feedback during API calls
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: Framer Motion for enhanced UX with 500ms image transitions
- **Persistent Cart**: Cart state maintained across sessions
- **User Avatars**: Dynamic avatar generation
- **Form Validation**: Client-side validation with feedback
- **Multiple Image Upload**: Support for up to 3 product images with visual feedback
- **Real-time Updates**: Live dashboard statistics and order status
- **Professional Tables**: Sortable, filterable data tables with mobile card views
- **Status Indicators**: Color-coded status badges and indicators

### 🖼️ **Image Gallery Features**
- **Swipe Navigation**: Touch-friendly swipe gestures (50px minimum swipe distance)
- **Click Navigation**: Click main image to advance to next image
- **Arrow Controls**: Hover-activated arrows on desktop, always visible on mobile
- **Thumbnail Navigation**: Click thumbnails to jump to specific images
- **Image Counter**: Visual indicator showing current image position (e.g., "2 / 3")
- **Smooth Transitions**: 500ms fade transitions between images
- **Responsive Layout**: Optimized for both mobile and desktop viewing
- **Touch Targets**: 44px minimum touch targets for mobile accessibility
- **Backward Compatibility**: Graceful fallback for single-image products

## 🚀 Current Status & Architecture

### **✅ Completed Core Features**
- ✅ **Multiple Image Gallery**: Interactive product image gallery with swipe navigation, thumbnails, and mobile optimization
- ✅ **Mobile-Optimized Admin Panel**: Enhanced mobile scaling for orders section with card layouts and touch-friendly controls
- ✅ **Complete Admin Panel**: Full-featured dashboard with all management tools
- ✅ **Cloudinary Integration**: Professional image upload and management
- ✅ **Role-Based Access Control**: Complete admin/user permission system
- ✅ **Advanced Product Management**: CRUD with multiple image upload (up to 3 images), variants, inventory
- ✅ **Order Management System**: Complete lifecycle with status updates and mobile-friendly interface
- ✅ **User Management**: Admin tools for user role management
- ✅ **Dashboard Analytics**: Real-time statistics and business metrics
- ✅ **Modular Architecture**: Complete MVC pattern implementation
- ✅ **Full-stack Integration**: React + Express with modular structure
- ✅ **Advanced Authentication**: JWT with role-based access control
- ✅ **Shopping Cart**: Advanced cart management with custom hooks
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

### **🔄 Ready for Implementation** (Infrastructure Created)
- 🔄 **Payment Integration**: Razorpay gateway integration (backend ready)
- 🔄 **Email Notifications**: Order confirmations, status updates (Nodemailer configured)
- 🔄 **Advanced Search**: Product search and filtering system
- 🔄 **Product Reviews**: Rating and review system
- 🔄 **Wishlist Feature**: User wishlist functionality
- 🔄 **Analytics Enhancement**: Advanced business intelligence
- 🔄 **Security Enhancements**: CSRF protection, input sanitization
- 🔄 **Performance**: Caching, database optimization
- 🔄 **Testing Suite**: Unit, integration, and E2E tests
- 🔄 **Mobile App**: React Native version
- 🔄 **Multi-vendor**: Marketplace functionality

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
3. Add products to cart and complete checkout
4. Create an admin account (see Admin Account Setup above)
5. Access admin panel at `/admin`
6. Test product creation with image upload
7. Test order management and status updates
8. Verify dashboard statistics and analytics

### **Troubleshooting**
- **"Failed to fetch"**: Ensure backend server is running on port 5000
- **Admin panel access denied**: Ensure user has admin role in database
- **Image upload fails**: Check Cloudinary credentials in backend/.env
- **CORS errors**: Check CORS configuration in backend/server.js
- **Database issues**: Delete `backend/ecommerce.db` to reset database
- **Token issues**: Clear localStorage and re-login
- **File upload errors**: Ensure Cloudinary environment variables are set

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