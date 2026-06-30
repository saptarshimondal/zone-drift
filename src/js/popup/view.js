export class View {
  constructor() {
    this.searchInput = document.getElementById('tz-search');
    this.dropdown = document.getElementById('tz-dropdown');
    this.btnApply = document.getElementById('btn-apply');
    this.applyText = document.getElementById('apply-text');
    this.btnReset = document.getElementById('btn-reset');
    this.timeReadout = document.getElementById('time-readout');
    this.zoneLabel = document.getElementById('zone-label');
    this.scopeTab = document.getElementById('scope-tab');
    this.scopeGlobal = document.getElementById('scope-global');
    this.clockTime = document.getElementById('clockTime');
    this.clockDate = document.getElementById('clockDate');
    this.clockTz = document.getElementById('clockTz');
    
    // Status Indicator
    this.statusContainer = document.getElementById('statusContainer');
    this.statusDot = document.getElementById('statusDot');
    this.statusIndicator = document.getElementById('statusIndicator');

    // UI Wrappers
    this.restrictedMessage = document.getElementById('restrictedMessage');
    this.mainUi = document.getElementById('mainUi');
  }

  showRestrictedMessage() {
    this.mainUi.classList.add('hidden');
    this.restrictedMessage.classList.remove('hidden');
  }

  bindSearchFocus(handler) {
    this.searchInput.addEventListener('focus', handler);
  }

  bindSearchInput(handler) {
    this.searchInput.addEventListener('input', (e) => handler(e.target.value));
  }

  bindClickOutsideDropdown(handler) {
    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target) && !this.dropdown.contains(e.target)) {
        handler();
      }
    });
  }

  bindTimezoneSelect(handler) {
    this.dropdown.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (li && li.dataset.tz) {
        handler(li.dataset.tz);
      }
    });
  }

  bindScopeChange(handler) {
    this.scopeTab.addEventListener('click', () => handler(false));
    this.scopeGlobal.addEventListener('click', () => handler(true));
  }

  bindApply(handler) {
    this.btnApply.addEventListener('click', handler);
  }

  bindReset(handler) {
    this.btnReset.addEventListener('click', handler);
  }

  renderClock(hours, minutes, seconds, timezone) {
    this.timeReadout.innerHTML = `${hours}:${minutes}<span class="text-2xl text-cyan-600">:${seconds}</span>`;
    this.zoneLabel.innerHTML = `
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      ${timezone}
    `;
  }

  renderDropdown(timezones, selectedTimezone, query = '') {
    this.dropdown.innerHTML = '';
    
    if (timezones.length === 0) {
      this.dropdown.innerHTML = '<li class="px-3 py-2 text-sm text-slate-500">No matching timezones</li>';
      return;
    }

    const fragment = document.createDocumentFragment();
    timezones.forEach(tz => {
      const li = document.createElement('li');
      li.dataset.tz = tz;
      
      if (tz === selectedTimezone) {
        li.className = 'px-3 py-2 text-sm text-white bg-cyan-600/20 border-l-2 border-cyan-400 cursor-pointer';
      } else {
        li.className = 'px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 cursor-pointer transition-colors';
      }

      if (query) {
        const regex = new RegExp(`(${query})`, 'gi');
        li.innerHTML = tz.replace(regex, '<span class="font-bold text-white">$1</span>');
      } else {
        li.textContent = tz;
      }

      fragment.appendChild(li);
    });
    
    this.dropdown.appendChild(fragment);
  }

  showDropdown() {
    this.dropdown.classList.remove('hidden');
  }

  hideDropdown() {
    this.dropdown.classList.add('hidden');
  }

  setSearchValue(val) {
    this.searchInput.value = val;
  }

  renderScope(isGlobalScope) {
    if (isGlobalScope) {
      this.scopeGlobal.className = 'flex-1 py-1.5 text-xs font-medium bg-slate-600 text-white rounded-md shadow-sm transition-colors';
      this.scopeTab.className = 'flex-1 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors';
      this.applyText.textContent = "Apply & Reload All Tabs";
    } else {
      this.scopeTab.className = 'flex-1 py-1.5 text-xs font-medium bg-slate-600 text-white rounded-md shadow-sm transition-colors';
      this.scopeGlobal.className = 'flex-1 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors';
      this.applyText.textContent = "Apply & Reload Tab";
    }
  }

  showApplySuccess() {
    const originalText = this.applyText.textContent;
    this.applyText.textContent = "Applied successfully!";
    this.btnApply.classList.replace('bg-cyan-600', 'bg-emerald-600');
    
    setTimeout(() => {
      this.applyText.textContent = originalText;
      this.btnApply.classList.replace('bg-emerald-600', 'bg-cyan-600');
    }, 1500);
  }

  showError(message) {
    const originalText = this.applyText.textContent;
    this.applyText.textContent = message;
    this.btnApply.classList.replace('bg-cyan-600', 'bg-red-600');
    
    setTimeout(() => {
      this.applyText.textContent = originalText;
      this.btnApply.classList.replace('bg-red-600', 'bg-cyan-600');
    }, 2000);
  }

  setStatus(isActive) {
    if (isActive) {
      this.statusContainer.className = 'flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full';
      this.statusDot.className = 'w-2 h-2 bg-emerald-400 rounded-full animate-pulse';
      this.statusIndicator.className = 'text-[10px] font-semibold text-emerald-400 uppercase tracking-wider';
      this.statusIndicator.textContent = 'Active';
    } else {
      this.statusContainer.className = 'flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full';
      this.statusDot.className = 'w-2 h-2 bg-red-400 rounded-full';
      this.statusIndicator.className = 'text-[10px] font-semibold text-red-400 uppercase tracking-wider';
      this.statusIndicator.textContent = 'Inactive';
    }
  }
}
