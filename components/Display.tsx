import React, { ReactNode } from 'react';

interface DisplayProps {
  gameOver?: boolean;
  text: string;
  label: string | ReactNode;
}

const Display: React.FC<DisplayProps> = ({ gameOver, text, label }) => {
  return (
    <div className={`
      flex flex-col items-start justify-center
      bg-[#9bbc0f] border-4 border-slate-700
      rounded-sm px-2 py-1 w-full shadow-inner mb-1
    `}>
        <div className="text-[8px] text-[#0f380f] font-bold tracking-tighter mb-1 w-full flex items-center gap-1">
            {label}
        </div>
        <span className={`text-sm md:text-base font-bold tracking-widest ${gameOver ? 'text-red-900' : 'text-[#0f380f]'}`}>{text}</span>
    </div>
  );
};

export default Display;