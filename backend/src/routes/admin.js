const express = require('express');
const AdminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

const createAdminRoutes = (db) => {
    const router = express.Router();
    const adminController = new AdminController(db);

    // All admin routes require authentication and admin role
    router.use(authenticateToken);
    router.use(requireAdmin);

    // Dashboard stats
    router.get('/dashboard/stats', (req, res) => adminController.getDashboardStats(req, res));

    // User management
    router.get('/users', (req, res) => adminController.getAllUsers(req, res));
    router.put('/users/:id/role', (req, res) => adminController.updateUserRole(req, res));
    router.delete('/users/:id', (req, res) => adminController.deleteUser(req, res));

    // Product management
    router.post('/products', upload.single('image'), (req, res) => adminController.createProduct(req, res));
    router.put('/products/:id', upload.single('image'), (req, res) => adminController.updateProduct(req, res));
    router.delete('/products/:id', (req, res) => adminController.deleteProduct(req, res));

    // Order management
    router.get('/orders', (req, res) => adminController.getAllOrders(req, res));
    router.put('/orders/:id/status', (req, res) => adminController.updateOrderStatus(req, res));

    return router;
};

module.exports = createAdminRoutes;