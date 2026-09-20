import { db } from '../db/client.js';

export const getSettings = async (req, res) => {
    try {
        const result = await db.execute('SELECT setting_key, setting_value FROM admin_settings');
        const settings = {};
        result.rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;
        
        await db.execute({
            sql: `INSERT INTO admin_settings (setting_key, setting_value) VALUES (?, ?)
                  ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP`,
            args: [key, value]
        });
        
        res.json({ success: true, key, value });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
