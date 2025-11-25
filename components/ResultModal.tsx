import React from 'react';
import { SpinResult } from '../types';

interface ResultModalProps {
  spinResult: SpinResult | null;
  onClose: () => void;
  isOpen: boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({ spinResult, onClose, isOpen }) => {
  if (!isOpen || !spinResult) return null;

  const { item, fortune, sugar, ice } = spinResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100 animate-bounce-in relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-red-400 to-pink-500 z-0"></div>
        <div className="absolute top-4 right-4 text-white/20 z-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        </div>

        <div className="relative z-10 pt-16 text-center">
            <div className="inline-block p-4 rounded-full bg-white shadow-lg mb-4">
               <span className="text-4xl">🧋</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-1">命定之選</h2>
            <div className="w-16 h-1 bg-red-400 mx-auto rounded-full mb-4"></div>

            <h3 className="text-3xl font-black text-red-600 mb-2 leading-tight">{item.name}</h3>
            
            <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm text-gray-500 font-medium bg-gray-100 py-1 px-3 rounded-full">
                    {item.category}
                </span>
                
                {/* Price Display */}
                <span className="text-sm font-bold text-red-700 bg-red-50 border border-red-100 py-1 px-3 rounded-full">
                    {item.priceM && <span>M: ${item.priceM}</span>}
                    {item.priceM && item.priceL && <span className="mx-1">/</span>}
                    {item.priceL && <span>L: ${item.priceL}</span>}
                </span>
            </div>
            
            {/* Random Sugar & Ice Tags */}
            {(sugar || ice) && (
                <div className="flex justify-center gap-3 mb-6">
                    {sugar && (
                        <div className="bg-pink-50 text-pink-600 border border-pink-200 px-3 py-1 rounded-lg text-sm font-bold flex flex-col leading-tight">
                            <span className="text-[10px] opacity-70">甜度</span>
                            {sugar}
                        </div>
                    )}
                    {ice && (
                        <div className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-lg text-sm font-bold flex flex-col leading-tight">
                            <span className="text-[10px] opacity-70">冰塊</span>
                            {ice}
                        </div>
                    )}
                </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider mb-1">AI 命運指引</p>
                <p className="text-gray-700 italic leading-relaxed min-h-[60px]">
                    {fortune || "正在讀取命運星象..."}
                </p>
            </div>

            <button 
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors shadow-lg active:transform active:scale-95"
            >
                太棒了！再來一次
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;