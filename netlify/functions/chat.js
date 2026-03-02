const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        const { prompt } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        // محاولة الاتصال بجوجل
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // هنا السر: إذا جوجل رفضت، سنعرف السبب
        if (data.error) {
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: "خطأ تقني من جوجل: " + data.error.message })
            };
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: data.candidates[0].content.parts[0].text })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: "جوجل أرسلت رداً فارغاً. جرب مفتاحاً آخر." })
        };

    } catch (error) {
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: "خطأ في السيرفر الداخلي: " + error.message })
        };
    }
};