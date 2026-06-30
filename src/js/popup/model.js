import { timezones, aliases } from '../data/timezones.js';

export class Model {
  constructor() {
    this.allTimezones = timezones;
    this.selectedTimezone = this._getSystemTimezone();
    this.isGlobalScope = false;
  }

  _getSystemTimezone() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return aliases[tz] || tz;
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
    this.selectedTimezone = this._getSystemTimezone();
  }

  getFilteredTimezones(query = '') {
    const q = query.toLowerCase();
    const matchedSet = new Set(
      this.allTimezones.filter(tz => tz.toLowerCase().includes(q))
    );

    for (const [alias, canonical] of Object.entries(aliases)) {
      if (alias.toLowerCase().includes(q)) {
        if (this.allTimezones.includes(canonical)) {
          matchedSet.add(canonical);
        }
      }
    }

    return Array.from(matchedSet);
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
