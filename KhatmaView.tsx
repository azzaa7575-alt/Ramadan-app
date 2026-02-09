
import React from 'react';
import { Book, CheckCircle2, Star, Trophy } from 'lucide-react';

interface KhatmaViewProps {
  khatma: boolean[];
  onToggle: (index: number) => void;
  onBack: () => void;
}

const KhatmaView: React.FC<KhatmaViewProps> = ({ khatma, onToggle, onBack }) => {
  const completedCount = khatma.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 30) * 100);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-right">
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <Book className="text-pink-600" size={32} /> تتبع ختمة القرآن
          </h2>
          <p className="text-gray-500 mt-1">"ورتل القرآن ترتيلاً" - رحلتك نحو الختام</p>
        </div>
        
        <div className="bg-white px-8 py-4 rounded-[2rem] border border-pink-100 shadow-xl shadow-pink-100/10 flex items-center gap-6">
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">الإنجاز</p>
              <p className="text-2xl font-black text-pink-600">{progressPercent}%</p>
           </div>
           <div className="w-px h-10 bg-pink-100"></div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">الأجزاء</p>
              <p className="text-2xl font-black text-gray-800">{completedCount}<span className="text-xs text-gray-400 font-normal">/30</span></p>
           </div>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-pink-100 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none"></div>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4 relative z-10">
          {khatma.map((isDone, idx) => (
            <button
              key={idx}
              onClick={() => onToggle(idx)}
              className={`aspect-square rounded-[1.5rem] flex flex-col items-center justify-center border-2 transition-all duration-300 hover:scale-105 active:scale-95 group relative ${
                isDone 
                ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-200' 
                : 'bg-white border-pink-50 text-gray-400 hover:border-pink-200'
              }`}
            >
              <span className={`text-[9px] mb-1 font-bold ${isDone ? 'text-white/70' : 'text-gray-300'}`}>جزء</span>
              <span className="text-xl font-black">{idx + 1}</span>
              {isDone && <CheckCircle2 size={14} className="text-white absolute top-2 right-2" />}
              
              {!isDone && (
                <div className="absolute inset-0 bg-pink-600 opacity-0 group-hover:opacity-5 rounded-[1.5rem] transition-opacity"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[2.5rem] text-white flex items-center gap-6 shadow-2xl relative overflow-hidden group">
          <Star className="absolute -bottom-6 -left-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform" />
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
            <Trophy className="text-yellow-400" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">بشرى المحبين</h3>
            <p className="text-xs opacity-70 leading-relaxed italic">"يقال لصاحب القرآن: اقرأ وارق ورتل كما كنت ترتل في الدنيا.."</p>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="bg-white border border-pink-100 p-8 rounded-[2.5rem] flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-pink-50 transition-all shadow-sm"
        >
          <Star className="text-pink-600" size={20} />
          العودة للوحة الإنجاز الرئيسية
        </button>
      </div>
    </div>
  );
};

export default KhatmaView;
