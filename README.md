# Full Ecommerce Site

A modern, responsive ecommerce website built with React, Vite, and Tailwind CSS. Features a complete shopping experience with product browsing, cart management, user authentication, and checkout functionality.

> **Last Updated:** September 13, 2025 - Enhanced with latest features and improvements

## 🚀 Features

- **Product Catalog**: Browse and search through products
- **Shopping Cart**: Add, remove, and manage items in cart
- **User Authentication**: Login and registration system
- **Product Details**: Detailed product pages with images and descriptions
- **Checkout Process**: Complete order processing
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: Enhanced UX with Framer Motion

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1
- **Build Tool**: Vite 5.2.0
- **Styling**: Tailwind CSS 3.4.3
- **Routing**: React Router DOM 7.9.1
- **Animations**: Framer Motion 10.16.4
- **State Management**: React Context API

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/hisham12334/full_ecommerse_site.git
cd full_ecommerse_site
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state management
│   └── CartContext.jsx # Shopping cart state management
├── pages/              # Page components
│   ├── Home.jsx        # Homepage with product listing
│   ├── Cart.jsx        # Shopping cart page
│   ├── Checkout.jsx    # Checkout process
│   └── ProductDetails.jsx # Individual product page
├── services/           # API services and utilities
├── hooks/              # Custom React hooks
├── data/               # Static data and mock data
├── assets/             # Images, icons, and static assets
├── styles/             # CSS and styling files
│   └── index.css       # Main stylesheet with Tailwind
├── App.jsx             # Main app component
└── main.jsx            # Application entry point
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🔧 Configuration

The project uses several configuration files:

- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration for Tailwind

## 🌟 Key Components

### Context Providers
- **AuthContext**: Manages user authentication state
- **CartContext**: Handles shopping cart operations

### Pages
- **Home**: Product listing and hero section
- **ProductDetails**: Individual product information
- **Cart**: Shopping cart management
- **Checkout**: Order completion process

## 🎨 Styling

The project uses Tailwind CSS for styling with:
- Responsive design patterns
- Custom color schemes
- Smooth animations with Framer Motion
- Mobile-first approach

## 🚀 Deployment

To deploy the application:

1. Build the project:
```bash
npm run build
```

2. The `dist` folder will contain the production-ready files
3. Deploy the contents of `dist` to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

For questions or support, please contact [hisham12334](https://github.com/hisham12334).

---

Built with ❤️ using React and Vite