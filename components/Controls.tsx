import * as React from 'react';

interface ControlsProps {
  onControl: (action: 'L' | 'R' | 'D' | 'ROT' | 'HD') => void;
}

const Controls: React.FC<ControlsProps> = ({ onControl }) => {
  
  // Helper to handle interaction and prevent browser defaults (scrolling, zooming)
  const handlePress = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent, action: 'L' | 'R' | 'D' | 'ROT' | 'HD') => {
    e.preventDefault();
    e.stopPropagation();
    onControl(action);
  };

  return (
    <div className="w-full shrink-0 pt-4 pb-8 mx-auto max-w-lg select-none px-6 touch-none flex flex-col items-center">
        <div className="flex items-center justify-between gap-8 md:gap-16 w-full md:w-auto">
            
            {/* D-Pad (Classic Cross Style) */}
            <div className="relative w-40 h-40 shrink-0 touch-none">
                {/* D-Pad Background/Socket */}
                <div className="absolute inset-2 bg-slate-300/30 rounded-full pointer-events-none"></div>

                {/* Up */}
                <button 
                    className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-14 bg-slate-800 rounded-t hover:bg-slate-700 active:bg-slate-600 active:mt-1 shadow-md border-b-0 border-2 border-slate-900 z-10 flex items-start justify-center pt-2 text-slate-400 touch-none outline-none focus:outline-none"
                    onPointerDown={(e) => handlePress(e, 'ROT')}
                    onContextMenu={(e) => e.preventDefault()}
                    aria-label="Rotate"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 5l-8 10h16z" />
                    </svg>
                </button>

                {/* Down */}
                <button 
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-14 bg-slate-800 rounded-b hover:bg-slate-700 active:bg-slate-600 active:mt-1 shadow-md border-t-0 border-2 border-slate-900 z-10 flex items-end justify-center pb-2 text-slate-400 touch-none outline-none focus:outline-none"
                    onPointerDown={(e) => handlePress(e, 'D')}
                    onContextMenu={(e) => e.preventDefault()}
                    aria-label="Down"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M12 19l8-10H4z" />
                    </svg>
                </button>

                {/* Left */}
                <button 
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-14 h-12 bg-slate-800 rounded-l hover:bg-slate-700 active:bg-slate-600 active:ml-1 shadow-md border-r-0 border-2 border-slate-900 z-10 flex items-center justify-start pl-2 text-slate-400 touch-none outline-none focus:outline-none"
                    onPointerDown={(e) => handlePress(e, 'L')}
                    onContextMenu={(e) => e.preventDefault()}
                    aria-label="Left"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 12l10 8V4z" />
                    </svg>
                </button>

                {/* Right */}
                <button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-14 h-12 bg-slate-800 rounded-r hover:bg-slate-700 active:bg-slate-600 active:mr-1 shadow-md border-l-0 border-2 border-slate-900 z-10 flex items-center justify-end pr-2 text-slate-400 touch-none outline-none focus:outline-none"
                    onPointerDown={(e) => handlePress(e, 'R')}
                    onContextMenu={(e) => e.preventDefault()}
                    aria-label="Right"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 12l-10-8v16z" />
                    </svg>
                </button>
                
                {/* Center Pivot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800 z-20 flex items-center justify-center pointer-events-none">
                    <div className="w-4 h-4 rounded-full bg-slate-900/50"></div>
                </div>
            </div>

            {/* A/B Buttons */}
            <div className="flex gap-4 items-end transform -rotate-12 pb-4 touch-none">
                 {/* Left Button (Low) -> Now A (Rotate, Red) */}
                 <div className="flex flex-col items-center gap-1 mt-8">
                     <button 
                        className="w-14 h-14 rounded-full bg-red-600 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 active:bg-red-700 shadow-lg text-red-100 font-bold text-xl flex items-center justify-center transition-all group touch-none outline-none focus:outline-none"
                        onPointerDown={(e) => handlePress(e, 'ROT')}
                        onContextMenu={(e) => e.preventDefault()}
                     >
                        <span className="group-active:opacity-50 pointer-events-none">A</span>
                     </button>
                     <span className="text-xs font-bold text-slate-700 tracking-wider pointer-events-none">ROT</span>
                </div>
                {/* Right Button (High) -> Now B (Drop, Green) */}
                <div className="flex flex-col items-center gap-1">
                     <button 
                        className="w-14 h-14 rounded-full bg-green-600 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 active:bg-green-700 shadow-lg text-green-100 font-bold text-xl flex items-center justify-center transition-all group touch-none outline-none focus:outline-none"
                        onPointerDown={(e) => handlePress(e, 'HD')}
                        onContextMenu={(e) => e.preventDefault()}
                     >
                        <span className="group-active:opacity-50 pointer-events-none">B</span>
                     </button>
                     <span className="text-xs font-bold text-slate-700 tracking-wider pointer-events-none">DROP</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Controls;