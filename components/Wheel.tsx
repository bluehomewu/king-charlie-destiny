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

  // Only render text if reasonable
  const showText = items.length <= 100;

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
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto aspect-square my-2">
      {/* Pointer - Hide if no items to avoid confusion */}
      {items.length > 0 && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 filter drop-shadow-xl">
          <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[45px] border-t-red-600"></div>
        </div>
      )}

      {/* Wheel Container */}
      <div className={`relative w-full h-full rounded-full border-[6px] shadow-2xl overflow-hidden bg-white transition-colors duration-300
        ${items.length === 0 ? 'border-gray-200' : 'border-yellow-700'}`}>

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
                    strokeWidth={items.length > 50 ? "0.002" : "0.005"} // Thinner slice borders for high counts
                  />
                );
              })}
            </svg>
          )}

          {/* Text Overlay */}
          {showText && items.length > 0 && items.map((item, index) => {
            const angle = (360 / items.length) * index + (360 / items.length) / 2;

            // Dynamic Sizing & Styling based on Item Count
            let textSizeClass = 'text-base';
            let letterSpacing = 'tracking-normal';
            let strokeWidth = '3px';
            let truncateLength = 99; // Default no truncate
            let topPadding = 'pt-2';

            if (items.length <= 8) {
              // VERY FEW ITEMS (1-8) - Huge Text
              textSizeClass = 'text-2xl sm:text-3xl';
              letterSpacing = 'tracking-widest';
              strokeWidth = '4px';
              topPadding = 'pt-4';
            }
            else if (items.length <= 14) {
              // FEW ITEMS (9-14) - Large Text
              textSizeClass = 'text-lg sm:text-xl';
              letterSpacing = 'tracking-wider';
              strokeWidth = '3.5px';
              topPadding = 'pt-3';
            }
            else if (items.length <= 24) {
              // MEDIUM (15-24)
              textSizeClass = 'text-sm sm:text-base';
              letterSpacing = 'tracking-wide';
              strokeWidth = '3px';
              topPadding = 'pt-2';
            }
            else if (items.length <= 40) {
              // CROWDED (25-40)
              textSizeClass = 'text-xs';
              letterSpacing = 'tracking-normal';
              strokeWidth = '2.5px';
              truncateLength = 5;
              topPadding = 'pt-1.5';
            }
            else if (items.length <= 60) {
              // VERY CROWDED (41-60)
              textSizeClass = 'text-[11px]';
              letterSpacing = 'tracking-tight';
              strokeWidth = '2px';
              truncateLength = 4;
              topPadding = 'pt-1';
            }
            else {
              // EXTREME (>60) - Full menu mode
              textSizeClass = 'text-[10px]';
              letterSpacing = 'tracking-tighter';
              strokeWidth = '0.5px'; // Minimal stroke
              truncateLength = 3; // Aggressive truncate
              topPadding = 'pt-0.5';
            }

            // Truncate name logic
            let displayName = item.name;
            if (displayName.length > truncateLength) {
              displayName = displayName.substring(0, truncateLength);
              // Only add dots if we have space, otherwise just cut
              if (items.length <= 30) displayName += '..';
            }

            const textStrokeStyle: React.CSSProperties = {
              writingMode: 'vertical-rl',
              WebkitTextStroke: `${strokeWidth} white`, // Dynamic stroke width
              paintOrder: 'stroke fill',
              color: '#0f172a', // zinc-950 (Deep black)
              fontWeight: 900, // Black weight
              zIndex: 10
            };

            return (
              <div
                key={`text-${item.id}`}
                className={`absolute top-0 left-1/2 w-1 h-1/2 origin-bottom flex justify-center ${topPadding} pointer-events-none`}
                style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
              >
                <span
                  className={`writing-vertical-rl ${letterSpacing} ${textSizeClass} font-black select-none whitespace-nowrap drop-shadow-sm`}
                  style={textStrokeStyle}
                >
                  {displayName}
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
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 
                   w-20 h-20 rounded-full font-bold shadow-[0_0_15px_rgba(0,0,0,0.3)] border-[3px] transition-all
                   flex items-center justify-center flex-col leading-tight
                   ${items.length === 0
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-gradient-to-br from-red-600 to-red-800 text-white border-white active:scale-95 text-2xl hover:scale-105 hover:shadow-2xl'}`}
      >
        {isSpinning ? (
          <span className="animate-spin text-xl">↻</span>
        ) : (items.length === 0 ? <span className="text-[10px] text-gray-400 leading-tight">請先<br />選分類</span> : <span className="drop-shadow-md">轉</span>)}
      </button>
    </div>
  );
};

export default Wheel;
