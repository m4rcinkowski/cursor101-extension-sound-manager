/**
 * Browser adapter to handle differences between Chrome and Opera
 */
class BrowserAdapter {
  constructor() {
    // Detect browser type
    this.browserType = this._detectBrowser();
    this.api = this._getAPI();
  }

  /**
   * Detect which browser is being used
   * @returns {string} 'chrome' or 'opera'
   */
  _detectBrowser() {
    // Opera includes both "Chrome" and "OPR" in the user agent
    if (navigator.userAgent.indexOf('OPR') !== -1) {
      return 'opera';
    }
    return 'chrome';
  }

  /**
   * Get the appropriate browser API
   * @returns {object} Browser API object
   */
  _getAPI() {
    // Both Chrome and Opera use the chrome namespace for extensions
    return chrome;
  }

  /**
   * Get all tabs
   * @returns {Promise<Array>} Promise resolving to an array of tabs
   */
  getAllTabs() {
    return new Promise((resolve, reject) => {
      this.api.tabs.query({}, (tabs) => {
        if (this.api.runtime.lastError) {
          reject(this.api.runtime.lastError);
        } else {
          resolve(tabs);
        }
      });
    });
  }

  /**
   * Get tabs that are currently producing sound
   * @returns {Promise<Array>} Promise resolving to an array of sound-producing tabs
   */
  getSoundTabs() {
    return new Promise((resolve, reject) => {
      this.api.tabs.query({ audible: true }, (tabs) => {
        if (this.api.runtime.lastError) {
          reject(this.api.runtime.lastError);
        } else {
          resolve(tabs);
        }
      });
    });
  }

  /**
   * Toggle mute state for a tab
   * @param {number} tabId - ID of the tab to toggle
   * @returns {Promise<boolean>} Promise resolving to the new mute state
   */
  toggleMuteState(tabId) {
    return new Promise((resolve, reject) => {
      // First get the current state
      this.api.tabs.get(tabId, (tab) => {
        if (this.api.runtime.lastError) {
          reject(this.api.runtime.lastError);
          return;
        }
        
        // Toggle the mute state
        const newMuteState = !tab.mutedInfo.muted;
        this.api.tabs.update(tabId, { muted: newMuteState }, (updatedTab) => {
          if (this.api.runtime.lastError) {
            reject(this.api.runtime.lastError);
          } else {
            resolve(updatedTab.mutedInfo.muted);
          }
        });
      });
    });
  }
}

// Create a global instance of the adapter
const browserAdapter = new BrowserAdapter(); 