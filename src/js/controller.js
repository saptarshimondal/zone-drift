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

  handleApply() {
    console.log(`Applying Timezone: ${this.model.selectedTimezone}, Scope: ${this.model.isGlobalScope ? 'Global' : 'Per Tab'}`);
    // Add logic here to save settings to chrome.storage and update tabs
    this.view.showApplySuccess();
  }

  handleReset() {
    this.model.resetTimezone();
    this.view.setSearchValue('');
    this.updateClock();
    console.log("Timezone reset to system default.");
  }
}
