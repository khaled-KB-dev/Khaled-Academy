export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: "Method Not Allowed" });

    try {
        const { prompt } = JSON.parse(req.body);
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(200).json({ reply: "جوجل ترفض المفتاح: " + data.error.message });
        }

        return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });

    } catch (error) {
        return res.status(200).json({ reply: "السيرفر يقول: " + error.message });
    }
}