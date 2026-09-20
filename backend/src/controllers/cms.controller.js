import { db } from '../db/client.js';

// ---- SECTION VISIBILITY ----
export const getSections = async (req, res) => {
    try {
        const result = await db.execute('SELECT section_key, is_active FROM portfolio_content');
        const sections = {};
        result.rows.forEach(row => {
            sections[row.section_key] = row.is_active === 1;
        });
        res.json(sections);
    } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPublicContent = async (req, res) => {
    try {
        const result = await db.execute('SELECT section_key, content_json, is_active FROM portfolio_content');
        const content = {};
        result.rows.forEach(row => {
            content[row.section_key] = {
                data: JSON.parse(row.content_json),
                is_active: row.is_active === 1
            };
        });
        res.json(content);
    } catch (error) {
        console.error('Error fetching public content:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateContentSection = async (req, res) => {
    try {
        const { section_key } = req.params;
        const { content_json } = req.body; // Expects stringified JSON or object

        const jsonString = typeof content_json === 'object' ? JSON.stringify(content_json) : content_json;

        await db.execute({
            sql: `UPDATE portfolio_content SET content_json = ?, updated_at = CURRENT_TIMESTAMP WHERE section_key = ?`,
            args: [jsonString, section_key]
        });

        res.json({ success: true, section_key });
    } catch (error) {
        console.error('Error updating content section:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const toggleSection = async (req, res) => {
    try {
        const { section_key, is_active } = req.body;
        
        await db.execute({
            sql: `INSERT INTO portfolio_content (section_key, content_json, is_active) VALUES (?, '{}', ?)
                  ON CONFLICT(section_key) DO UPDATE SET is_active = excluded.is_active, updated_at = CURRENT_TIMESTAMP`,
            args: [section_key, is_active ? 1 : 0]
        });
        
        res.json({ success: true, section_key, is_active });
    } catch (error) {
        console.error('Error toggling section:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ---- PROJECTS ----
export const getProjects = async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM projects ORDER BY order_index ASC, created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createProject = async (req, res) => {
    try {
        const { title, description, tags, repo_url, live_url, image_url, order_index, is_active } = req.body;
        
        const result = await db.execute({
            sql: `INSERT INTO projects (title, description, tags, repo_url, live_url, image_url, order_index, is_active) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
            args: [
                title || null, 
                description || null, 
                tags || null, 
                repo_url || null, 
                live_url || null, 
                image_url || null, 
                order_index || 0, 
                is_active === false ? 0 : 1
            ]
        });
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tags, repo_url, live_url, image_url, order_index, is_active } = req.body;
        
        let updates = [];
        let args = [];
        
        if (title !== undefined) { updates.push('title = ?'); args.push(title || null); }
        if (description !== undefined) { updates.push('description = ?'); args.push(description || null); }
        if (tags !== undefined) { updates.push('tags = ?'); args.push(tags || null); }
        if (repo_url !== undefined) { updates.push('repo_url = ?'); args.push(repo_url || null); }
        if (live_url !== undefined) { updates.push('live_url = ?'); args.push(live_url || null); }
        if (image_url !== undefined) { updates.push('image_url = ?'); args.push(image_url || null); }
        if (order_index !== undefined) { updates.push('order_index = ?'); args.push(order_index || 0); }
        if (is_active !== undefined) { updates.push('is_active = ?'); args.push(is_active ? 1 : 0); }

        if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
        
        args.push(id);
        const result = await db.execute({
            sql: `UPDATE projects SET ${updates.join(', ')} WHERE id = ? RETURNING *`,
            args
        });
        
        if (result.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [id] });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
