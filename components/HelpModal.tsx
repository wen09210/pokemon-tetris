import * as React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#D8D0C0] border-4 border-slate-700 shadow-2xl w-full max-w-md rounded-sm relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-slate-800 text-white p-2 flex justify-between items-center border-b-4 border-slate-700">
          <h2 className="text-sm md:text-base font-bold tracking-wider">HOW TO PLAY</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-400 font-bold px-2"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4 text-slate-800 text-xs md:text-sm font-bold leading-relaxed">
          
          <section>
            <h3 className="text-[#0f380f] border-b-2 border-slate-400 mb-2 pb-1">OBJECTIVE</h3>
            <p>Clear lines to catch the wild Pokémon! A new Pokémon appears every 30 seconds or immediately after you catch one.</p>
          </section>

          <section>
            <h3 className="text-[#0f380f] border-b-2 border-slate-400 mb-2 pb-1">CONTROLS (DESKTOP)</h3>
            <ul className="space-y-2">
                <li className="flex justify-between border-b border-slate-300 pb-1">
                    <span>W / UP ARROW</span>
                    <span>ROTATE</span>
                </li>
                <li className="flex justify-between border-b border-slate-300 pb-1">
                    <span>A / LEFT ARROW</span>
                    <span>MOVE LEFT</span>
                </li>
                <li className="flex justify-between border-b border-slate-300 pb-1">
                    <span>D / RIGHT ARROW</span>
                    <span>MOVE RIGHT</span>
                </li>
                <li className="flex justify-between border-b border-slate-300 pb-1">
                    <span>S / DOWN ARROW</span>
                    <span>SOFT DROP</span>
                </li>
                <li className="flex justify-between border-b border-slate-300 pb-1">
                    <span>SPACEBAR</span>
                    <span>HARD DROP</span>
                </li>
            </ul>
          </section>

          <section>
            <h3 className="text-[#0f380f] border-b-2 border-slate-400 mb-2 pb-1">CONTROLS (MOBILE)</h3>
            <ul className="space-y-2">
                <li className="flex justify-between border-b border-slate-300 pb-1">
                    <span>D-PAD</span>
                    <span>MOVE / SOFT DROP</span>
                </li>
                <li className="flex justify-between border-b border-slate-300 pb-1">
                    <span className="text-red-700">RED BUTTON (A)</span>
                    <span>ROTATE</span>
                </li>
                <li className="flex justify-between border-b border-slate-300 pb-1">
                    <span className="text-green-700">GREEN BUTTON (B)</span>
                    <span>HARD DROP</span>
                </li>
            </ul>
          </section>

          <button 
            onClick={onClose}
            className="mt-2 w-full bg-blue-600 text-white py-3 rounded border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 hover:bg-blue-500 transition-all"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;