import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: 1, email: 'admin@admin.com' }, process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production', { expiresIn: '1d' });

async function test() {
    console.log("Testing POST /api/cms/projects");
    try {
        const res = await fetch('http://localhost:3001/api/cms/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                title: 'Test Create Project',
                description: 'Test Desc',
                is_active: 1
            })
        });
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Body:", text);
    } catch(e) {
        console.log(e);
    }
}

test();
