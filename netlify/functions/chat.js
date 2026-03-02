exports.handler = async (event) => {
    try {
        const { prompt } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        // الرابط الرسمي المستقر v1 مع تحديد الموديل بدقة
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // فحص الأخطاء بدقة
        if (data.error) {
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: "تنبيه من جوجل: " + data.error.message })
            };
        }

        // استخراج النص
        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم أستطع الحصول على رد، جرب مرة أخرى.";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply: aiReply })
        };

    } catch (error) {
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: "خطأ في السيرفر: " + error.message })
        };
    }
};