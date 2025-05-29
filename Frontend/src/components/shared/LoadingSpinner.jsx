import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 24, className = "" }) => {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className={`h-${size} w-${size} animate-spin text-[#6A38C2] ${className}`} />
    </div>
  );
};

export default LoadingSpinner; 