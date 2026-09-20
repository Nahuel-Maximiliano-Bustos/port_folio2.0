import { db } from '../db/client.js';

export const trackVisit = async (req, res) => {
    try {
        const { path } = req.body;
        const user_agent = req.headers['user-agent'] || 'unknown';
        const ip_address = req.ip || req.headers['x-forwarded-for'] || 'unknown';

        await db.execute({
            sql: `INSERT INTO page_views (path, user_agent, ip_address) VALUES (?, ?, ?)`,
            args: [path || '/', user_agent, ip_address]
        });

        res.status(200).json({ success: true });
    } catch (error) {
        // Silently fail for metrics to not disrupt user experience
        console.error('Error tracking visit:', error);
        res.status(500).json({ success: false });
    }
};

export const getMetrics = async (req, res) => {
    try {
        const result = await db.execute(`
            SELECT 
                DATE(visited_at) as date,
                COUNT(*) as visits
            FROM page_views
            GROUP BY DATE(visited_at)
            ORDER BY date DESC
            LIMIT 30
        `);
        
        const totalVisits = await db.execute('SELECT COUNT(*) as count FROM page_views');
        
        res.json({
            history: result.rows,
            totalVisits: totalVisits.rows[0].count
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
