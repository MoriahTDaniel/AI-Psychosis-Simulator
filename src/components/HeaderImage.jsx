import React from 'react';

export default function HeaderImage({ src, alt }) {
  return (
    <div style={{ 
      width: '100%', 
      height: '140px', 
      overflow: 'hidden', 
      borderRadius: '12px', 
      marginBottom: '20px',
      border: '1px solid var(--border-subtle)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <img 
        src={src} 
        alt={alt} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          filter: 'brightness(0.7) contrast(1.1)' 
        }} 
      />
    </div>
  );
}