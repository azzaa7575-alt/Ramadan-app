
import React from 'react';
import { Moon, Star, LayoutDashboard, Settings, BookOpen, FileUp, Book } from 'lucide-react';
import { View, AppData } from './types';
interface SidebarProps {
  activeView: View;
  setActiveView: (v: View) => void;
  currentDay: number;
  khatma: boolean[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, currentDay, khatma }) => {
  const completedCount = khatma.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 30) * 100);

  const NavItem = ({ id, icon: Icon, label }: { id: View, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveView(id)}
      className={`flex items-center gap-4 w-full p-4 rounded-[1.5rem] transition-all duration-300 group ${
        activeView === id 
          ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold shadow-xl shadow-pink-200' 
          : 'text-gray-500 hover:bg-pink-50'
      }`}
    >
      <Icon size={20} className={activeView === id ? 'text-white' : 'text-pink-400 group-hover:scale-110 transition'} />
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <aside className="hidden lg:flex flex-col w-80 bg-white/80 backdrop-blur-xl border-l border-pink-100 p-8 h-screen sticky top-0 z-50">
      <div className="flex items-center gap-4 mb-16">
        <div className="w-14 h-14 bg-pink-100 rounded-[1.5rem] flex items-center justify-center shadow-inner">
          <Moon className="text-pink-600 fill-pink-600" size={28} />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-800 leading-tight">المنجز</h1>
          <p className="text-[10px] text-pink-500 font-black tracking-widest uppercase">رمضان مبارك</p>
        </div>
      </div>

      <nav className="flex flex-col gap-3 flex-1">
        <NavItem id="dashboard" icon={LayoutDashboard} label="لوحة الإنجاز" />
        <NavItem id="khatma" icon={Book} label="ختمة القرآن" />
        <NavItem id="day" icon={Star} label="اليوم الحالي" />
        <NavItem id="weekly" icon={BookOpen} label="المراجعة الأسبوعية" />
        <NavItem id="import" icon={FileUp} label="مزامنة Notion" />
        <NavItem id="settings" icon={Settings} label="الإعدادات" />
      </nav>

      <div className="mt-auto space-y-4">
        <div className="bg-white p-5 rounded-[2rem] border border-pink-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
                <Book className="text-pink-600" size={16} />
                <span className="text-xs font-bold text-gray-700">تقدم الختمة</span>
             </div>
             <span className="text-[10px] font-black text-pink-600">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-pink-50 rounded-full overflow-hidden">
             <div 
               className="h-full bg-pink-600 transition-all duration-1000" 
               style={{ width: `${progressPercent}%` }}
             />
          </div>
          <p className="text-[9px] text-gray-400 mt-2 text-center">أنجزت {completedCount} من 30 جزء</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-[2rem] border border-blue-100 text-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-indigo-600 font-bold mb-1">د.م. عزة أبو الحسن</p>
            <p className="text-[10px] text-gray-400">هندسة الحياة © كل عام وأنتم بخير</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
