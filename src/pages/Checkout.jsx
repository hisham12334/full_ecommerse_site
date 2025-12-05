import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import Button from '../components/common/Button/Button';

const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function Checkout() {
    const { items, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [razorpayReady, setRazorpayReady] = useState(false);
    const [stockErrors, setStockErrors] = useState([]);
    const [checkingStock, setCheckingStock] = useState(true);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        paymentMethod: 'card'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadScript('https://checkout.razorpay.com/v1/checkout.js').then(res => {
            setRazorpayReady(res);
        });
    }, []);

    // Check stock availability on page load
    useEffect(() => {
        const checkStockAvailability = async () => {
            setCheckingStock(true);
            const stockIssues = [];

            try {
                // Check each item's stock
                for (const item of items) {
                    try {
                        // Use item.id as the product_id
                        const product = await apiService.getProduct(item.id);
                        const variant = product.variants?.find(v => v.id === item.variant_id);
                        
                        if (!variant || variant.stock < item.quantity) {
                            stockIssues.push({
                                title: item.title,
                                requested: item.quantity,
                                available: variant?.stock || 0
                            });
                        }
                    } catch (error) {
                        console.error(`Error checking stock for ${item.title}:`, error);
                    }
                }
                
                setStockErrors(stockIssues);
            } catch (error) {
                console.error('Error checking stock:', error);
            } finally {
                setCheckingStock(false);
            }
        };

        if (items.length > 0) {
            checkStockAvailability();
        }
    }, [items]);

    const subtotal = getCartTotal();
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal + shipping;

    if (items.length === 0 && !orderComplete) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
                    <Link to="/" className="text-action-black hover:underline">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const createOrderWithBackend = async () => {
        const orderItems = items.map(item => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            title: item.title, // Pass title for error messages
        }));

        const orderData = {
            items: orderItems,
            shippingAddress: { ...formData }
        };

        const response = await apiService.createOrder(orderData);
        if (!response.success) {
            throw new Error(response.error || 'Failed to create order');
        }
        return response.orderId;
    };

    const handlePayment = async (orderId) => {
        if (!razorpayReady) {
            alert('Razorpay SDK is not loaded. Please try again.');
            return;
        }

        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
            alert('Razorpay Key ID is not configured.');
            console.error('VITE_RAZORPAY_KEY_ID is not set in .env file');
            return;
        }

        const paymentIntent = await apiService.request('/payments/create-intent', {
            method: 'POST',
            body: JSON.stringify({ amount: total, orderId }),
        });

        const options = {
            key: razorpayKey,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            order_id: paymentIntent.id,
            name: 'E-Commerce Site',
            description: `Order #${orderId}`,
            handler: async (response) => {
                try {
                    await apiService.request('/payments/confirm', {
                        method: 'POST',
                        body: JSON.stringify({ ...response, orderId })
                    });
                    setOrderComplete(true);
                    clearCart();
                } catch (error) {
                    alert('Payment successful but order confirmation failed. Contact support.');
                }
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone,
            },
            theme: { color: '#000000' },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', (response) => {
            alert('Payment failed. Please try again.');
            console.error(response.error);
        });
        paymentObject.open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsProcessing(true);

        try {
            const orderId = await createOrderWithBackend();
            if (formData.paymentMethod === 'cod') {
                setOrderComplete(true);
                clearCart();
            } else {
                await handlePayment(orderId);
            }
        } catch (error) {
            alert(error.message || 'Failed to process order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (orderComplete) {
       return (
            <div className="min-h-screen bg-white">
                 <header className="border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center h-16">
                            <Link to="/" className="font-serif text-2xl tracking-wider text-charcoal">Qadr.fits</Link>
                        </div>
                    </div>
                </header>
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
                        <p className="text-gray-600 mb-8">Thank you. You'll receive a confirmation email shortly.</p>
                        <Button onClick={() => navigate('/')} size="lg">Continue Shopping</Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-16">
                        <Link to="/" className="font-serif text-2xl tracking-wider text-charcoal">Qadr.fits</Link>
                    </div>
                </div>
            </header>
            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <h1 className="text-3xl font-extrabold text-black mb-8 text-center">Checkout</h1>
                
                {/* Stock Availability Warning */}
                {!checkingStock && stockErrors.length > 0 && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-sm font-semibold text-red-800">Items Unavailable</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p className="mb-2">The following items are out of stock or have insufficient quantity:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {stockErrors.map((error, index) => (
                                            <li key={index}>
                                                <span className="font-medium">{error.title}</span> - Requested: {error.requested}, Available: {error.available}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-3">Please update your cart before proceeding.</p>
                                </div>
                                <div className="mt-4">
                                    <Button onClick={() => navigate('/cart')} variant="danger" size="sm">
                                        Update Cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                           {/* Shipping and Contact Forms */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="First name" name="firstName" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} />
                                    <InputField label="Last name" name="lastName" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} />
                                </div>
                                <div className="mt-4"><InputField label="Address" name="address" value={formData.address} onChange={handleInputChange} error={errors.address} /></div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                    <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} error={errors.city} />
                                    <InputField label="State" name="state" value={formData.state} onChange={handleInputChange} error={errors.state} />
                                    <InputField label="ZIP code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} error={errors.zipCode} />
                                </div>
                            </div>
                             <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                                <InputField label="Email address" type="email" name="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
                                <div className="mt-4"><InputField label="Phone number" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} error={errors.phone} /></div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    <RadioInput label="Card / UPI / Netbanking" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} />
                                    <RadioInput label="Cash on Delivery (Coming Soon)" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} disabled={true} />
                                </div>
                            </div>

                            <Button type="submit" disabled={isProcessing || stockErrors.length > 0 || checkingStock} className="w-full" size="lg">
                                {checkingStock ? 'Checking availability...' : isProcessing ? 'Processing...' : `Complete Order - ₹${total.toLocaleString()}`}
                            </Button>
                            
                            {stockErrors.length > 0 && (
                                <p className="text-sm text-red-600 text-center mt-2">
                                    Please resolve stock issues before completing your order
                                </p>
                            )}
                        </form>
                    </div>

                    <div className="bg-gray-50 p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Order</h2>
                        <div className="space-y-4 mb-6">
                            {items.map((item) => (
                                <div key={item.key} className="flex gap-4">
                                    <img src={(item.images && item.images[0]) || item.image || ''} alt={item.title} className="w-16 h-16 object-cover" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>₹{shipping}</span></div>
                            <div className="flex justify-between font-bold text-md border-t border-gray-200 pt-2 mt-2"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper components for form fields to keep the main component cleaner
const InputField = ({ label, name, value, onChange, error, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-3 py-2 border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

const RadioInput = ({ label, name, value, checked, onChange, disabled = false }) => (
    <label className={`flex items-center p-3 border border-gray-300 has-[:checked]:bg-gray-100 has-[:checked]:border-gray-500 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <input type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} className="h-4 w-4 text-black focus:ring-black" />
        <span className="ml-3 text-sm font-medium">{label}</span>
    </label>
);
