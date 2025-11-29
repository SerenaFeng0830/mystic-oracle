import React from 'react';

// Common props for our SVG pixel icons
interface PixelIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const PixelMoon: React.FC<PixelIconProps> = ({ className = "", size = 64, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    shapeRendering="crispEdges"
    fill={color}
  >
    <path d="M6 1h6v1h2v2h1v4h-1v2h-2v1h-1v1H9v1H6v-1H5v-1H4v-1H2V6h1V4h1V3h1V2h1V1zm1 2v1h-1v1H5v2H4v3h2v1h3v-1h2V8h1V5h-1V4h-2V3H7z" fillOpacity="0.3"/>
    <path d="M8 2h4v2h2v4h-2v4H8v2H5v-1H4v-2H2V7h2V4h2V2h2z" />
  </svg>
);

export const PixelPotion: React.FC<PixelIconProps> = ({ className = "", size = 64, color = "currentColor" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    shapeRendering="crispEdges"
    fill={color}
  >
    {/* Bottle outline */}
    <path d="M7 1h2v3h2v2h1v7H4V6h1V4h2V1z" fill="#334155" />
    {/* Liquid */}
    <path d="M5 8h6v5H5V8z" fill="#9333ea" />
    {/* Highlight */}
    <path d="M9 9h1v1H9V9zm-2 2h1v1H7v-1z" fill="#e9d5ff" />
    {/* Cork */}
    <path d="M7 1h2v2H7V1z" fill="#b45309" />
  </svg>
);

export const PixelCrystalBall: React.FC<PixelIconProps> = ({ className = "", size = 64 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    shapeRendering="crispEdges"
  >
    {/* Stand */}
    <path d="M5 12h6v1H5v-1zm-1 1h8v2H4v-2z" fill="#78350f" />
    {/* Ball Base */}
    <path d="M5 4h6v1h2v2h1v2h-1v2h-2v1H5v-1H3v-2H2V7h1V5h2V4z" fill="#0ea5e9" fillOpacity="0.4" />
    {/* Ball Shine */}
    <path d="M5 5h2v2H5V5zm4 4h2v2H9V9z" fill="#e0f2fe" fillOpacity="0.8" />
  </svg>
);

export const PixelSkull: React.FC<PixelIconProps> = ({ className = "", size = 64 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    shapeRendering="crispEdges"
  >
     <path d="M5 2h6v2h2v4h-1v2h-1v2h-1v2H6v-2H5v-2H4V8H3V4h2V2z" fill="#e2e8f0" />
     <path d="M5 5h2v2H5V5zm4 0h2v2H9V5zm-2 5h2v2H7v-2z" fill="#0f172a" />
  </svg>
);