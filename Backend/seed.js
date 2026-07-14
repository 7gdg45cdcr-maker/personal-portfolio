const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const projects = [
    {
        title: "E-Commerce Platform",
        description: "A full-featured online store with payment integration, user authentication, admin dashboard, and order management system.",
        image: "https://via.placeholder.com/600x400/2563eb/ffffff?text=E-Commerce",
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "JWT"],
        githubLink: "https://github.com/yourusername/ecommerce-platform",
        liveLink: "https://ecommerce-demo.vercel.app",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Task Management App",
        description: "Kanban-style task management with real-time updates, team collaboration, file attachments, and progress tracking.",
        image: "https://via.placeholder.com/600x400/7c3aed/ffffff?text=Task+Manager",
        technologies: ["React", "Express", "PostgreSQL", "Socket.io", "Tailwind CSS"],
        githubLink: "https://github.com/yourusername/task-management",
        liveLink: "https://taskmanager-demo.vercel.app",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Weather Dashboard",
        description: "Interactive weather dashboard with real-time data, 7-day forecast, location-based services, and weather alerts.",
        image: "https://via.placeholder.com/600x400/059669/ffffff?text=Weather",
        technologies: ["Vue.js", "Node.js", "OpenWeather API", "Chart.js"],
        githubLink: "https://github.com/yourusername/weather-dashboard",
        liveLink: "https://weather-demo.vercel.app",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

async function seedDatabase() {
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas');
        
        const db = client.db('portfolio_db');
        const projectsCollection = db.collection('projects');
        
        // Clear existing data
        await projectsCollection.deleteMany({});
        console.log('✅ Cleared existing projects');
        
        // Insert sample data
        const result = await projectsCollection.insertMany(projects);
        console.log(`✅ Inserted ${result.insertedCount} projects`);
        
        console.log('\n📊 Your projects:');
        projects.forEach((p, i) => {
            console.log(`${i + 1}. ${p.title}`);
            console.log(`   Technologies: ${p.technologies.join(', ')}\n`);
        });
        
        await client.close();
        console.log('✅ Seeding complete!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        await client.close();
    }
}

seedDatabase();
