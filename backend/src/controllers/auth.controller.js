import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/client.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await db.execute({
            sql: 'SELECT * FROM admin_users WHERE email = ?',
            args: [email]
        });

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production',
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const verifySession = async (req, res) => {
    // If the request makes it past the auth middleware, the session is valid
    res.json({ valid: true, user: req.user });
};
