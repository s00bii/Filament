import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    console.log("Incoming request:", req.method);

    if (req.method === 'GET') {
        try {
            const rolls = await kv.get('rolls');  // Attempt to get rolls from KV

            if (!rolls) {
                console.warn("No rolls found in Vercel KV, returning empty array.");
                return res.status(200).json([]); // Return empty array instead of failing
            }

            console.log("Fetched rolls:", rolls);
            return res.status(200).json(rolls);
        } catch (error) {
            console.error("Error retrieving rolls from KV:", error);
            return res.status(500).json({ error: "Failed to retrieve rolls" });
        }
    }

    if (req.method === 'POST') {
        try {
            const { rolls } = req.body;
            console.log("Saving rolls to KV:", rolls);
            await kv.set('rolls', rolls);
            return res.status(200).json({ message: "Rolls saved successfully!" });
        } catch (error) {
            console.error("Error saving rolls:", error);
            return res.status(500).json({ error: "Failed to save rolls" });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.body;
            let rolls = await kv.get('rolls') || [];
            rolls = rolls.filter(roll => roll.id !== id);
            await kv.set('rolls', rolls);
            console.log("Deleted roll ID:", id);
            return res.status(200).json({ message: "Roll deleted successfully!" });
        } catch (error) {
            console.error("Error deleting roll:", error);
            return res.status(500).json({ error: "Failed to delete roll" });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
