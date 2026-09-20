import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.TURSO_DATABASE_URL || 'file:./local.db';
const dbAuthToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
    url: dbUrl,
    authToken: dbAuthToken
});

const defaultContent = [
    {
        section_key: 'hero',
        content_json: JSON.stringify({
            title_prefix: "Nahuel Maximiliano",
            title_highlight: "Bustos",
            subtitle: "Desarrollador Full-Stack Senior y Arquitecto de Software especializado en crear experiencias web escalables, interactivas y de alto impacto.",
            tag: "SISTEMAS & ARQUITECTURA WEB",
            github_url: "https://github.com/Nahuel-Maximiliano-Bustos",
            linkedin_url: "https://www.linkedin.com/in/nahuel-maximiliano-bustos-b5b977288",
            email: "programandoconnahu@gmail.com"
        }),
        is_active: 1
    },
    {
        section_key: 'about',
        content_json: JSON.stringify({
            title: "SOBRE",
            title_highlight: "MÍ",
            paragraphs: [
                "Soy un desarrollador apasionado por crear interfaces inmersivas y arquitecturas robustas. Mi enfoque combina diseño vanguardista (Glassmorphism, Cyberpunk, animaciones fluidas) con código limpio y mantenible.",
                "Me considero autodidacta y estoy constantemente aprendiendo nuevas tecnologías. Actualmente me enfoco en el ecosistema React/Node y arquitecturas serverless."
            ],
            stats: [
                { value: "05", label: "AÑOS EXPERIENCIA" },
                { value: "50+", label: "PROYECTOS" },
                { value: "12", label: "TECNOLOGÍAS" },
                { value: "100%", label: "DEDICACIÓN" }
            ],
            timeline: [
                { year: "2019", text: "Inicios en programación", description: "Comencé a aprender HTML, CSS y JS de forma autodidacta." },
                { year: "2021", text: "Desarrollo Frontend", description: "Dominio de React y creación de SPAs." },
                { year: "2023", text: "Full-Stack", description: "Incorporación de Node.js, bases de datos y arquitecturas completas." },
                { year: "2026", text: "Arquitectura", description: "Especialización en sistemas escalables y diseño avanzado." }
            ]
        }),
        is_active: 1
    },
    {
        section_key: 'education',
        content_json: JSON.stringify({
            title: "MI",
            title_highlight: "FORMACIÓN",
            description: "Un viaje de aprendizaje continuo, combinando formación académica y una fuerte base autodidacta.",
            items: [
                { year: "2018 - 2019", degree: "Fundamentos de Programación", institution: "Plataformas Autodidactas", description: "Lógica de programación, algoritmos y estructuras de datos básicas." },
                { year: "2020 - 2021", degree: "Desarrollo Web Frontend", institution: "Bootcamp Intensivo", description: "HTML5, CSS3 Avanzado, JavaScript Moderno (ES6+) y React." },
                { year: "2022 - 2023", degree: "Ingeniería de Software / Backend", institution: "Cursos Especializados", description: "Node.js, Express, Bases de datos SQL y NoSQL, APIs RESTful." },
                { year: "2024 - Presente", degree: "Arquitectura de Sistemas & Cloud", institution: "Aprendizaje Continuo", description: "Patrones de diseño avanzado, microservicios, AWS y optimización de rendimiento." }
            ]
        }),
        is_active: 1
    },
    {
        section_key: 'tech_stack',
        content_json: JSON.stringify({
            title: "TECH",
            title_highlight: "STACK",
            description: "Ecosistema de tecnologías que utilizo para construir soluciones robustas.",
            soft_skills: ["Comunicación Asertiva", "Ventas B2B", "Diseño UX/UI", "Trabajo en Equipo", "Resolución de Problemas Críticos", "Gestión del Tiempo", "Liderazgo Técnico"],
            categories: [
                {
                    name: "Frontend",
                    skills: [
                        { name: "React", level: 90 },
                        { name: "Next.js", level: 85 },
                        { name: "TypeScript", level: 85 },
                        { name: "Tailwind CSS", level: 95 },
                        { name: "HTML5/CSS3", level: 100 }
                    ]
                },
                {
                    name: "Backend",
                    skills: [
                        { name: "Node.js", level: 90 },
                        { name: "Express", level: 85 },
                        { name: "Python", level: 75 }
                    ]
                },
                {
                    name: "Database",
                    skills: [
                        { name: "SQLite", level: 95 },
                        { name: "PostgreSQL", level: 85 },
                        { name: "MongoDB", level: 80 }
                    ]
                },
                {
                    name: "Herramientas",
                    skills: [
                        { name: "Git / GitHub", level: 90 },
                        { name: "Docker", level: 75 },
                        { name: "Figma", level: 85 }
                    ]
                }
            ]
        }),
        is_active: 1
    },
    {
        section_key: 'projects',
        content_json: JSON.stringify({
            title: "Casos de",
            title_highlight: "Éxito",
            description: "Sistemas de misión crítica y aplicaciones de alto rendimiento diseñadas desde cero."
        }),
        is_active: 1
    },
    {
        section_key: 'contact',
        content_json: JSON.stringify({
            title: "INICIAR",
            title_highlight: "PROYECTO",
            description: "¿Tienes una idea en mente? Construyamos juntos el próximo gran producto digital.",
            contact_info: {
                email: "programandoconnahu@gmail.com",
                phone: "+54 9 11 1234-5678",
                location: "Buenos Aires, Argentina (Remoto Global)",
                availability: "Disponible para nuevos proyectos"
            }
        }),
        is_active: 1
    },
    {
        section_key: 'footer',
        content_json: JSON.stringify({
            text: "Diseñado y desarrollado con pasión por Nahuel Maximiliano Bustos.",
            copyright: "© 2026 Todos los derechos reservados."
        }),
        is_active: 1
    }
];

async function seedContent() {
    console.log('Seeding portfolio content...');
    try {
        for (const item of defaultContent) {
            await db.execute({
                sql: `INSERT INTO portfolio_content (section_key, content_json, is_active) 
                      VALUES (?, ?, ?)
                      ON CONFLICT(section_key) DO UPDATE SET content_json = excluded.content_json`,
                args: [item.section_key, item.content_json, item.is_active]
            });
            console.log(`Seeded section: ${item.section_key}`);
        }
        console.log('Seeding completed successfully!');
    } catch (e) {
        console.error('Seeding failed:', e);
    }
    process.exit(0);
}

seedContent();
