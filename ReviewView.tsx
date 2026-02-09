
import React from 'react';
import { WeeklyReview } from './types';
import { ArrowRight, MessageCircle, Heart, Zap, Coffee } from 'lucide-react';

interface ReviewViewProps {
  review: WeeklyReview;
  onUpdate: (updates: Partial<WeeklyReview>) => void;
  onBack: () => void;
}

const ReviewView: React.FC<ReviewViewProps> = ({ review, onUpdate, onBack }) => {
  const Field = ({ label, icon: Icon, value, field, placeholder }: { label: string, icon: any, value: string, field: keyof WeeklyReview, placeholder: string }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-pink-500" />
        <h4 className="font-bold text-gray-700">{label}</h4>
      </div>
      <textarea 
        className="w-full border border-pink-50 rounded-2xl p-4 text-sm focus:ring-2 ring-pink-100 outline-none min-h-[100px]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onUpdate({ [field]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-gray-400 hover:text-pink-600 flex items-center gap-1">
          <ArrowRight size={20} />
          <span>العودة</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">مراجعة الأسبوع {review.weekNumber}</h2>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-pink-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field 
          label="أكثر شيء أنجزته هذا الأسبوع:" 
          icon={Zap} 
          value={review.mostAchieved} 
          field="mostAchieved"
          placeholder="..."
        />
        <Field 
          label="أكثر شيء أرهقني:" 
          icon={Coffee} 
          value={review.mostTiring} 
          field="mostTiring"
          placeholder="..."
        />
        <Field 
          label="ما الذي أريد تخفيفه الأسبوع القادم؟" 
          icon={MessageCircle} 
          value={review.reduceNextWeek} 
          field="reduceNextWeek"
          placeholder="..."
        />
        <Field 
          label="نعمة أشكر الله عليها:" 
          icon={Heart} 
          value={review.blessingToThank} 
          field="blessingToThank"
          placeholder="..."
        />
      </div>

      <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
        <p className="text-emerald-700 font-medium italic">
          "هذا الجدول لمساعدتك على الاستمرار، وليس للمثالية.. استعن بالله ولا تعجز"
        </p>
      </div>
    </div>
  );
};

export default ReviewView;
