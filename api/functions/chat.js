export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "طريقة الطلب غير مسموحة" });
    }

    try {
        const { prompt } = JSON.parse(req.body);
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ reply: "جوجل تقول: " + data.error.message });
        }

        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم أستطع الحصول على رد.";
        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        return res.status(500).json({ reply: "خطأ في السيرفر: " + error.message });
    }
}