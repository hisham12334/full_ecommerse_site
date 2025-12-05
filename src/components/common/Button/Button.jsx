const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  // Base classes for sharp corners and bold font weight
  const baseClasses = 'font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variants updated with a new 'success' state
  const variants = {
    primary: 'bg-black text-white focus:ring-black',
    secondary: 'bg-gray-200 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 text-white focus:ring-red-500',
    outline: 'border border-gray-300 text-gray-700 focus:ring-black',
    success: 'bg-green-600 text-white focus:ring-green-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;