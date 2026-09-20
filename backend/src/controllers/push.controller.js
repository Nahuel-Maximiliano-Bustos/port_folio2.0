import webpush from 'web-push';
import { db } from '../db/client.js';

export const subscribe = async (req, res) => {
    const subscription = req.body;
    
    if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Invalid subscription' });
    }

    try {
        await db.execute({
            sql: `INSERT INTO push_subscriptions (endpoint, p256dh, auth) VALUES (?, ?, ?)
                  ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth`,
            args: [subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth]
        });
        
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Error saving push subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getVapidPublicKey = (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};
