exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // استخراج النص الصافي من رد Gemini
        let aiReply = "عذراً، لم أستطع فهم الإجابة.";
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            aiReply = data.candidates[0].content.parts[0].text;
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply: aiReply }) // إرسال النص الصافي فقط
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ reply: "فشل الاتصال: " + error.message })
        };
    }
};