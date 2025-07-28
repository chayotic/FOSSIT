document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const appContainer = document.getElementById('app-container');
  const searchInput = document.getElementById('search-input');
  
  // Fetch apps from apps.json
  fetch('apps.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(apps => {
      // Shuffle the apps array randomly
      const shuffledApps = shuffleArray(apps);
      
      // Initial render with shuffled apps
      renderApps(shuffledApps);
      
      // Search functionality
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredApps = apps.filter(app => 
          app.name.toLowerCase().includes(searchTerm) || 
          app.description.toLowerCase().includes(searchTerm) || 
          app.author.toLowerCase().includes(searchTerm)
        );
        renderApps(shuffleArray(filteredApps)); // Also shuffle search results
      });
    })
    .catch(error => {
      console.error('Error loading apps:', error);
      appContainer.innerHTML = `
        <div class="no-results">
          <p>Error loading apps. Please try again later.</p>
        </div>
      `;
    });
  
  // Fisher-Yates shuffle algorithm to randomize array
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  // Render apps function
  function renderApps(apps) {
    appContainer.innerHTML = '';
    
    if (apps.length === 0) {
      appContainer.innerHTML = `
        <div class="no-results">
          <p>No apps found matching your search</p>
        </div>
      `;
      return;
    }
    
    apps.forEach((app, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.setProperty('--index', index);
      card.style.animationDelay = `${index * 0.1}s`;
      
      card.innerHTML = `
        <img src="${app.icon}" alt="${app.name} icon" loading="lazy">
        <div class="name">${app.name}</div>
        <div class="desc">${app.description}</div>
        <div class="author">by ${app.author}</div>
      `;
      
      card.addEventListener('click', () => {
        window.open(app.link, '_blank');
      });
      
      appContainer.appendChild(card);
    });
  }
});