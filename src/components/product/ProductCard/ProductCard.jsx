import { Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import Button from '../../common/Button';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">
              ₹{product.price}
            </span>
            <span className="text-sm text-gray-500 capitalize">
              {product.category}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full"
          size="sm"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;