import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const dbUrl = process.env.TURSO_DATABASE_URL || 'file:./local.db';
const dbAuthToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
    url: dbUrl,
    authToken: dbAuthToken
});

async function migrate() {
    console.log('Starting database migration...');

    try {
        // 1. Add new columns to leads if they don't exist
        const columnsToAdd = [
            { name: 'is_starred', type: 'INTEGER DEFAULT 0' },
            { name: 'is_archived', type: 'INTEGER DEFAULT 0' },
            { name: 'is_deleted', type: 'INTEGER DEFAULT 0' },
            { name: 'category', type: 'TEXT DEFAULT "Inbox"' }
        ];

        for (const col of columnsToAdd) {
            try {
                await db.execute(`ALTER TABLE leads ADD COLUMN ${col.name} ${col.type}`);
                console.log(`Added column ${col.name} to leads.`);
            } catch (err) {
                if (err.message.includes('duplicate column name')) {
                    console.log(`Column ${col.name} already exists in leads.`);
                } else {
                    console.error(`Error adding column ${col.name}:`, err.message);
                }
            }
        }

        // Add is_active to portfolio_content
        try {
            await db.execute(`ALTER TABLE portfolio_content ADD COLUMN is_active INTEGER DEFAULT 1`);
            console.log(`Added column is_active to portfolio_content.`);
        } catch (err) {
            if (err.message.includes('duplicate column name') || err.message.includes('no such table')) {
                console.log(`Column is_active already exists or table doesn't exist yet.`);
            } else {
                console.error(`Error adding column is_active:`, err.message);
            }
        }

        // Add is_active to projects
        try {
            await db.execute(`ALTER TABLE projects ADD COLUMN is_active INTEGER DEFAULT 1`);
            console.log(`Added column is_active to projects.`);
        } catch (err) {
            if (err.message.includes('duplicate column name') || err.message.includes('no such table')) {
                console.log(`Column is_active already exists or table doesn't exist yet.`);
            } else {
                console.error(`Error adding column is_active:`, err.message);
            }
        }

        // 2. Run the full schema.sql to create new tables
        const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        const statements = schema.split(';').filter(stmt => stmt.trim() !== '');
        
        for (let stmt of statements) {
            await db.execute(stmt);
        }
        console.log('Schema updated successfully. New tables created.');

        console.log('Migration completed successfully!');
    } catch (e) {
        console.error('Migration failed:', e);
    }
    
    process.exit(0);
}

migrate();
