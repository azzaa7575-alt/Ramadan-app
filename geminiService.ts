
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSpiritualInsight = async (day: number, feeling: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك مرشدًا روحياً إيجابياً، قدم نصيحة قصيرة ومشجعة لشخص في اليوم ${day} من رمضان يشعر بـ "${feeling}". اجعل الرسالة مريحة، مقتبسة من روح الصيام والتقوى، في جملة أو جملتين باللغة العربية. تجنب تماماً استخدام عبارات النداء مثل "يا بطل".`,
    });
    return response.text;
  } catch (error) {
    return "بارك الله في وقتك وجهدك. استمر في السعي نحو الأفضل!";
  }
};

export const planFrogTask = async (taskDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `المهمة الرئيسية لليوم هي: "${taskDescription}". قدم 3 خطوات عملية ومباشرة جداً للبدء فوراً وتجاوز التسويف بأسلوب إداري محفز ومهذب. لا تستخدم كلمة "يا بطل".`,
    });
    return response.text;
  } catch (error) {
    return "ابدأ بالخطوة الأولى فوراً، استعن بالله، ولا تشتت نفسك.";
  }
};

/**
 * استخدام ميزة البحث من جوجل لجلب مواقيت الصلاة بدقة
 */
export const fetchPrayerTimesFromSearch = async (location: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `أعطني مواقيت الصلاة الدقيقة لليوم في مدينة ${location} لشهر رمضان الحالي بتنسيق JSON حصراً.
      يجب أن يكون الرد كالتالي:
      {
        "fajr": "HH:mm",
        "dhuhr": "HH:mm",
        "asr": "HH:mm",
        "maghrib": "HH:mm",
        "isha": "HH:mm"
      }
      تأكد أن الوقت بتنسيق 24 ساعة ومحدث حسب السنة الحالية.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const prayerData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    
    // استخراج مصادر المعلومات لعرضها (Web Grounding)
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'مصدر خارجي',
      uri: chunk.web?.uri
    })) || [];

    return { prayerData, sources };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    throw error;
  }
};

export const convertNotionToAppData = async (sourceText: string, imageData?: string) => {
  try {
    const parts: any[] = [
      { text: `قم بتحليل محتوى جدول Notion المسمى "Ramadan Summary" لاستخراج الخطة الرمضانية.
      المطلوب: استخراج رقم اليوم، مهمة الضفدع، المهام الأخرى، وأهداف القرآن.
      النص: ${sourceText || "حلل الصورة المرفقة"}` }
    ];
    
    if (imageData) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData.split(',')[1] || imageData
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  frogTaskDescription: { type: Type.STRING },
                  otherTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  quranGoal: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Conversion Error:", error);
    throw error;
  }
};
