# Hero Image Carousel Setup

## To add your 3 model images:

### Method 1: Replace placeholder files
1. **Replace these files** with your actual images:
   - `model-1.jpg` - Tokyo streetwear model (white tee, green cap)
   - `model-2.jpg` - Maroon edition model (burgundy hoodie)
   - `model-3.jpg` - Abstract design model (black tee with colorful print)

### Method 2: Update the component with URLs
2. **Update App.jsx or Home.jsx** to pass your images:
   ```jsx
   const heroImages = [
     {
       src: 'path/to/your/tokyo-model.jpg',
       alt: 'Tokyo Streetwear Collection',
       product: 'Tokyo Edition Tee',
       price: 450,
       description: 'Premium streetwear with authentic Tokyo vibes'
     },
     {
       src: 'path/to/your/maroon-model.jpg',
       alt: 'Maroon Edition Collection', 
       product: 'Maroon Edition Hoodie',
       price: 890,
       description: 'Owners Club collection for enthusiasts'
     },
     {
       src: 'path/to/your/abstract-model.jpg',
       alt: 'Abstract Art Collection',
       product: 'Abstract Design Tee', 
       price: 650,
       description: 'Artistic expression meets streetwear culture'
     }
   ];

   <HeroSection heroImages={heroImages} />
   ```

## Features
- **Image Carousel**: Navigate between 3 model images
- **Smooth Animations**: Framer Motion transitions
- **Dynamic Content**: Product info changes with each image
- **Navigation**: Arrow buttons and dot indicators
- **Responsive Design**: Works on all screen sizes

## Current Images
1. **Model 1**: Tokyo streetwear - white t-shirt with red Tokyo text, green cap
2. **Model 2**: Maroon edition - burgundy hoodie, black pants, sunglasses  
3. **Model 3**: Abstract design - black t-shirt with colorful abstract back print

## Customization
Edit `src/components/common/HeroSection/HeroSection.jsx` to:
- Change product names and prices
- Modify descriptions
- Update styling and colors
- Add more images to the carousel