
import React, { useState } from 'react';
import { DayEntry, Task, Prayers } from '../types';
import { ArrowRight, CheckSquare, Square, Star, Book, Sparkles, Wand2, Moon, Sun, CloudMoon } from 'lucide-react';
import { getSpiritualInsight, planFrogTask } from '../services/geminiService';

interface DayViewProps {
  entry: DayEntry;
  onUpdate: (updates: Partial<DayEntry>) => void;
  onBack: () => void;
}

const DayView: React.FC<DayViewProps> = ({ entry, onUpdate, onBack }) => {
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiPlan, setAiPlan] = useState('');

  const handleFrogAction = async () => {
    if (!entry.frogTask.description) return;
    setIsLoadingAi(true);
    const plan = await planFrogTask(entry.frogTask.description);
    setAiPlan(plan);
    setIsLoadingAi(false);
  };

  const handleFeelingInsight = async (feeling: string) => {
    setIsLoadingAi(true);
    const insight = await getSpiritualInsight(entry.dayNumber, feeling);
    setAiInsight(insight);
    setIsLoadingAi(false);
  };

  const updatePrayer = (category: keyof Prayers, field: string) => {
    const currentPrayers = { ...entry.prayers };
    const categoryObj = { ...currentPrayers[category] } as any;
    categoryObj[field] = !categoryObj[field];
    
    onUpdate({
      prayers: {
        ...currentPrayers,
        [category]: categoryObj
      }
    });
  };

  const CheckboxItem = ({ checked, onClick, label, icon: Icon, iconColor }: { checked: boolean, onClick: () => void, label: string, icon?: any, iconColor?: string }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-2.5 rounded-xl border transition ${
        checked ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-white border-gray-100 text-gray-500 hover:border-pink-100'
      }`}
    >
      <div className={`transition ${checked ? 'text-pink-600' : 'text-gray-300'}`}>
        {checked ? <CheckSquare size={20} /> : <Square size={20} />}
      </div>
      <span className="flex-1 text-right text-sm font-medium">{label}</span>
      {Icon && <Icon size={16} className={iconColor || 'text-gray-400'} />}
    </button>
  );

  return (
    <div className="space-y-6 pb-24 md:pb-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="text-gray-400 hover:text-pink-600 flex items-center gap-1">
          <ArrowRight size={20} />
          <span>العودة</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">اليوم {entry.dayNumber} - {entry.ramadanDate}</h2>
      </div>

      {/* Prayers Section */}
      <section className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
        <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
          <Moon className="text-indigo-600" size={20} /> جدول الصلوات
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Obligatory */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">الفروض الخمسة</h4>
            <div className="grid grid-cols-1 gap-2">
              <CheckboxItem label="الفجر" checked={entry.prayers.obligatory.fajr} onClick={() => updatePrayer('obligatory', 'fajr')} icon={Sun} iconColor="text-orange-400" />
              <CheckboxItem label="الظهر" checked={entry.prayers.obligatory.dhuhr} onClick={() => updatePrayer('obligatory', 'dhuhr')} icon={Sun} iconColor="text-yellow-400" />
              <CheckboxItem label="العصر" checked={entry.prayers.obligatory.asr} onClick={() => updatePrayer('obligatory', 'asr')} icon={Sun} iconColor="text-yellow-600" />
              <CheckboxItem label="المغرب" checked={entry.prayers.obligatory.maghrib} onClick={() => updatePrayer('obligatory', 'maghrib')} icon={CloudMoon} iconColor="text-indigo-400" />
              <CheckboxItem label="العشاء" checked={entry.prayers.obligatory.isha} onClick={() => updatePrayer('obligatory', 'isha')} icon={Moon} iconColor="text-indigo-900" />
            </div>
          </div>

          {/* Sunnan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">السنن الرواتب</h4>
            <div className="grid grid-cols-1 gap-2">
              <CheckboxItem label="سنة الفجر (٢ قبله)" checked={entry.prayers.sunnan.fajr_pre} onClick={() => updatePrayer('sunnan', 'fajr_pre')} />
              <CheckboxItem label="سنة الظهر (٤ قبله)" checked={entry.prayers.sunnan.dhuhr_pre} onClick={() => updatePrayer('sunnan', 'dhuhr_pre')} />
              <CheckboxItem label="سنة الظهر (٢ بعده)" checked={entry.prayers.sunnan.dhuhr_post} onClick={() => updatePrayer('sunnan', 'dhuhr_post')} />
              <CheckboxItem label="سنة المغرب (٢ بعده)" checked={entry.prayers.sunnan.maghrib_post} onClick={() => updatePrayer('sunnan', 'maghrib_post')} />
              <CheckboxItem label="سنة العشاء (٢ بعده)" checked={entry.prayers.sunnan.isha_post} onClick={() => updatePrayer('sunnan', 'isha_post')} />
            </div>
          </div>

          {/* Night */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">قيام الليل والتهجد</h4>
            <div className="grid grid-cols-1 gap-2">
              <CheckboxItem label="صلاة التراويح" checked={entry.prayers.night.taraweeh} onClick={() => updatePrayer('night', 'taraweeh')} icon={Star} iconColor="text-yellow-400" />
              <CheckboxItem label="صلاة التهجد" checked={entry.prayers.night.tahajjud} onClick={() => updatePrayer('night', 'tahajjud')} icon={Moon} iconColor="text-blue-900" />
            </div>
            <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
               <p className="text-xs text-indigo-700 leading-relaxed">
                 "من قام رمضان إيماناً واحتساباً غفر له ما تقدم من ذنبه"
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frog Task Section */}
      <section className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-emerald-100 p-2 rounded-lg">🐸</div>
          <h3 className="text-lg font-bold">مهمة الضفدع (الأصعب = الأول)</h3>
        </div>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="ما هي المهمة الأصعب اليوم؟"
              className="flex-1 border-b border-gray-200 focus:border-pink-500 outline-none py-2 text-lg"
              value={entry.frogTask.description}
              onChange={(e) => onUpdate({ frogTask: { ...entry.frogTask, description: e.target.value } })}
            />
            <button 
              onClick={() => onUpdate({ frogTask: { ...entry.frogTask, isCompleted: !entry.frogTask.isCompleted } })}
              className={`p-2 rounded-lg transition ${entry.frogTask.isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}
            >
              {entry.frogTask.isCompleted ? <CheckSquare /> : <Square />}
            </button>
          </div>
          <p className="text-sm text-pink-500 flex items-center gap-1">
            <Star size={14} className="fill-pink-500" /> هعملها بعد الفجر مباشرة
          </p>
          
          <button 
            onClick={handleFrogAction}
            className="text-xs flex items-center gap-1 bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full hover:bg-pink-100 transition"
          >
            <Wand2 size={14} /> ساعدني في التخطيط لهذه المهمة
          </button>

          {aiPlan && (
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-800 text-sm whitespace-pre-wrap leading-relaxed border border-emerald-100">
              {aiPlan}
            </div>
          )}
        </div>
      </section>

      {/* Other Tasks */}
      <section className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <CheckSquare className="text-pink-500" /> المهمتان الأخريان
        </h3>
        <div className="space-y-3">
          {entry.otherTasks.map((task, idx) => (
            <div key={task.id} className="flex gap-3 items-center">
              <span className="text-gray-300 font-bold">{idx + 2}.</span>
              <input 
                type="text"
                className="flex-1 border-b border-gray-100 focus:border-pink-500 outline-none py-1"
                value={task.description}
                onChange={(e) => {
                  const newTasks = [...entry.otherTasks];
                  newTasks[idx].description = e.target.value;
                  onUpdate({ otherTasks: newTasks });
                }}
              />
              <button 
                onClick={() => {
                  const newTasks = [...entry.otherTasks];
                  newTasks[idx].isCompleted = !newTasks[idx].isCompleted;
                  onUpdate({ otherTasks: newTasks });
                }}
                className={`transition ${task.isCompleted ? 'text-emerald-500' : 'text-gray-300'}`}
              >
                {task.isCompleted ? <CheckSquare /> : <Square />}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Spiritual Habits */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="text-yellow-500" /> روحانيات اليوم
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div onClick={() => onUpdate({ spiritualHabits: { ...entry.spiritualHabits, morningDhikr: !entry.spiritualHabits.morningDhikr } })}>
                {entry.spiritualHabits.morningDhikr ? <CheckSquare className="text-pink-500" /> : <Square className="text-gray-300 group-hover:text-pink-300" />}
              </div>
              <span>أذكار الصباح</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div onClick={() => onUpdate({ spiritualHabits: { ...entry.spiritualHabits, eveningDhikr: !entry.spiritualHabits.eveningDhikr } })}>
                {entry.spiritualHabits.eveningDhikr ? <CheckSquare className="text-pink-500" /> : <Square className="text-gray-300 group-hover:text-pink-300" />}
              </div>
              <span>أذكار المساء</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div onClick={() => onUpdate({ spiritualHabits: { ...entry.spiritualHabits, duaBeforeIftar: !entry.spiritualHabits.duaBeforeIftar } })}>
                {entry.spiritualHabits.duaBeforeIftar ? <CheckSquare className="text-pink-500" /> : <Square className="text-gray-300 group-hover:text-pink-300" />}
              </div>
              <span>دعوة لا ترد (قبل الإفطار)</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Book className="text-blue-500" /> ورد القرآن
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">هدفي (صفحة)</p>
                <input 
                  type="number"
                  className="w-full border rounded-xl p-2"
                  value={entry.quranProgress.goal}
                  onChange={(e) => onUpdate({ quranProgress: { ...entry.quranProgress, goal: Number(e.target.value) } })}
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">أنجزت (صفحة)</p>
                <input 
                  type="number"
                  className="w-full border rounded-xl p-2"
                  value={entry.quranProgress.completed}
                  onChange={(e) => onUpdate({ quranProgress: { ...entry.quranProgress, completed: Number(e.target.value) } })}
                />
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${Math.min((entry.quranProgress.completed / (entry.quranProgress.goal || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reflection */}
      <section className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
        <h3 className="text-lg font-bold mb-4">شحنة اليوم وتقييمه</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">آية تدبرتها اليوم:</p>
            <textarea 
              className="w-full border rounded-2xl p-3 text-sm focus:ring-2 ring-pink-100 outline-none"
              rows={2}
              value={entry.reflection.verse}
              onChange={(e) => onUpdate({ reflection: { ...entry.reflection, verse: e.target.value } })}
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-1">فكرة جاتلي:</p>
            <textarea 
              className="w-full border rounded-2xl p-3 text-sm focus:ring-2 ring-pink-100 outline-none"
              rows={2}
              value={entry.reflection.idea}
              onChange={(e) => onUpdate({ reflection: { ...entry.reflection, idea: e.target.value } })}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
             <div className="flex-1 w-full">
                <p className="text-sm font-medium mb-2 text-center md:text-right">إحساسي اليوم:</p>
                <div className="flex justify-around bg-gray-50 p-2 rounded-2xl">
                  {([['excellent', '🤩 ممتاز'], ['normal', '😐 عادي'], ['needs-improvement', '😔 محتاج أحسن']] as const).map(([val, label]) => (
                    <button 
                      key={val}
                      onClick={() => {
                        onUpdate({ reflection: { ...entry.reflection, feeling: val } });
                        handleFeelingInsight(label);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-sm transition ${entry.reflection.feeling === val ? 'bg-pink-600 text-white' : 'text-gray-500'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
             </div>
          </div>
          
          {isLoadingAi && <div className="animate-pulse text-pink-500 text-sm text-center">جاري استحضار النصيحة الروحانية...</div>}
          {aiInsight && !isLoadingAi && (
            <div className="bg-pink-50 p-4 rounded-2xl text-pink-700 text-sm italic border-l-4 border-pink-400">
               "{aiInsight}"
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-1">إيه اللي هعمله مختلف بكرة؟</p>
            <input 
              type="text"
              className="w-full border-b border-gray-100 p-2 focus:border-pink-500 outline-none"
              value={entry.reflection.tomorrowDifferent}
              onChange={(e) => onUpdate({ reflection: { ...entry.reflection, tomorrowDifferent: e.target.value } })}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DayView;
