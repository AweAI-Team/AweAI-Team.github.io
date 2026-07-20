const App = {
  BASE: (() => {
    const p = location.pathname;
    const idx = p.indexOf('/BeyondSWE_leaderboard');
    return idx >= 0 ? p.substring(0, idx + '/BeyondSWE_leaderboard'.length) : '';
  })(),

  cache: {},

  async fetchJSON(path) {
    const url = this.BASE + '/' + path;
    if (this.cache[url]) return this.cache[url];
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    const data = await res.json();
    this.cache[url] = data;
    return data;
  },

  getHash() {
    return decodeURIComponent(location.hash.slice(1) || '');
  },

  navigate(hash) {
    location.hash = hash;
  },

  parseRoute() {
    const hash = this.getHash();
    if (!hash || hash === '/') return { view: 'leaderboard' };

    const parts = hash.replace(/^\//, '').split('/');
    if (parts.length === 1) {
      return { view: 'model-detail', submissionId: parts[0] };
    }
    if (parts.length === 2) {
      return { view: 'case-detail', submissionId: parts[0], caseId: parts[1] };
    }
    return { view: 'leaderboard' };
  },

  async init() {
    window.addEventListener('hashchange', () => this.route());
    this.route();
  },

  async route() {
    const route = this.parseRoute();
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="loading"><div class="spinner"></div>Loading...</div>';

    try {
      switch (route.view) {
        case 'leaderboard':
          await Leaderboard.render(main);
          break;
        case 'model-detail':
          await Detail.renderModelDetail(main, route.submissionId);
          break;
        case 'case-detail':
          await Detail.renderCaseDetail(main, route.submissionId, route.caseId);
          break;
        default:
          await Leaderboard.render(main);
      }
    } catch (err) {
      main.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><div class="msg">Error: ${err.message}</div></div>`;
      console.error(err);
    }
  },

  renderBreadcrumb(items) {
    let html = '<div class="breadcrumb">';
    html += '<a href="#/">Leaderboard</a>';
    for (let i = 0; i < items.length; i++) {
      html += '<span class="sep">›</span>';
      if (i < items.length - 1) {
        html += `<a href="${items[i].href}">${items[i].label}</a>`;
      } else {
        html += `<span class="current">${items[i].label}</span>`;
      }
    }
    html += '</div>';
    return html;
  },

  formatDuration(seconds) {
    if (seconds == null) return '—';
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
  },

  formatRate(val) {
    if (val == null) return '—';
    return val.toFixed(2) + '%';
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
