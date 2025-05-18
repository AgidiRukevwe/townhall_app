import React from "react";

export const THLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg width="108" height="40" viewBox="0 0 108 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.9556 3.86664H0V0.866638H37.3333V3.86664H20.3778V38.8H16.9556V3.86664Z" fill="#262626"/>
        <path d="M43.5556 38.8V0.866638H47.0222V18.0444H70.8889V0.866638H74.3111V38.8H70.8889V21.0444H47.0222V38.8H43.5556Z" fill="#262626"/>
        <path d="M104.978 38.8H101.511L98.4889 30.4889H82.0889L79.0222 38.8H75.8L88.9333 0.866638H91.7333L104.978 38.8ZM96.9778 27.5111L90.2444 8.08886L83.5111 27.5111H96.9778Z" fill="#1476FF"/>
      </svg>
    </div>
  );
};