/**
 * Popup script for Sound Tab Manager extension
 */
document.addEventListener('DOMContentLoaded', () => {
  const tabsList = document.getElementById('tabs-list');
  
  // Load and display sound tabs
  loadSoundTabs();
  
  /**
   * Load tabs that are producing sound and display them
   */
  async function loadSoundTabs() {
    try {
      const soundTabs = await browserAdapter.getSoundTabs();
      renderTabsList(soundTabs);
    } catch (error) {
      console.error('Error loading sound tabs:', error);
      tabsList.innerHTML = `<div class="error">Error loading tabs: ${error.message}</div>`;
    }
  }
  
  /**
   * Render the list of sound tabs
   * @param {Array} tabs - Array of tab objects
   */
  function renderTabsList(tabs) {
    // Clear the loading message
    tabsList.innerHTML = '';
    
    if (tabs.length === 0) {
      tabsList.innerHTML = '<div class="no-sound-tabs">Everything\'s quiet.</div>';
      return;
    }
    
    // Create a document fragment to improve performance
    const fragment = document.createDocumentFragment();
    
    tabs.forEach(tab => {
      const tabElement = createTabElement(tab);
      fragment.appendChild(tabElement);
    });
    
    tabsList.appendChild(fragment);
  }
  
  /**
   * Create a DOM element for a tab
   * @param {Object} tab - Tab object
   * @returns {HTMLElement} Tab element
   */
  function createTabElement(tab) {
    const tabElement = document.createElement('div');
    tabElement.className = 'tab-item';
    tabElement.dataset.tabId = tab.id;
    
    // Add favicon
    const favicon = document.createElement('img');
    favicon.className = 'tab-favicon';
    favicon.src = tab.favIconUrl || 'icons/default-favicon.png';
    favicon.onerror = () => { favicon.src = 'icons/default-favicon.png'; };
    tabElement.appendChild(favicon);
    
    // Add title
    const title = document.createElement('div');
    title.className = 'tab-title';
    title.textContent = tab.title;
    title.title = tab.title; // Add tooltip
    tabElement.appendChild(title);
    
    // Add mute button
    const muteButton = document.createElement('button');
    muteButton.className = 'mute-button';
    muteButton.title = tab.mutedInfo.muted ? 'Unmute' : 'Mute';
    
    const muteIcon = document.createElement('img');
    muteIcon.src = tab.mutedInfo.muted ? 'icons/unmute.png' : 'icons/mute.png';
    muteButton.appendChild(muteIcon);
    
    muteButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent tab item click
      toggleMute(tab.id, muteButton, muteIcon);
    });
    
    tabElement.appendChild(muteButton);
    
    // Make the tab item clickable to focus that tab
    tabElement.addEventListener('click', () => {
      browserAdapter.api.tabs.update(tab.id, { active: true });
      browserAdapter.api.windows.update(tab.windowId, { focused: true });
    });
    
    return tabElement;
  }
  
  /**
   * Toggle mute state for a tab
   * @param {number} tabId - ID of the tab to toggle
   * @param {HTMLElement} button - Mute button element
   * @param {HTMLElement} icon - Mute icon element
   */
  async function toggleMute(tabId, button, icon) {
    try {
      const isMuted = await browserAdapter.toggleMuteState(tabId);
      
      // Update the button appearance
      button.title = isMuted ? 'Unmute' : 'Mute';
      icon.src = isMuted ? 'icons/unmute.png' : 'icons/mute.png';
    } catch (error) {
      console.error('Error toggling mute state:', error);
    }
  }
}); 