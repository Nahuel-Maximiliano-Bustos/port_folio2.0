import bcrypt from 'bcrypt';
import { db, initDB } from './src/db/client.js';

const seed = async () => {
    await initDB();
    
    const email = 'admin@admin.com';
    const password = 'password123';
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.execute({
            sql: `INSERT INTO admin_users (email, password_hash) VALUES (?, ?)`,
            args: [email, hashedPassword]
        });
        
        console.log(`Admin user created: ${email} / ${password}`);
    } catch (e) {
        if (e.message.includes('UNIQUE constraint failed')) {
            console.log('Admin user already exists.');
        } else {
            console.error('Error seeding database:', e);
        }
    }
    
    process.exit(0);
};

seed();
