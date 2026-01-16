import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register, googleLogin, isLoading, user } = useAuth();
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const result = await googleLogin(
        credentialResponse.credential,
        decoded.name,
        decoded.email
      );

      if (!result.success) {
        setError(result.error || 'Google sign-in failed');
      }
      // Navigation is handled by the useEffect above
    } catch (error) {
      setError('Failed to process Google sign-in');
      console.error('Google sign-in error:', error);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed');
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

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-grey/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-warm-grey">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              text={isRegisterMode ? "signup_with" : "signin_with"}
              shape="rectangular"
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </div>

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