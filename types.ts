
export type View = 'dashboard' | 'day' | 'weekly' | 'import' | 'settings' | 'khatma';

export type AppTheme = 'rose' | 'emerald' | 'indigo' | 'amber';

export interface Task {
  id: string;
  description: string;
  isCompleted: boolean;
  time?: string;
}

export interface QuranProgress {
  goal: number;
  completed: number;
}

export interface SpiritualHabits {
  morningDhikr: boolean;
  eveningDhikr: boolean;
  duaBeforeIftar: boolean;
}

export interface Prayers {
  obligatory: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  sunnan: {
    fajr_pre: boolean;
    dhuhr_pre: boolean;
    dhuhr_post: boolean;
    maghrib_post: boolean;
    isha_post: boolean;
  };
  night: {
    taraweeh: boolean;
    tahajjud: boolean;
  };
}

export interface DayReflection {
  verse: string;
  idea: string;
  gratitude: string;
  feeling: 'excellent' | 'normal' | 'needs-improvement';
  tomorrowDifferent: string;
}

export interface DayEntry {
  dayNumber: number;
  ramadanDate: string;
  frogTask: Task;
  otherTasks: Task[];
  spiritualHabits: SpiritualHabits;
  prayers: Prayers;
  quranProgress: QuranProgress;
  reflection: DayReflection;
  isLocked: boolean;
}

export interface WeeklyReview {
  weekNumber: number;
  mostAchieved: string;
  mostTiring: string;
  reduceNextWeek: string;
  blessingToThank: string;
}

export interface ReminderConfig {
  enabled: boolean;
  time: string;
  label: string;
  message: string;
}

export interface NotificationSettings {
  masterEnabled: boolean;
  reminders: {
    // General Task Reminders
    frogTask: ReminderConfig;
    morningDhikr: ReminderConfig;
    eveningDhikr: ReminderConfig;
    quran: ReminderConfig;
    // Prayer Reminders
    prayerFajr: ReminderConfig;
    prayerDhuhr: ReminderConfig;
    prayerAsr: ReminderConfig;
    prayerMaghrib: ReminderConfig;
    prayerIsha: ReminderConfig;
  };
}

export interface AppData {
  days: DayEntry[];
  weeklyReviews: WeeklyReview[];
  currentDay: number;
  quranKhatma: boolean[]; // 30 parts
  theme: AppTheme;
  notifications: NotificationSettings;
}
