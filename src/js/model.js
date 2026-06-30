export class Model {
  constructor() {
    this.allTimezones = Intl.supportedValuesOf('timeZone');
    this.selectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.isGlobalScope = false;
  }

  setTimezone(tz) {
    if (this.allTimezones.includes(tz)) {
      this.selectedTimezone = tz;
    }
  }

  setGlobalScope(isGlobal) {
    this.isGlobalScope = isGlobal;
  }

  resetTimezone() {
    this.selectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  getFilteredTimezones(query = '') {
    return this.allTimezones.filter(tz => 
      tz.toLowerCase().includes(query.toLowerCase())
    );
  }

  getCurrentTimeParts() {
    const now = new Date();
    const timeString = new Intl.DateTimeFormat('en-GB', {
      timeZone: this.selectedTimezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);
    return timeString.split(':');
  }
}
