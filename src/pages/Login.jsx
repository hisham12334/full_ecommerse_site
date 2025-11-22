import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoading, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect based on role
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isRegisterMode) {
      // Registration validation
      if (!name.trim()) {
        setError('Name is required');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      const result = await register(name, email, password);
      
      if (result.success) {
        // Navigation is handled by the useEffect above
      } else {
        setError(result.error || 'Registration failed');
      }
    } else {
      // Login
      const result = await login(email, password);
      
      if (result.success) {
        // Navigation is handled by the useEffect above
      } else {
        setError(result.error || 'Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-warm-grey/20">
        
        <Link to="/" className="inline-flex items-center text-sm text-warm-grey hover:text-charcoal mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <h2 className="text-3xl font-serif text-charcoal mb-2">
          {isRegisterMode ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-warm-grey mb-8">
          {isRegisterMode 
            ? 'Sign up to start shopping with us.' 
            : 'Please sign in to access your account.'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-warm-grey/30 rounded focus:ring-1 focus:ring-charcoal focus:border-charcoal outline-none transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-warm-grey/30 rounded focus:ring-1 focus:ring-charcoal focus:border-charcoal outline-none transition-all"
              placeholder={isRegisterMode ? "your@email.com" : "admin@admin.com"}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-warm-grey/30 rounded focus:ring-1 focus:ring-charcoal focus:border-charcoal outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-warm-grey/30 rounded focus:ring-1 focus:ring-charcoal focus:border-charcoal outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-charcoal text-white py-3 rounded font-medium hover:bg-black transition-colors flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegisterMode ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
              setName('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-sm text-charcoal hover:underline"
          >
            {isRegisterMode 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;