import React, { useEffect, useRef, useState } from 'react';
import { MenuItem, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface WheelProps {
  items: MenuItem[];
  onSpinEnd: (item: MenuItem) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

const Wheel: React.FC<WheelProps> = ({ items, onSpinEnd, isSpinning, setIsSpinning }) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);
  
  // Prevent too many items from rendering text and making it unreadable
  const showText = items.length <= 30;

  const spinWheel = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);

    const newRotation = rotation + 1800 + Math.random() * 360; // Spin at least 5 times
    setRotation(newRotation);

    const finalAngle = newRotation % 360;
    const sliceAngle = 360 / items.length;
    
    // Index = floor((360 - (finalAngle % 360)) / sliceAngle)
    const winningIndex = Math.floor(((360 - finalAngle) % 360) / sliceAngle);
    
    const safeIndex = (winningIndex + items.length) % items.length;

    setTimeout(() => {
      setIsSpinning(false);
      onSpinEnd(items[safeIndex]);
    }, 4500); // Match CSS transition time
  };

  useEffect(() => {
    if (isSpinning) {
      // The state change to 'rotation' triggers the CSS transition
    }
  }, [isSpinning]);

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto aspect-square my-8">
      {/* Pointer - Hide if no items to avoid confusion */}
      {items.length > 0 && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[40px] border-t-red-600 drop-shadow-md"></div>
        </div>
      )}

      {/* Wheel Container */}
      <div className={`relative w-full h-full rounded-full border-8 shadow-2xl overflow-hidden bg-white transition-colors duration-300
        ${items.length === 0 ? 'border-gray-200' : 'border-yellow-800'}`}>
        
        {/* Placeholder for empty state */}
        {items.length === 0 && (
           <div className="absolute inset-0 flex items-center justify-center text-gray-300">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
           </div>
        )}

        <div 
          className="w-full h-full transition-transform duration-[4500ms] cubic-bezier(0.15, 0.05, 0.05, 1)"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {items.length > 0 && (
            <svg 
                viewBox="-1 -1 2 2" 
                className="w-full h-full transform -rotate-90" // Start 0 at top
                ref={wheelRef}
            >
                {items.map((item, index) => {
                const startPercent = index / items.length;
                const endPercent = (index + 1) / items.length;
                
                const [startX, startY] = getCoordinatesForPercent(startPercent);
                const [endX, endY] = getCoordinatesForPercent(endPercent);
                
                const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
                
                const pathData = [
                    `M 0 0`,
                    `L ${startX} ${startY}`,
                    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                    `Z`
                ].join(' ');

                return (
                    <path
                    key={item.id}
                    d={pathData}
                    fill={CATEGORY_COLORS[item.category] || '#ccc'}
                    stroke="white"
                    strokeWidth="0.01"
                    />
                );
                })}
            </svg>
          )}
          
           {/* Text Overlay */}
           {showText && items.length > 0 && items.map((item, index) => {
             const angle = (360 / items.length) * index + (360 / items.length) / 2;
             return (
               <div
                 key={`text-${item.id}`}
                 className="absolute top-0 left-1/2 w-1 h-1/2 origin-bottom flex justify-center pt-4"
                 style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
               >
                 <span 
                    className="writing-vertical-rl text-xs font-bold text-gray-800 tracking-wide truncate max-h-[70%]" 
                    style={{ writingMode: 'vertical-rl' }}
                 >
                   {item.name}
                 </span>
               </div>
             );
           })}
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning || items.length === 0}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
                   w-20 h-20 rounded-full font-bold shadow-lg border-4 transition-all
                   flex items-center justify-center flex-col leading-tight
                   ${items.length === 0 
                      ? 'bg-gray-200 text-gray-400 border-gray-100 cursor-not-allowed' 
                      : 'bg-red-600 text-white border-white active:scale-95 text-xl'}`}
      >
        {isSpinning ? '...' : (items.length === 0 ? <span className="text-xs">請先<br/>選分類</span> : '轉')}
      </button>
    </div>
  );
};

export default Wheel;