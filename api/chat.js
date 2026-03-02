export default async function handler(req, res) {
    try {
        const { prompt } = JSON.parse(req.body);
        const apiKey = process.env.GEMINI_API_KEY;

        // إذا كان المفتاح ناقص، السيرفر يعلمنا فوراً
        if (!apiKey) {
            return res.status(200).json({ reply: "خطأ: مفتاح API غير موجود في إعدادات Vercel" });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ reply: "خطأ من جوجل: " + data.error.message });
        }

        return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });

    } catch (error) {
        // هذا السطر سيخبرنا بالخطأ الحقيقي في الشاشة
        return res.status(200).json({ reply: "حدث خطأ تقني: " + error.message });
    }
}