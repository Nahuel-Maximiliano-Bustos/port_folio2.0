import { db } from '../db/client.js';
import webpush from 'web-push';

export const submitLead = async (req, res) => {
    try {
        const { full_name, email, phone, subject, message } = req.body;

        if (!full_name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await db.execute({
            sql: `INSERT INTO leads (full_name, email, phone, subject, message) 
                  VALUES (?, ?, ?, ?, ?) RETURNING *`,
            args: [full_name, email, phone || null, subject || null, message]
        });

        const newLead = result.rows[0];

        // Emit real-time notification to admin panel via Socket.io
        if (req.io) {
            req.io.emit('new_lead', newLead);
        }

        // Send Web Push Notification to all subscriptions
        try {
            const subsResult = await db.execute('SELECT * FROM push_subscriptions');
            const payload = JSON.stringify({
                title: '¡Nuevo Lead Recibido!',
                body: `${full_name} te ha enviado un mensaje.`,
                url: '/admin'
            });

            const promises = subsResult.rows.map(sub => {
                const pushSubscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth
                    }
                };
                return webpush.sendNotification(pushSubscription, payload).catch(err => {
                    console.error('Error sending push to endpoint', sub.endpoint, err);
                    if (err.statusCode === 410) {
                        // Gone - remove subscription
                        db.execute({
                            sql: 'DELETE FROM push_subscriptions WHERE endpoint = ?',
                            args: [sub.endpoint]
                        });
                    }
                });
            });

            await Promise.all(promises);
        } catch (pushErr) {
            console.error('Error during push notification broadcast:', pushErr);
        }

        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error submitting lead:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getLeads = async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM leads ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, priority, is_starred, is_archived, is_deleted, category } = req.body;
        
        let updates = [];
        let args = [];
        
        if (status !== undefined) { updates.push('status = ?'); args.push(status); }
        if (priority !== undefined) { updates.push('priority = ?'); args.push(priority); }
        if (is_starred !== undefined) { updates.push('is_starred = ?'); args.push(is_starred ? 1 : 0); }
        if (is_archived !== undefined) { updates.push('is_archived = ?'); args.push(is_archived ? 1 : 0); }
        if (is_deleted !== undefined) { updates.push('is_deleted = ?'); args.push(is_deleted ? 1 : 0); }
        if (category !== undefined) { updates.push('category = ?'); args.push(category); }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        args.push(id);
        const sql = `UPDATE leads SET ${updates.join(', ')} WHERE id = ? RETURNING *`;
        
        const result = await db.execute({ sql, args });
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating lead:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const emptyTrash = async (req, res) => {
    try {
        await db.execute('DELETE FROM leads WHERE is_deleted = 1');
        res.json({ success: true, message: 'Trash emptied successfully' });
    } catch (error) {
        console.error('Error emptying trash:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
