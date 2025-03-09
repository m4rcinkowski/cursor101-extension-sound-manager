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
   * Get the current active tab
   * @returns {Promise<Object>} Promise resolving to the active tab
   */
  getCurrentTab() {
    return new Promise((resolve, reject) => {
      this.api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (this.api.runtime.lastError) {
          reject(this.api.runtime.lastError);
        } else if (tabs.length === 0) {
          reject(new Error('No active tab found'));
        } else {
          resolve(tabs[0]);
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

  /**
   * Set mute state for a tab
   * @param {number} tabId - ID of the tab to set mute state for
   * @param {boolean} muted - Whether to mute (true) or unmute (false)
   * @returns {Promise<boolean>} Promise resolving to the new mute state
   */
  setMuteState(tabId, muted) {
    return new Promise((resolve, reject) => {
      this.api.tabs.update(tabId, { muted }, (updatedTab) => {
        if (this.api.runtime.lastError) {
          reject(this.api.runtime.lastError);
        } else {
          resolve(updatedTab.mutedInfo.muted);
        }
      });
    });
  }

  /**
   * Mute all tabs except the specified tab
   * @param {number} exceptTabId - ID of the tab to exclude from muting
   * @returns {Promise<Array>} Promise resolving to an array of updated tabs
   */
  muteAllExcept(exceptTabId) {
    return new Promise(async (resolve, reject) => {
      try {
        const allTabs = await this.getAllTabs();
        const updatePromises = allTabs
          .filter(tab => tab.id !== exceptTabId)
          .map(tab => this.setMuteState(tab.id, true));
        
        const results = await Promise.all(updatePromises);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Mute all tabs
   * @returns {Promise<Array>} Promise resolving to an array of updated tabs
   */
  muteAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const allTabs = await this.getAllTabs();
        const updatePromises = allTabs.map(tab => this.setMuteState(tab.id, true));
        
        const results = await Promise.all(updatePromises);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Unmute all tabs
   * @returns {Promise<Array>} Promise resolving to an array of updated tabs
   */
  unmuteAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const allTabs = await this.getAllTabs();
        const updatePromises = allTabs.map(tab => this.setMuteState(tab.id, false));
        
        const results = await Promise.all(updatePromises);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Create a global instance of the adapter
const browserAdapter = new BrowserAdapter(); 