exports.handler = async (event) => {
    try {
        const { prompt } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        // استخدمنا fetch المدمجة مباشرة ليتجاوز الخطأ
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // إظهار سبب الخطأ إذا كان من جوجل
        if (data.error) {
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: "جوجل تقول: " + data.error.message })
            };
        }

        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم أستطع الحصول على نص.";

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: aiReply })
        };

    } catch (error) {
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: "خطأ في الاتصال: " + error.message })
        };
    }
};