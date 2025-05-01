export default async function handler(req, res) {
    const url = `https://lamtiarsigiro.goatcounter.com/counter/${encodeURIComponent(req.query.path)}.json`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching page views" });
    }
}
