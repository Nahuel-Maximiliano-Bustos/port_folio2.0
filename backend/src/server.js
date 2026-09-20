import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import webpush from 'web-push';
import { initDB } from './db/client.js';

// Routes imports will go here
import authRoutes from './routes/auth.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import pushRoutes from './routes/push.routes.js';
import metricsRoutes from './routes/metrics.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import cmsRoutes from './routes/cms.routes.js';

dotenv.config();

// Setup web-push
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:admin@admin.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // En producción, cambiar por la URL del frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

app.use(cors());
app.use(express.json());

// Socket.io connection
io.on('connection', (socket) => {
    console.log('Admin connected via WebSocket:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Admin disconnected:', socket.id);
    });
});

// Middleware to inject io into req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/cms', cmsRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;

initDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
