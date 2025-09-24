const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// --- START DEBUGGING LOGS ---
console.log('--- Cloudinary Config ---');
console.log('Cloud Name:', process.env.CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'MISSING or UNDEFINED');
console.log('-------------------------');
// --- END DEBUGGING LOGS ---

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'], // Allow modern formats
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' }, // Increase resolution for quality
      { fetch_format: 'auto' }, // Automatically choose the best format
      { quality: 'auto' } // Automatically determine the best quality
    ]
  },
});

const upload = multer({ storage: storage });

module.exports = upload;