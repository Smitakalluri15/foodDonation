import React from 'react';

const SectionLabel = ({ text, className = '' }) => {
  const labelStyle = {
    display: 'inline-block',
    backgroundColor: 'var(--y3)',
    color: 'var(--med)',
    border: '1px solid var(--y4)',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '6px 18px',
    marginBottom: '16px',
    fontFamily: "'Nunito', sans-serif"
  };

  return (
    <span className={`section-label ${className}`} style={labelStyle}>
      {text}
    </span>
  );
};

export default SectionLabel;
