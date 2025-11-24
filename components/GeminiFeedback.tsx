import React, { useEffect, useState } from 'react';
import { getEncouragement } from '../services/geminiService';

interface GeminiFeedbackProps {
  rowsCleared: number;
}

const GeminiFeedback: React.FC<GeminiFeedbackProps> = ({ rowsCleared }) => {
  const [message, setMessage] = useState<string>("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (rowsCleared > 0) {
      let isMounted = true;
      getEncouragement(rowsCleared, 1).then((msg) => {
        if (isMounted) {
          setMessage(msg);
          setVisible(true);
          // Hide after 2 seconds
          setTimeout(() => {
             if(isMounted) setVisible(false)
          }, 2000);
        }
      });
      return () => { isMounted = false; };
    }
  }, [rowsCleared]);

  if (!visible) return null;

  return (
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none w-full flex justify-center">
      <div className="animate-bounce bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-[0_10px_20px_rgba(236,72,153,0.5)] border-4 border-white transform rotate-[-5deg]">
        <h2 className="text-3xl font-black italic uppercase tracking-widest candy-text-shadow whitespace-nowrap">
          {message}
        </h2>
      </div>
    </div>
  );
};

export default GeminiFeedback;
