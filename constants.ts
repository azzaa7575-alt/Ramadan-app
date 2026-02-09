
import { AppData, DayEntry, AppTheme } from './types';

export const INITIAL_DAY_ENTRY = (n: number): DayEntry => ({
  dayNumber: n,
  ramadanDate: `رمضان ${n}`,
  frogTask: { id: `frog-${n}`, description: '', isCompleted: false, time: 'بعد الفجر' },
  otherTasks: [
    { id: `task-2-${n}`, description: '', isCompleted: false },
    { id: `task-3-${n}`, description: '', isCompleted: false },
  ],
  spiritualHabits: {
    morningDhikr: false,
    eveningDhikr: false,
    duaBeforeIftar: false,
  },
  prayers: {
    obligatory: {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    },
    sunnan: {
      fajr_pre: false,
      dhuhr_pre: false,
      dhuhr_post: false,
      maghrib_post: false,
      isha_post: false,
    },
    night: {
      taraweeh: false,
      tahajjud: false,
    },
  },
  quranProgress: { goal: 20, completed: 0 },
  reflection: {
    verse: '',
    idea: '',
    gratitude: '',
    feeling: 'normal',
    tomorrowDifferent: '',
  },
  isLocked: false,
});

export const INITIAL_APP_DATA: AppData = {
  days: Array.from({ length: 30 }, (_, i) => INITIAL_DAY_ENTRY(i + 1)),
  weeklyReviews: Array.from({ length: 4 }, (_, i) => ({
    weekNumber: i + 1,
    mostAchieved: '',
    mostTiring: '',
    reduceNextWeek: '',
    blessingToThank: '',
  })),
  currentDay: 1,
  quranKhatma: new Array(30).fill(false),
  theme: 'rose',
  notifications: {
    masterEnabled: false,
    reminders: {
      frogTask: { enabled: true, time: '09:00', label: 'مهمة الضفدع', message: 'حان وقت إنجاز المهمة الأهم اليوم!' },
      morningDhikr: { enabled: true, time: '06:00', label: 'أذكار الصباح', message: 'لا تنسَ أذكار الصباح لتبدأ يومك ببركة.' },
      eveningDhikr: { enabled: true, time: '17:30', label: 'أذكار المساء', message: 'حان وقت أذكار المساء والدعاء قبل الإفطار.' },
      quran: { enabled: true, time: '14:00', label: 'ورد القرآن', message: 'خصص وقتاً الآن لوردك القرآني.' },
      prayerFajr: { enabled: false, time: '04:30', label: 'صلاة الفجر', message: 'الصلاة خير من النوم.. حان وقت صلاة الفجر.' },
      prayerDhuhr: { enabled: false, time: '12:15', label: 'صلاة الظهر', message: 'حان وقت صلاة الظهر.. جدد طاقتك بالوقوف بين يدي الله.' },
      prayerAsr: { enabled: false, time: '15:45', label: 'صلاة العصر', message: 'حافظوا على الصلوات والصلاة الوسطى.. حان وقت العصر.' },
      prayerMaghrib: { enabled: false, time: '18:15', label: 'صلاة المغرب', message: 'إفطاراً شهياً.. حان وقت صلاة المغرب.' },
      prayerIsha: { enabled: false, time: '19:45', label: 'صلاة العشاء', message: 'حان وقت صلاة العشاء وصلاة التراويح.' },
    }
  }
};

export interface ThemeColors {
  primary: string;
  secondary: string;
  bgLight: string;
  gradient: string;
}

export const THEMES: Record<AppTheme, ThemeColors> = {
  rose: {
    primary: '#db2777', // pink-600
    secondary: '#fdf2f8', // pink-50
    bgLight: '#fdf2f8',
    gradient: 'linear-gradient(to right, #db2777, #f43f5e)',
  },
  emerald: {
    primary: '#059669', // emerald-600
    secondary: '#ecfdf5', // emerald-50
    bgLight: '#f0fdf4',
    gradient: 'linear-gradient(to right, #059669, #10b981)',
  },
  indigo: {
    primary: '#4f46e5', // indigo-600
    secondary: '#eef2ff', // indigo-50
    bgLight: '#f5f7ff',
    gradient: 'linear-gradient(to right, #4f46e5, #6366f1)',
  },
  amber: {
    primary: '#d97706', // amber-600
    secondary: '#fffbeb', // amber-50
    bgLight: '#fffcf0',
    gradient: 'linear-gradient(to right, #d97706, #f59e0b)',
  }
};
