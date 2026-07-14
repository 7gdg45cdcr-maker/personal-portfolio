const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db;
let projectsCollection;
let contactsCollection;

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        // Create database and collections
        db = client.db('portfolio_db');
        projectsCollection = db.collection('projects');
        contactsCollection = db.collection('contacts');
        
        // Create indexes for better performance
        await projectsCollection.createIndex({ title: 1 });
        await projectsCollection.createIndex({ technologies: 1 });
        
        console.log('✅ Collections ready');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// Connect to database when server starts
connectToDatabase();

// ============ PROJECTS ROUTES ============

// GET all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await projectsCollection.find({}).toArray();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
});

// GET single project
app.get('/api/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Check if id is valid ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        
        const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
});

// POST new project
app.post('/api/projects', async (req, res) => {
    try {
        const { title, description, image, technologies, githubLink, liveLink } = req.body;
        
        // Validation
        if (!title || !description || !technologies || !githubLink) {
            return res.status(400).json({ 
                message: 'Missing required fields: title, description, technologies, githubLink' 
            });
        }
        
        const newProject = {
            title,
            description,
            image: image || 'https://via.placeholder.com/300x200',
            technologies: Array.isArray(technologies) ? technologies : technologies.split(',').map(t => t.trim()),
            githubLink,
            liveLink: liveLink || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await projectsCollection.insertOne(newProject);
        res.status(201).json({ 
            message: 'Project created successfully',
            project: { ...newProject, _id: result.insertedId }
        });
    } catch (error) {
        res.status(400).json({ message: 'Error creating project', error: error.message });
    }
});

// PUT update project
app.put('/api/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        
        const { title, description, image, technologies, githubLink, liveLink } = req.body;
        
        const updatedProject = {
            $set: {
                title,
                description,
                image: image || 'https://via.placeholder.com/300x200',
                technologies: Array.isArray(technologies) ? technologies : technologies.split(',').map(t => t.trim()),
                githubLink,
                liveLink: liveLink || '',
                updatedAt: new Date()
            }
        };
        
        const result = await projectsCollection.updateOne(
            { _id: new ObjectId(id) },
            updatedProject
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error updating project', error: error.message });
    }
});

// DELETE project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        
        const result = await projectsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
});

// ============ CONTACT ROUTES ============

// POST contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const contactData = {
            name,
            email,
            message,
            createdAt: new Date()
        };
        
        const result = await contactsCollection.insertOne(contactData);
        res.status(201).json({ 
            message: 'Message sent successfully',
            id: result.insertedId
        });
    } catch (error) {
        res.status(400).json({ message: 'Error sending message', error: error.message });
    }
});

// GET all contacts (admin only - for testing)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await contactsCollection.find({}).sort({ createdAt: -1 }).toArray();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});