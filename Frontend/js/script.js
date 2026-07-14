// Fetch and display projects
async function loadProjects() {
    try {
        const response = await fetch('http://localhost:5000/api/projects');
        const projects = await response.json();
        
        const projectGrid = document.getElementById('project-grid');
        projectGrid.innerHTML = projects.map(project => `
            <div class="project-card">
                <img src="${project.image || 'https://via.placeholder.com/300x200'}" alt="${project.title}">
                <div class="content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <div class="links">
                        <a href="${project.githubLink}" target="_blank">GitHub</a>
                        ${project.liveLink ? `<a href="${project.liveLink}" target="_blank">Live Demo</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Contact form submission
document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Message sent successfully!');
            e.target.reset();
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

// Load projects on page load
document.addEventListener('DOMContentLoaded', loadProjects);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});