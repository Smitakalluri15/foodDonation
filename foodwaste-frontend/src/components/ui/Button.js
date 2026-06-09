import React from 'react';

const Button = ({ label, variant = 'primary', onClick, size = 'md', className = '', type = 'button', disabled = false, children }) => {
  const sizeStyles = {
    sm: { padding: '8px 20px', fontSize: '13px' },
    md: { padding: '12px 30px', fontSize: '15px' },
    lg: { padding: '14px 36px', fontSize: '16px' }
  };

  const selectedSize = sizeStyles[size] || sizeStyles.md;
  const isPrimary = variant === 'primary';
  
  const buttonStyle = {
    padding: selectedSize.padding,
    fontSize: selectedSize.fontSize,
    borderRadius: '50px',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    opacity: disabled ? 0.6 : 1,
    border: isPrimary ? 'none' : '2px solid var(--y10)',
    backgroundColor: isPrimary ? 'var(--y10)' : 'var(--y1)',
    color: 'var(--dark)',
    boxShadow: isPrimary ? 'var(--primary-btn-shadow)' : 'none',
  };

  // Merge extra hover styling logic into custom element if necessary,
  // but let's use class names for hover and inline style as fallback
  const btnClass = `btn btn-${variant} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
      className={btnClass}
    >
      {label || children}
    </button>
  );
};

export default Button;
