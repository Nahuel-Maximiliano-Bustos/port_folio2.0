import { createClient } from '@libsql/client';

const db = createClient({
    url: 'file:./local.db'
});

const projects = [
    {
        title: "Martín Juez",
        description: "Portfolio de Martín Juez.",
        image_url: "",
        repo_url: "",
        live_url: "https://martinjuez.com/",
        tags: "Portfolio",
        is_active: 1
    },
    {
        title: "Eco-Finance | AI Financial Operating System",
        description: "Sistema operativo financiero con inteligencia artificial.",
        image_url: "",
        repo_url: "",
        live_url: "https://eco-finance-app-b9km.onrender.com/",
        tags: "Finance, AI",
        is_active: 1
    },
    {
        title: "Eventor JFC",
        description: "Plataforma de eventos frontend.",
        image_url: "",
        repo_url: "",
        live_url: "https://eventorjfc.onrender.com/",
        tags: "Events",
        is_active: 1
    },
    {
        title: "Eventos Liard (dn-plataforma)",
        description: "Plataforma de gestión de eventos.",
        image_url: "",
        repo_url: "",
        live_url: "https://eventos-liard-pi.vercel.app/",
        tags: "Events",
        is_active: 1
    },
    {
        title: "Sheyla Alexia Ortiz",
        description: "Blog de arte.",
        image_url: "",
        repo_url: "",
        live_url: "https://blog-de-arte.vercel.app/",
        tags: "Blog, Art",
        is_active: 1
    },
    {
        title: "Fitlife360",
        description: "Proyecto final de bienestar y fitness.",
        image_url: "",
        repo_url: "",
        live_url: "https://proyecto-final-sigma-two.vercel.app/",
        tags: "Fitness",
        is_active: 1
    },
    {
        title: "Juguetópolis",
        description: "Tienda online de juguetes.",
        image_url: "",
        repo_url: "",
        live_url: "https://juguetopolis.pages.dev/",
        tags: "E-commerce",
        is_active: 1
    },
    {
        title: "Biblioteca Virtual",
        description: "Sistema de biblioteca virtual.",
        image_url: "",
        repo_url: "",
        live_url: "https://biblioteca-mqbk.onrender.com/",
        tags: "Library",
        is_active: 1
    },
    {
        title: "NB Motion Shots — Enlaces",
        description: "Árbol de enlaces para NB Motion Shots.",
        image_url: "",
        repo_url: "",
        live_url: "https://nbmotionshots-links.pages.dev/",
        tags: "Links",
        is_active: 1
    },
    {
        title: "NB Motion Shots",
        description: "Fotografía automotriz – Córdoba · Argentina / Worldwide.",
        image_url: "",
        repo_url: "",
        live_url: "https://nbmotionshots.pages.dev/",
        tags: "Photography, Automotive",
        is_active: 1
    },
    {
        title: "GJL Asesores",
        description: "Contabilidad, Fiscal y Consultoría Empresarial.",
        image_url: "",
        repo_url: "",
        live_url: "https://www.gjlasesores.com/",
        tags: "Consulting",
        is_active: 1
    },
    {
        title: "Gonzalo Juárez López Jr.",
        description: "Capacitación y servicios profesionales.",
        image_url: "",
        repo_url: "",
        live_url: "https://www.gjuarezlopez.com.mx/index.html",
        tags: "Professional Services",
        is_active: 1
    },
    {
        title: "Contreras Steel LLC",
        description: "Structural Steel Erection & Fabrication | Cullman, AL",
        image_url: "",
        repo_url: "",
        live_url: "https://www.contrerassteel.com/",
        tags: "Construction, Steel",
        is_active: 1
    }
];

async function seed() {
    try {
        console.log("Limpiando proyectos anteriores...");
        await db.execute("DELETE FROM projects");

        console.log("Insertando proyectos de prueba...");
        for (const proj of projects) {
            let finalImageUrl = proj.image_url;
            if (!finalImageUrl && proj.live_url) {
                finalImageUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(proj.live_url)}?w=1200`;
            }

            await db.execute({
                sql: `INSERT INTO projects (title, description, image_url, repo_url, live_url, tags, is_active) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [proj.title, proj.description, finalImageUrl, proj.repo_url, proj.live_url, proj.tags, proj.is_active]
            });
        }
        console.log("¡Proyectos insertados correctamente!");
    } catch (e) {
        console.error("Error:", e);
    }
}

seed();
