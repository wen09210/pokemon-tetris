import * as React from 'react';

interface ControlsProps {
  onControl: (action: 'L' | 'R' | 'D' | 'ROT' | 'HD') => void;
}

const Controls: React.FC<ControlsProps> = ({ onControl }) => {
  return (
    <div className="w-full shrink-0 pt-1 pb-safe mx-auto max-w-lg">
        <div className="flex items-center justify-evenly gap-4">
            
            {/* D-Pad (Cross Key) */}
            <div className="relative w-32 h-32 md:w-36 md:h-36 shrink-0">
                {/* Center Background Block for cohesion */}
                <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-slate-800 z-0"></div>

                {/* Up (Rotate) */}
                <button 
                    className="absolute top-0 left-1/3 w-1/3 h-1/3 bg-slate-800 rounded-t border-t-4 border-l-4 border-r-4 border-black active:border-0 shadow-lg z-10 flex items-center justify-center text-white"
                    onClick={() => onControl('ROT')}
                    aria-label="Up / Rotate"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                {/* Left */}
                <button 
                    className="absolute top-1/3 left-0 w-1/3 h-1/3 bg-slate-800 rounded-l border-l-4 border-t-4 border-b-4 border-black active:border-0 shadow-lg z-10 flex items-center justify-center text-white"
                    onClick={() => onControl('L')}
                    aria-label="Left"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                {/* Right */}
                <button 
                    className="absolute top-1/3 right-0 w-1/3 h-1/3 bg-slate-800 rounded-r border-r-4 border-t-4 border-b-4 border-black active:border-0 shadow-lg z-10 flex items-center justify-center text-white"
                    onClick={() => onControl('R')}
                    aria-label="Right"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                {/* Down */}
                <button 
                    className="absolute bottom-0 left-1/3 w-1/3 h-1/3 bg-slate-800 rounded-b border-b-4 border-l-4 border-r-4 border-black active:border-0 shadow-lg z-10 flex items-center justify-center text-white"
                    onClick={() => onControl('D')}
                    aria-label="Down"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                
                {/* Center decoration */}
                 <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 pointer-events-none z-20 flex items-center justify-center">
                    <div className="w-2/3 h-2/3 bg-black/20 rounded-full"></div>
                 </div>
            </div>

            {/* Action Buttons (A/B Style) */}
            <div className="flex items-end justify-end gap-3 relative pr-2">
                {/* B Button (Left) - Now ROTATE */}
                <div className="flex flex-col items-center mb-2">
                    <button 
                        className="w-16 h-16 bg-green-700 rounded-full border-b-4 border-green-900 active:border-b-0 active:translate-y-1 shadow-xl text-sm text-white font-bold"
                        onClick={() => onControl('ROT')}
                        aria-label="Rotate"
                    >B</button>
                     <span className="text-[10px] text-slate-700 font-bold mt-1 tracking-tighter">ROT</span>
                </div>
                {/* A Button (Right) - Now DROP */}
                <div className="flex flex-col items-center -mt-4">
                    <button 
                        className="w-16 h-16 bg-red-700 rounded-full border-b-4 border-red-900 active:border-b-0 active:translate-y-1 shadow-xl text-sm text-white font-bold"
                        onClick={() => onControl('HD')}
                        aria-label="Hard Drop"
                    >A</button>
                    <span className="text-[10px] text-slate-700 font-bold mt-1 tracking-tighter">DROP</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Controls;