
import React from 'react';
import { AppData } from './types';
import { CheckCircle2, Star, Calendar, Moon, Zap, Trophy, Book } from 'lucide-react';

interface DashboardProps {
  data: AppData;
  onDaySelect: (day: number) => void;
  onWeekSelect: (week: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onDaySelect, onWeekSelect }) => {
  const khatmaProgress = Math.round((data.quranKhatma.filter(Boolean).length / 30) * 100);
  
  // حساب عدد الأيام التي تم فيها إنجاز مهمة الضفدع (أيام التركيز العالي)
  const highFocusDays = data.days.filter(day => day.frogTask.isCompleted).length;

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-right">
          <h2 className="text-4xl font-black text-gray-800 mb-1">منجزك المبارك</h2>
          <p className="text-gray-500 font-medium">خطوات ثابتة نحو الجنة بإذن الله</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-[2rem] border border-pink-100 shadow-xl shadow-pink-100/20 flex items-center gap-4">
             <div className="bg-pink-100 p-2 rounded-xl text-pink-600"><Book size={24} /></div>
             <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ختمة القرآن</p>
                <p className="text-xl font-black text-gray-800">{khatmaProgress}%</p>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-pink-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 left-0 w-32 h-32 bg-pink-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
           <h3 className="text-xl font-extrabold mb-8 flex items-center gap-2 relative z-10">
             <Calendar className="text-pink-600" size={24} /> رحلة الـ 30 يوماً
           </h3>
           <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-4 relative z-10">
            {data.days.map((day) => (
                <button
                  key={day.dayNumber}
                  onClick={() => onDaySelect(day.dayNumber)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all hover:scale-110 active:scale-90 ${
                    day.dayNumber === data.currentDay 
                    ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-200' 
                    : day.frogTask.isCompleted 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                      : 'bg-white border-pink-50 text-gray-400 hover:border-pink-300'
                  }`}
                >
                  <span className="text-lg font-bold">{day.dayNumber}</span>
                  {day.frogTask.isCompleted && day.dayNumber !== data.currentDay && <CheckCircle2 size={10} className="mt-1" />}
                </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative group overflow-hidden">
            <Zap className="absolute -bottom-10 -left-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star className="text-yellow-400" size={24} /> قوة الاستمرار
            </h3>
            <div className="space-y-6">
              <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                 <p className="text-xs text-pink-300 font-bold mb-2">أيام بتركيز عالٍ</p>
                 <p className="text-2xl font-black">{highFocusDays} يوم</p>
              </div>
              <p className="text-sm opacity-80 leading-relaxed italic">
                "قليل دائم خير من كثير منقطع.. ركز على خطواتك اليومية."
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-pink-100">
             <h4 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
               <Trophy size={18} className="text-yellow-500" /> التقدم الأسبوعي
             </h4>
             <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(w => (
                <button key={w} onClick={() => onWeekSelect(w)} className="bg-pink-50 p-3 rounded-xl hover:bg-pink-100 transition text-pink-600 font-bold text-sm">
                  {w}
                </button>
              ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
