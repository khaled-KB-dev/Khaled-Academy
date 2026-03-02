exports.handler = async (event) => {
    try {
        const { prompt } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        // الرابط المعتمد للنسخ المستقرة
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: "تنبيه من جوجل: " + data.error.message })
            };
        }

        // استخراج النص بمرونة أكبر
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