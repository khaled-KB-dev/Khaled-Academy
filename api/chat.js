export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { prompt } = JSON.parse(req.body);
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        
        // إذا كان هناك مشكلة في الـ API Key سيعطيك تفصيل هنا
        if (data.error) {
            return res.status(200).json({ reply: "خطأ من جوجل: " + data.error.message });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم أستلم رداً.";
        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(200).json({ reply: "السيرفر واجه مشكلة: " + error.message });
    }
}