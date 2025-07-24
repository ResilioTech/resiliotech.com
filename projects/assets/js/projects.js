// Projects page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the projects page
    initializeProjectsPage();
    
    // Setup filter functionality
    setupFilters();
    
    // Load all projects initially
    loadProjects();
    
    // Initialize breadcrumbs
    initializeBreadcrumbs();
});

function initializeProjectsPage() {
    // Add any initialization logic here
    // console.log('Projects page initialized');
}

function initializeBreadcrumbs() {
    if (typeof window.ResilioCommon !== 'undefined') {
        const common = new window.ResilioCommon();
        common.initBreadcrumbs();
    }
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the selected category
            const category = this.getAttribute('data-category');
            
            // Filter projects
            filterProjects(category);
        });
    });
}

function filterProjects(category) {
    const projectsGrid = document.getElementById('projects-grid');
    const loading = document.getElementById('loading');
    const noResults = document.getElementById('no-results');
    
    // Show loading
    loading.style.display = 'block';
    projectsGrid.innerHTML = '';
    noResults.style.display = 'none';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        let filteredProjects;
        
        if (category === 'all') {
            filteredProjects = projectsData;
        } else {
            filteredProjects = getProjectsByCategory(category);
        }
        
        // Hide loading
        loading.style.display = 'none';
        
        if (filteredProjects.length === 0) {
            noResults.style.display = 'block';
        } else {
            renderProjects(filteredProjects);
        }
    }, 500);
}

function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const loading = document.getElementById('loading');
    
    // Show loading
    loading.style.display = 'block';
    
    // Simulate loading delay
    setTimeout(() => {
        loading.style.display = 'none';
        renderProjects(projectsData);
    }, 800);
}

function renderProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';
    
    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
        
        // Add animation delay
        setTimeout(() => {
            projectCard.classList.add('animate');
        }, index * 100);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);
    
    // Get technologies as HTML
    const techTags = project.technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');
    
    // Get outcomes keys and values
    const outcomeKeys = Object.keys(project.outcomes);
    const outcomeElements = outcomeKeys.map(key => {
        const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
        const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
        return `
            <div class="outcome">
                <span class="outcome-value">${project.outcomes[key]}</span>
                <span class="outcome-label">${capitalizedLabel}</span>
            </div>
        `;
    }).join('');
    
    card.innerHTML = `
        <div class="project-header">
            <div class="project-category">${project.category}</div>
            ${project.githubRepo ? `
                <a href="${project.githubRepo}" target="_blank" class="project-github-icon" title="View on GitHub">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </a>
            ` : ''}
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            
            <div class="project-meta">
                <div class="project-meta-item">
                    <span class="project-meta-label">Client</span>
                    <span class="project-meta-value">${project.client}</span>
                </div>
                <div class="project-meta-item">
                    <span class="project-meta-label">Duration</span>
                    <span class="project-meta-value">${project.duration}</span>
                </div>
                <div class="project-meta-item">
                    <span class="project-meta-label">Team Size</span>
                    <span class="project-meta-value">${project.teamSize}</span>
                </div>
                <div class="project-meta-item">
                    <span class="project-meta-label">Status</span>
                    <span class="project-meta-value">Completed</span>
                </div>
            </div>
            
            <div class="project-technologies">
                ${techTags}
            </div>
        </div>
        
        <div class="project-outcomes">
            ${outcomeElements}
        </div>
    `;
    
    return card;
}

// Utility function to get icon HTML based on icon name
function getIconHTML(iconName) {
    const icons = {
        cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>',
        settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
        layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12,2 2,7 12,12 22,7 12,2"></polygon><polyline points="2,17 12,22 22,17"></polyline><polyline points="2,12 12,17 22,12"></polyline></svg>',
        shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
        cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>',
        lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><circle cx="12" cy="16" r="1"></circle><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'
    };
    
    return icons[iconName] || icons.settings;
}

// Search functionality (can be added later)
function searchProjects(query) {
    const filteredProjects = projectsData.filter(project => 
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.category.toLowerCase().includes(query.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query.toLowerCase()))
    );
    
    renderProjects(filteredProjects);
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
