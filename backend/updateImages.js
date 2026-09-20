import { createClient } from '@libsql/client';
import fs from 'fs';

const dbUrl = 'file:./local.db';

const db = createClient({
    url: dbUrl
});

async function updateImages() {
    console.log('Updating images for all projects using WP mshots...');

    try {
        const result = await db.execute('SELECT id, live_url FROM projects');
        
        for (const row of result.rows) {
            if (row.live_url) {
                // Using mshots from wordpress
                const imageUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(row.live_url)}?w=1200`;
                
                await db.execute({
                    sql: 'UPDATE projects SET image_url = ? WHERE id = ?',
                    args: [imageUrl, row.id]
                });
                
                console.log(`Updated ID ${row.id} with screenshot URL: ${imageUrl}`);
            }
        }
        
        console.log('All images updated successfully!');
    } catch (e) {
        console.error('Migration failed:', e);
    }
    
    process.exit(0);
}

updateImages();
