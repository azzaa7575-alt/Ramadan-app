
import React, { useState, useEffect, useRef } from 'react';
import { AppData, View, AppTheme, NotificationSettings, ReminderConfig } from './types';
import { INITIAL_APP_DATA, THEMES } from './constants';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import DayView from './DayView';
import ReviewView from './ReviewView';
import KhatmaView from './KhatmaView';
import { convertNotionToAppData, fetchPrayerTimesFromSearch } from './geminiService';
import { FileUp, Zap, Settings, Palette, Bell, BellOff, Clock, Sparkles, MapPin, Globe, Loader2, Edit3, MessageSquare, Moon, Lock, Unlock, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  // --- نظام كود التفعيل ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ramadan_app_auth_status') === 'active';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('ramadan_tracker_pro_data');
    const parsed = saved ? JSON.parse(saved) : INITIAL_APP_DATA;
    return {
      ...INITIAL_APP_DATA,
      ...parsed,
      notifications: { ...INITIAL_APP_DATA.notifications, ...(parsed.notifications || {}) },
      theme: parsed.theme || INITIAL_APP_DATA.theme
    };
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [isFetchingPrayers, setIsFetchingPrayers] = useState(false);
  
  const lastNotifiedMinute = useRef<string>('');

  useEffect(() => {
    localStorage.setItem('ramadan_tracker_pro_data', JSON.stringify(data));
  }, [data]);

  // محرك التنبيهات
  useEffect(() => {
    if (!data.notifications?.masterEnabled || !isAuthenticated) return;
    const checkReminders = () => {
      const now = new Date();
      const currentMinute = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (currentMinute === lastNotifiedMinute.current) return;
      const { reminders } = data.notifications;
      let notifiedInThisCycle = false;
      (Object.entries(reminders) as Array<[string, ReminderConfig]>).forEach(([key, config]) => {
        if (config.enabled && config.time === currentMinute) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`🌙 ${config.label}`, { body: config.message, icon: '/favicon.ico' });
            notifiedInThisCycle = true;
          }
        }
      });
      if (notifiedInThisCycle) lastNotifiedMinute.current = currentMinute;
    };
    const interval = setInterval(checkReminders, 10000);
    return () => clearInterval(interval);
  }, [data.notifications, isAuthenticated]);

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "Ramadan") { // كلمة السر المطلوبة بدون 2025
      setIsAuthenticated(true);
      localStorage.setItem('ramadan_app_auth_status', 'active');
      setAuthError(false);
    } else {
      setAuthError(true);
      // اهتزاز خفيف عند الخطأ
      const element = document.getElementById('auth-card');
      element?.classList.add('animate-shake');
      setTimeout(() => element?.classList.remove('animate-shake'), 500);
    }
  };

  const toggleMasterNotifications = async () => {
    if (!('Notification' in window)) return;
    if (data.notifications.masterEnabled) {
      setData(prev => ({ ...prev, notifications: { ...prev.notifications, masterEnabled: false } }));
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setData(prev => ({ ...prev, notifications: { ...prev.notifications, masterEnabled: true } }));
      }
    }
  };

  const handleFetchPrayerTimes = async () => {
    if (!locationInput) return;
    setIsFetchingPrayers(true);
    try {
      const { prayerData } = await fetchPrayerTimesFromSearch(locationInput);
      if (prayerData) {
        const mapping: any = { 'fajr': 'prayerFajr', 'dhuhr': 'prayerDhuhr', 'asr': 'prayerAsr', 'maghrib': 'prayerMaghrib', 'isha': 'prayerIsha' };
        const newReminders = { ...data.notifications.reminders };
        Object.entries(prayerData).forEach(([key, time]: [any, any]) => {
          const targetKey = mapping[key.toLowerCase()];
          if (targetKey && typeof time === 'string') {
            newReminders[targetKey as keyof NotificationSettings['reminders']].time = time;
            newReminders[targetKey as keyof NotificationSettings['reminders']].enabled = true;
          }
        });
        setData(prev => ({ ...prev, notifications: { ...prev.notifications, reminders: newReminders } }));
      }
    } catch (e) { alert('تعذر جلب المواقيت.'); } finally { setIsFetchingPrayers(false); }
  };

  const updateReminderField = (key: keyof NotificationSettings['reminders'], field: keyof ReminderConfig, value: any) => {
    setData(prev => {
      const newReminders = { ...prev.notifications.reminders };
      newReminders[key] = { ...newReminders[key], [field]: value };
      return { ...prev, notifications: { ...prev.notifications, reminders: newReminders } };
    });
  };

  // شاشة التفعيل (تسجيل الدخول)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-6 font-tajawal">
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-10px); }
            40%, 80% { transform: translateX(10px); }
          }
          .animate-shake { animation: shake 0.4s ease-in-out; }
        `}</style>
        <div id="auth-card" className="max-w-md w-full bg-white rounded-[3.5rem] p-12 shadow-2xl border border-pink-100 text-center animate-in fade-in zoom-in duration-500">
           <div className="w-24 h-24 bg-pink-100 rounded-[2.2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-white">
              <Lock className="text-pink-600" size={44} />
           </div>
           <h1 className="text-3xl font-black text-gray-800 mb-3">تفعيل المنجز</h1>
           <p className="text-gray-500 text-sm mb-10 leading-relaxed px-4">يرجى إدخال كود التفعيل للاستمتاع بكافة مميزات التطبيق ومتابعة منجزك الرمضاني.</p>
           
           <form onSubmit={handleActivation} className="space-y-5">
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="أدخل الكود هنا..." 
                  className={`w-full px-8 py-5 rounded-2xl border-2 outline-none transition-all text-center font-bold text-xl shadow-inner ${authError ? 'border-red-300 bg-red-50 text-red-600' : 'border-pink-50 focus:border-pink-400 bg-gray-50 text-gray-700'}`}
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setAuthError(false); }}
                />
                {authError && <div className="absolute -bottom-6 left-0 right-0 text-red-500 text-xs font-bold">الكود غير صحيح، يرجى المحاولة مرة أخرى</div>}
              </div>
              <button 
                type="submit" 
                className="w-full bg-pink-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-pink-200 hover:bg-pink-700 transition transform active:scale-95 flex items-center justify-center gap-3 mt-4"
              >
                <Unlock size={22} /> تفعيل النسخة
              </button>
           </form>
           
           <div className="mt-12 flex items-center justify-center gap-2 text-gray-400 text-xs">
              <ShieldCheck size={14} />
              <span>نسخة محمية ومعتمدة لعام 2025</span>
           </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard data={data} onDaySelect={(d) => { setSelectedDay(d); setCurrentView('day'); }} onWeekSelect={(w) => { setSelectedWeek(w); setCurrentView('weekly'); }} />;
      case 'day': return <DayView entry={data.days[selectedDay - 1]} onUpdate={(updates) => { const newData = { ...data }; newData.days[selectedDay - 1] = { ...newData.days[selectedDay - 1], ...updates }; setData(newData); }} onBack={() => setCurrentView('dashboard')} />;
      case 'weekly': return <ReviewView review={data.weeklyReviews[selectedWeek - 1]} onUpdate={(updates) => { const newData = { ...data }; newData.weeklyReviews[selectedWeek - 1] = { ...newData.weeklyReviews[selectedWeek - 1], ...updates }; setData(newData); }} onBack={() => setCurrentView('dashboard')} />;
      case 'khatma': return <KhatmaView khatma={data.quranKhatma} onToggle={(idx) => { const newKhatma = [...data.quranKhatma]; newKhatma[idx] = !newKhatma[idx]; setData({ ...data, quranKhatma: newKhatma }); }} onBack={() => setCurrentView('dashboard')} />;
      case 'import':
        return (
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-pink-100 animate-fade-in">
             <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-2xl shadow-lg text-white"><FileUp size={32} /></div>
              <div><h2 className="text-2xl font-bold text-gray-800">مزامنة البيانات</h2><p className="text-gray-500 text-sm">استورد جدولك من Notion بضغطة واحدة</p></div>
            </div>
            <textarea className="w-full h-48 border-2 border-pink-50 rounded-3xl p-5 mb-4 shadow-inner" placeholder="الصق النص هنا..." value={importText} onChange={(e) => setImportText(e.target.value)} />
            <button onClick={async () => { setIsImporting(true); try { const res = await convertNotionToAppData(importText); setData(prev => ({...prev, days: res.days})); alert('تم الاستيراد بنجاح!'); } finally { setIsImporting(false); } }} className="bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-pink-200 transition-transform active:scale-95">{isImporting ? 'جاري الاستيراد...' : 'بدء المزامنة'}</button>
          </div>
        );
      case 'settings':
        const ReminderSection = ({ title, keys, icon: Icon }: { title: string, keys: Array<keyof NotificationSettings['reminders']>, icon: any }) => (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2"><Icon size={20} className="text-pink-600" /> {title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keys.map(key => {
                const reminder = data.notifications.reminders[key];
                return (
                  <div key={key} className={`p-6 rounded-[2.5rem] border-2 transition-all space-y-4 ${reminder.enabled ? 'border-pink-100 bg-pink-50/20' : 'border-gray-50 bg-gray-50/30'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Edit3 size={14} className="text-pink-400" />
                        <input type="text" value={reminder.label} onChange={(e) => updateReminderField(key, 'label', e.target.value)} className="bg-transparent border-none font-bold text-gray-700 text-sm focus:ring-0 outline-none w-32" />
                      </div>
                      <button onClick={() => updateReminderField(key, 'enabled', !reminder.enabled)} className={`w-10 h-5 rounded-full p-1 transition-all ${reminder.enabled ? 'bg-pink-600' : 'bg-gray-300'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full transition-all ${reminder.enabled ? 'mr-auto' : 'ml-auto'}`}></div>
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 bg-white/60 p-2.5 rounded-xl border border-gray-100">
                        <Clock size={14} className="text-gray-400" /><input type="time" value={reminder.time} onChange={(e) => updateReminderField(key, 'time', e.target.value)} className="bg-transparent outline-none text-[13px] font-bold text-gray-600 w-full" />
                      </div>
                      <div className="flex items-center gap-2 bg-white/60 p-2.5 rounded-xl border border-gray-100">
                        <MessageSquare size={14} className="text-gray-400" /><input type="text" placeholder="رسالة التنبيه..." value={reminder.message} onChange={(e) => updateReminderField(key, 'message', e.target.value)} className="bg-transparent outline-none text-[11px] text-gray-500 w-full" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
        return (
          <div className="space-y-10 pb-10 animate-fade-in">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-indigo-100 overflow-hidden relative">
               <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 relative z-10"><Globe className="text-indigo-600" /> مواقيت صلاة رمضان</h2>
               <div className="flex flex-col md:flex-row gap-4 relative z-10">
                  <div className="flex-1 relative"><MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="أدخل اسم المدينة..." className="w-full pr-12 pl-4 py-4 rounded-2xl border-2 border-indigo-50 focus:border-indigo-500 outline-none transition bg-white" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} /></div>
                  <button onClick={handleFetchPrayerTimes} disabled={isFetchingPrayers || !locationInput} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50">{isFetchingPrayers ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}تحديث المواقيت</button>
               </div>
            </div>
            <div className={`p-1 rounded-[3.2rem] transition-all duration-700 ${data.notifications.masterEnabled ? 'bg-gradient-to-r from-pink-500 to-rose-400 shadow-2xl shadow-pink-100' : 'bg-gray-100'}`}>
              <div className="bg-white p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-right">
                  <h3 className="text-xl font-black text-gray-800 mb-2 flex items-center gap-2 justify-center md:justify-start">
                    <div className="relative"><Bell className={data.notifications.masterEnabled ? "text-pink-600" : "text-gray-400"} />{data.notifications.masterEnabled && <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>}</div>حالة التنبيهات العامة</h3>
                  <p className="text-sm text-gray-500">فعل الإشعارات لتصلك تنبيهات المهام والصلوات حية.</p>
                </div>
                <button onClick={toggleMasterNotifications} className={`group relative px-12 py-5 rounded-[2.2rem] font-black transition-all duration-500 shadow-xl overflow-hidden active:scale-95 ${data.notifications.masterEnabled ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white scale-105' : 'bg-white text-gray-400 border-2 border-dashed border-gray-200 hover:border-pink-300'}`}>
                  <div className="flex items-center gap-3 relative z-10">{data.notifications.masterEnabled ? <><div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></div><span>مفعلة ونشطة</span></> : <><BellOff size={20} /><span>معطلة - اضغط للتفعيل</span></>}</div>
                </button>
              </div>
            </div>
            <ReminderSection title="تذكيرات الصلوات" icon={Moon} keys={['prayerFajr', 'prayerDhuhr', 'prayerAsr', 'prayerMaghrib', 'prayerIsha']} />
            <ReminderSection title="تذكيرات المهام والورد" icon={Sparkles} keys={['frogTask', 'morningDhikr', 'eveningDhikr', 'quran']} />
            
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-pink-100">
               <h2 className="text-2xl font-bold mb-8 flex items-center gap-3"><Palette className="text-pink-600" /> مظهر التطبيق</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(['rose', 'emerald', 'indigo', 'amber'] as AppTheme[]).map(t => (
                    <button 
                      key={t} 
                      onClick={() => setData(prev => ({...prev, theme: t}))} 
                      className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 active:scale-95 ${data.theme === t ? 'border-pink-500 bg-pink-50/30' : 'border-gray-100 hover:border-pink-200'}`}
                    >
                      <div className="w-12 h-12 rounded-full shadow-lg border-4 border-white" style={{ background: THEMES[t].gradient }}></div>
                      <span className="text-sm font-bold">{t === 'rose' ? 'وردي' : t === 'emerald' ? 'أخضر' : t === 'indigo' ? 'أزرق' : 'ذهبي'}</span>
                    </button>
                  ))}
               </div>
            </div>
          </div>
        );
      default: return <Dashboard data={data} onDaySelect={(d) => { setSelectedDay(d); setCurrentView('day'); }} onWeekSelect={(w) => { setSelectedWeek(w); setCurrentView('weekly'); }} />;
    }
  };

  const themeColors = THEMES[data.theme || 'rose'];
  
  return (
    <div className="min-h-screen flex transition-colors duration-500 overflow-hidden font-tajawal">
      {/* محرك الألوان الذكي لإصلاح مشكلة تغير الألوان في كامل المكونات */}
      <style>{`
        :root {
          --theme-primary: ${themeColors.primary};
          --theme-secondary: ${themeColors.secondary};
          --theme-bg: ${themeColors.bgLight};
        }
        body { background-color: var(--theme-bg) !important; transition: background-color 0.5s ease; }
        
        /* تحويل كافة درجات الـ Pink و Rose إلى اللون المختار ديناميكياً */
        .text-pink-600, .text-pink-500, .text-pink-700, .text-rose-500, .text-rose-600 { color: var(--theme-primary) !important; }
        .text-pink-400, .text-pink-300 { color: var(--theme-primary) !important; opacity: 0.8; }
        
        .bg-pink-600, .bg-pink-500, .bg-rose-500, .bg-rose-600 { background-color: var(--theme-primary) !important; }
        .bg-pink-50, .bg-pink-100 { background-color: var(--theme-secondary) !important; }
        
        .border-pink-100, .border-pink-200, .border-pink-50 { border-color: var(--theme-secondary) !important; }
        .border-pink-500, .border-pink-600 { border-color: var(--theme-primary) !important; }
        
        .shadow-pink-100, .shadow-pink-200 { --tw-shadow-color: var(--theme-primary)33 !important; shadow-color: var(--theme-primary); }
        .shadow-xl.shadow-pink-200, .shadow-xl.shadow-pink-100\\/20 { box-shadow: 0 20px 25px -5px var(--theme-primary)44, 0 8px 10px -6px var(--theme-primary)44 !important; }
        
        .from-pink-600, .from-pink-500 { --tw-gradient-from: var(--theme-primary) !important; --tw-gradient-to: rgb(0 0 0 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
        .to-rose-500, .to-rose-600, .to-rose-400 { --tw-gradient-to: var(--theme-primary) !important; opacity: 0.9; }
        
        .fill-pink-600, .fill-pink-500 { fill: var(--theme-primary) !important; }
        .ring-pink-100 { --tw-ring-color: var(--theme-secondary) !important; }
        
        /* تلوين أزرار اليوم الحالي والتقويم */
        .bg-pink-600.border-pink-600 { background-color: var(--theme-primary) !important; border-color: var(--theme-primary) !important; }
        .hover\\:bg-pink-50:hover { background-color: var(--theme-secondary) !important; }
        .hover\\:border-pink-300:hover { border-color: var(--theme-primary) !important; opacity: 0.5; }
        .group:hover .text-pink-400 { color: var(--theme-primary) !important; }
      `}</style>
      
      <Sidebar activeView={currentView} setActiveView={setCurrentView} currentDay={data.currentDay} khatma={data.quranKhatma} />
      <main className="flex-1 p-8 overflow-y-auto"><div className="max-w-6xl mx-auto">{renderContent()}</div></main>
    </div>
  );
};

export default App;
