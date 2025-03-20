import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    console.log("Incoming request:", req.method);

    if (req.method === 'POST') {
        try {
            const { rolls } = req.body;
            
            if (!rolls || !Array.isArray(rolls)) {
                throw new Error("Invalid data format: rolls must be an array.");
            }

            console.log("Saving rolls to KV:", JSON.stringify(rolls, null, 2));

            await kv.set('rolls', rolls);  // Storing rolls in KV
            console.log("Rolls successfully saved to KV.");
            
            return res.status(200).json({ message: "Rolls saved successfully!" });

        } catch (error) {
            console.error("Error saving rolls to KV:", error);
            return res.status(500).json({ error: error.message || "Failed to save rolls" });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
