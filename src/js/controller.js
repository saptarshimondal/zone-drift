export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.clockInterval = null;

    // Bind View Events
    this.view.bindSearchFocus(this.handleSearchFocus.bind(this));
    this.view.bindSearchInput(this.handleSearchInput.bind(this));
    this.view.bindClickOutsideDropdown(this.handleClickOutsideDropdown.bind(this));
    this.view.bindTimezoneSelect(this.handleTimezoneSelect.bind(this));
    this.view.bindScopeChange(this.handleScopeChange.bind(this));
    this.view.bindApply(this.handleApply.bind(this));
    this.view.bindReset(this.handleReset.bind(this));

    // Initial Render
    this.updateClock();
    this.startClock();
    this.view.renderScope(this.model.isGlobalScope);

    // Initialize from storage
    this.initSavedState();
  }

  async initSavedState() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    
    const data = await chrome.storage.local.get([`tz_${tab.id}`, 'tz_global']);
    const tabTz = data[`tz_${tab.id}`];
    const globalTz = data['tz_global'];

    if (tabTz) {
      this.model.setTimezone(tabTz);
      this.model.setGlobalScope(false);
      this.view.setSearchValue(tabTz);
    } else if (globalTz) {
      this.model.setTimezone(globalTz);
      this.model.setGlobalScope(true);
      this.view.setSearchValue(globalTz);
    }

    this.updateClock();
    this.view.renderScope(this.model.isGlobalScope);
  }

  updateClock() {
    try {
      const [hours, minutes, seconds] = this.model.getCurrentTimeParts();
      this.view.renderClock(hours, minutes, seconds, this.model.selectedTimezone);
    } catch (e) {
      console.error("Invalid Timezone", e);
    }
  }

  startClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  handleSearchFocus() {
    this.view.showDropdown();
    this.view.renderDropdown(
      this.model.getFilteredTimezones(this.view.searchInput.value),
      this.model.selectedTimezone,
      this.view.searchInput.value
    );
  }

  handleSearchInput(query) {
    this.view.showDropdown();
    this.view.renderDropdown(
      this.model.getFilteredTimezones(query),
      this.model.selectedTimezone,
      query
    );
  }

  handleClickOutsideDropdown() {
    this.view.hideDropdown();
  }

  handleTimezoneSelect(tz) {
    this.model.setTimezone(tz);
    this.view.setSearchValue(tz);
    this.view.hideDropdown();
    this.updateClock();
  }

  handleScopeChange(isGlobal) {
    this.model.setGlobalScope(isGlobal);
    this.view.renderScope(this.model.isGlobalScope);
  }

  async handleApply() {
    if (!this.view.searchInput.value) {
      this.view.showError("Please select a timezone");
      return;
    }

    const tz = this.model.selectedTimezone;
    console.log(`Applying Timezone: ${tz}, Scope: ${this.model.isGlobalScope ? 'Global' : 'Per Tab'}`);
    
    if (this.model.isGlobalScope) {
      await chrome.storage.local.set({ 'tz_global': tz });
      
      // Optional: Clear all specific tab overrides so global takes full effect
      const allData = await chrome.storage.local.get(null);
      const keysToRemove = Object.keys(allData).filter(k => k.startsWith('tz_') && k !== 'tz_global');
      if (keysToRemove.length > 0) {
        await chrome.storage.local.remove(keysToRemove);
      }

      const allTabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
      this.view.showApplySuccess();
      allTabs.forEach(t => chrome.tabs.reload(t.id));
    } else {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return;
      await chrome.storage.local.set({ [`tz_${tab.id}`]: tz });
      this.view.showApplySuccess();
      chrome.tabs.reload(tab.id);
    }
  }

  async handleReset() {
    this.model.resetTimezone();
    this.view.setSearchValue('');
    this.updateClock();
    
    if (this.model.isGlobalScope) {
      await chrome.storage.local.remove('tz_global');
      const allTabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
      allTabs.forEach(t => chrome.tabs.reload(t.id));
    } else {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.storage.local.remove(`tz_${tab.id}`);
        chrome.tabs.reload(tab.id);
      }
    }
    console.log("Timezone reset to system default.");
  }
}
