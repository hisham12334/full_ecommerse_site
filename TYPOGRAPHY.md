# Typography System

## Font Hierarchy

| Font | Purpose | Feeling | Usage |
|------|---------|---------|-------|
| **Cormorant** | Headlines | Luxury, editorial, premium | `font-serif` or `<h1>-<h6>` tags |
| **Inter** | Body, UI components | Clean, modern, balanced | `font-sans` (default) |
| **Inter** (Caps + tracking) | Labels | Minimal, classy retail aesthetic | `font-mono` or `.label` class |

## Implementation Guide

### Headlines (Cormorant)
Use for main titles, hero text, and section headers to convey luxury and premium feel.

```jsx
<h1 className="font-serif text-6xl">The Last Hoodie You'll Need.</h1>
<h2 className="font-serif text-4xl">Premium Quality</h2>
```

### Body Text (Inter)
Use for paragraphs, descriptions, and general content for clean readability.

```jsx
<p className="font-sans text-base">Our hoodies are crafted with premium materials...</p>
<div className="font-sans">UI components and cards</div>
```

### Labels (Inter with Caps + Tracking)
Use for buttons, tags, navigation, and small UI elements for a minimal retail aesthetic.

```jsx
<button className="label">Add to Cart</button>
<span className="font-mono uppercase tracking-widest text-xs">New Arrival</span>
```

## Tailwind Classes

### Font Families
- `font-serif` - Cormorant (headlines)
- `font-sans` - Inter (body, default)
- `font-mono` - Inter (labels)

### Letter Spacing
- `tracking-luxury` - 0.02em (for headlines)
- `tracking-label` - 0.1em (for uppercase labels)
- `tracking-widest` - Built-in Tailwind for labels

### Common Patterns

#### Hero Section
```jsx
<h1 className="font-serif text-7xl font-semibold tracking-luxury">
  Luxury Title
</h1>
```

#### Product Card
```jsx
<h3 className="font-serif text-2xl">Product Name</h3>
<p className="font-sans text-sm text-warm-grey">Description</p>
<span className="label">₹2,999</span>
```

#### Button
```jsx
<button className="font-sans uppercase tracking-widest text-sm font-medium">
  Shop Now
</button>
```

#### Navigation
```jsx
<nav className="font-mono uppercase tracking-label text-xs">
  <a href="/">Home</a>
  <a href="/shop">Shop</a>
</nav>
```

## Font Weights

### Cormorant (Headlines)
- 400 - Regular
- 500 - Medium (default for h2-h6)
- 600 - SemiBold (default for h1)
- 700 - Bold (for emphasis)

### Inter (Body & Labels)
- 400 - Regular (body text)
- 500 - Medium (labels, buttons)
- 600 - SemiBold (emphasis)
- 700 - Bold (strong emphasis)
- 800 - ExtraBold (rare, special cases)

## Best Practices

1. **Headlines**: Always use `font-serif` for a premium, editorial feel
2. **Body**: Use `font-sans` for clean, readable content
3. **Labels**: Use `font-mono` with `uppercase` and `tracking-widest` for retail aesthetic
4. **Consistency**: Stick to the hierarchy - don't mix fonts arbitrarily
5. **Contrast**: Use font weight and size to create visual hierarchy within each font family
