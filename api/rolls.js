import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Retrieve rolls from Vercel KV
        const rolls = await kv.get('rolls') || [];
        return res.status(200).json(rolls);
    }

    if (req.method === 'POST') {
        const { rolls } = req.body;
        await kv.set('rolls', rolls);
        return res.status(200).json({ message: "Rolls saved successfully!" });
    }

    if (req.method === 'DELETE') {
        const { id } = req.body;
        let rolls = await kv.get('rolls') || [];
        rolls = rolls.filter(roll => roll.id !== id);
        await kv.set('rolls', rolls);
        return res.status(200).json({ message: "Roll deleted successfully!" });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
