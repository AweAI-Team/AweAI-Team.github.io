const SCAFFOLD_URLS = {
  'SearchSWE': 'https://github.com/AweAI-Team/AweAgent',
  'OpenHands': 'https://github.com/AweAI-Team/AweAgent'
};

const Leaderboard = {
  state: {
    sortKey: 'avg',
    sortDir: 'desc',
    search: '',
    filterAgent: '',
    filterModel: '',
    filterScaffoldOrg: '',
    filterModelOrg: '',
    data: null
  },

  async render(container) {
    const lb = await App.fetchJSON('data/leaderboard.json');
    this.state.data = lb;
    this.state.sortKey = 'avg';
    this.state.sortDir = 'desc';
    this.state.search = '';
    this.state.filterAgent = '';
    this.state.filterModel = '';
    this.state.filterScaffoldOrg = '';
    this.state.filterModelOrg = '';
    this.buildPage(container);
  },

  getUniqueValues(key) {
    const vals = new Set();
    for (const s of this.state.data.submissions) {
      const v = s[key];
      if (v) vals.add(v);
    }
    return [...vals].sort();
  },

  buildPage(container) {
    const lb = this.state.data;
    const scaffolds = this.getUniqueValues('agent');
    const models = this.getUniqueValues('model');
    const scaffoldOrgs = [...new Set(this.state.data.submissions.map(s => s.agent_org).filter(Boolean))].sort();
    const modelOrgs = [...new Set(this.state.data.submissions.map(s => s.model_org).filter(Boolean))].sort();

    let html = App.renderBreadcrumb([
      { label: 'BeyondSWE Leaderboard', href: '#/' }
    ]);

    html += `<h1 class="page-title">BeyondSWE Leaderboard</h1>`;
    html += `<p class="page-subtitle">Last updated: ${lb.last_updated}</p>`;

    html += `<div class="resource-links">
      <a href="https://arxiv.org/abs/2603.03194" target="_blank" rel="noopener" class="res-btn">
        <img src="assets/ArXiv_logo_2026.svg" alt="arXiv" class="res-img">
        <span>Paper</span>
      </a>
      <a href="https://huggingface.co/datasets/AweAI-Team/BeyondSWE" target="_blank" rel="noopener" class="res-btn">
        <span class="res-emoji">🤗</span>
        <span>Benchmark</span>
      </a>
      <a href="https://github.com/AweAI-Team/BeyondSWE" target="_blank" rel="noopener" class="res-btn">
        <svg class="res-svg" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        <span>Repo</span>
      </a>
      <a href="https://github.com/AweAI-Team/AweAgent" target="_blank" rel="noopener" class="res-btn">
        <img src="assets/scaffold.png" alt="Scaffold" class="res-img">
        <span>Scaffold</span>
      </a>
    </div>`;

    html += '<div class="table-wrapper">';
    html += '<div class="table-toolbar">';
    html += `<span class="entries-info">Showing <strong id="entry-count">${lb.submissions.length}</strong> of ${lb.submissions.length} entries</span>`;
    html += `<div class="filter-clear" id="clear-filters" onclick="Leaderboard.clearFilters()" style="display:none;">Clear filters</div>`;
    html += '</div>';

    html += '<div class="filter-bar">';
    html += `<div class="search-box">
      <span class="icon">🔍</span>
      <input type="text" id="lb-search" placeholder="Search leaderboard" value="">
    </div>`;
    html += `<div class="scaffold-filter-wrap">${this.buildSelect('filter-agent', 'Select scaffolds', scaffolds)}<a id="scaffold-visit-link" class="scaffold-visit-btn" href="#" target="_blank" rel="noopener" style="display:none;" title="Visit scaffold repo">↗</a></div>`;
    html += this.buildSelect('filter-model', 'Select models', models);
    html += this.buildSelect('filter-scaffold-org', 'Select scaffold orgs', scaffoldOrgs);
    html += this.buildSelect('filter-model-org', 'Select model orgs', modelOrgs);
    html += '</div>';

    html += '<div id="table-container"></div>';
    html += '</div>';

    container.innerHTML = html;

    document.getElementById('lb-search').addEventListener('input', (e) => {
      this.state.search = e.target.value.toLowerCase();
      this.updateFiltersVisibility();
      this.renderTable();
    });
    document.getElementById('filter-agent').addEventListener('change', (e) => {
      this.state.filterAgent = e.target.value;
      this.updateFiltersVisibility();
      this.renderTable();
      this.updateScaffoldVisitLink();
    });
    document.getElementById('filter-model').addEventListener('change', (e) => {
      this.state.filterModel = e.target.value;
      this.updateFiltersVisibility();
      this.renderTable();
    });
    document.getElementById('filter-scaffold-org').addEventListener('change', (e) => {
      this.state.filterScaffoldOrg = e.target.value;
      this.updateFiltersVisibility();
      this.renderTable();
    });
    document.getElementById('filter-model-org').addEventListener('change', (e) => {
      this.state.filterModelOrg = e.target.value;
      this.updateFiltersVisibility();
      this.renderTable();
    });

    this.renderTable();
  },

  buildSelect(id, placeholder, options) {
    let html = `<select id="${id}" class="filter-select"><option value="">${placeholder}</option>`;
    for (const opt of options) {
      html += `<option value="${opt}">${opt}</option>`;
    }
    html += '</select>';
    return html;
  },

  clearFilters() {
    this.state.search = '';
    this.state.filterAgent = '';
    this.state.filterModel = '';
    this.state.filterScaffoldOrg = '';
    this.state.filterModelOrg = '';
    document.getElementById('lb-search').value = '';
    document.getElementById('filter-agent').value = '';
    document.getElementById('filter-model').value = '';
    document.getElementById('filter-scaffold-org').value = '';
    document.getElementById('filter-model-org').value = '';
    this.updateFiltersVisibility();
    this.renderTable();
  },

  updateFiltersVisibility() {
    const hasFilter = this.state.search || this.state.filterAgent || this.state.filterModel || this.state.filterScaffoldOrg || this.state.filterModelOrg;
    document.getElementById('clear-filters').style.display = hasFilter ? 'inline-block' : 'none';
  },

  updateScaffoldVisitLink() {
    const link = document.getElementById('scaffold-visit-link');
    if (!link) return;
    const url = SCAFFOLD_URLS[this.state.filterAgent];
    if (url) {
      link.href = url;
      link.style.display = 'inline-flex';
    } else {
      link.style.display = 'none';
    }
  },

  getFilteredSubmissions() {
    let subs = [...this.state.data.submissions];

    if (this.state.search) {
      const q = this.state.search;
      subs = subs.filter(s =>
        s.model.toLowerCase().includes(q) ||
        s.agent.toLowerCase().includes(q) ||
        s.model_org.toLowerCase().includes(q) ||
        (s.agent_org || '').toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }
    if (this.state.filterAgent) {
      subs = subs.filter(s => s.agent === this.state.filterAgent);
    }
    if (this.state.filterModel) {
      subs = subs.filter(s => s.model === this.state.filterModel);
    }
    if (this.state.filterScaffoldOrg) {
      subs = subs.filter(s => s.agent_org === this.state.filterScaffoldOrg);
    }
    if (this.state.filterModelOrg) {
      subs = subs.filter(s => s.model_org === this.state.filterModelOrg);
    }

    const key = this.state.sortKey;
    const dir = this.state.sortDir === 'asc' ? 1 : -1;
    subs.sort((a, b) => {
      let va = this.getSortValue(a, key);
      let vb = this.getSortValue(b, key);
      if (va == null) va = -Infinity;
      if (vb == null) vb = -Infinity;
      if (typeof va === 'string') return dir * va.localeCompare(vb);
      return dir * (va - vb);
    });

    return subs;
  },

  renderTable() {
    const tc = document.getElementById('table-container');
    const subs = this.getFilteredSubmissions();
    const total = this.state.data.submissions.length;

    document.getElementById('entry-count').textContent = subs.length;

    const columns = [
      { key: 'rank', label: 'Rank', cls: 'col-rank', nosort: true },
      { key: 'agent', label: 'Scaffold', cls: '' },
      { key: 'model', label: 'Model', cls: '' },
      { key: 'date', label: 'Date', cls: '' },
      { key: 'agent_org', label: 'Scaffold Org', cls: '' },
      { key: 'model_org', label: 'Model Org', cls: '' },
      { key: 'avg', label: 'AVG', cls: 'col-num col-avg' },
      { key: 'cross_repo', label: '%Resolved', cls: 'col-num' },
      { key: 'domain_fix', label: '%Resolved', cls: 'col-num' },
      { key: 'dep_migrate', label: '%Resolved', cls: 'col-num' },
      { key: 'doc2repo', label: 'Pass Rate', cls: 'col-num' },
      { key: 'doc2repo_ac', label: 'Almost Correct', cls: 'col-num' },
      { key: 'doc2repo_c', label: 'Correct', cls: 'col-num' }
    ];

    const topHeader = [
      { key: 'rank', label: 'Rank', cls: 'col-rank', rowSpan: 2, nosort: true },
      { key: 'agent', label: 'Scaffold', cls: 'col-scaffold', rowSpan: 2 },
      { key: 'model', label: 'Model', cls: 'col-model', rowSpan: 2 },
      { key: 'date', label: 'Date', cls: 'col-date', rowSpan: 2 },
      { key: 'agent_org', label: 'Scaffold Org', cls: 'col-scaffold-org', rowSpan: 2 },
      { key: 'model_org', label: 'Model Org', cls: 'col-model-org', rowSpan: 2 },
      { key: 'avg', label: 'AVG', cls: 'col-num col-avg', rowSpan: 2 },
      { label: 'CrossRepo', cls: 'col-group', colSpan: 1 },
      { label: 'DomainFix', cls: 'col-group', colSpan: 1 },
      { label: 'DepMigrate', cls: 'col-group', colSpan: 1 },
      { label: 'Doc2Repo', cls: 'col-group', colSpan: 3 }
    ];

    const subHeader = [
      { key: 'cross_repo', label: '%Resolved', cls: 'col-num col-bench-sub' },
      { key: 'domain_fix', label: '%Resolved', cls: 'col-num col-bench-sub' },
      { key: 'dep_migrate', label: '%Resolved', cls: 'col-num col-bench-sub' },
      { key: 'doc2repo', label: 'Pass Rate', cls: 'col-num col-doc2repo-sub' },
      { key: 'doc2repo_ac', label: 'Almost Correct', cls: 'col-num col-doc2repo-sub' },
      { key: 'doc2repo_c', label: 'Correct', cls: 'col-num col-doc2repo-sub' }
    ];

    const renderTh = (col, extraCls = '') => {
      const isActive = col.key && this.state.sortKey === col.key;
      const arrow = col.nosort || !col.key ? '' : isActive ? (this.state.sortDir === 'asc' ? '▲' : '▼') : '⇅';
      const activeCls = isActive ? ' sort-active' : '';
      const click = col.nosort || !col.key ? '' : `onclick="Leaderboard.toggleSort('${col.key}')"`;
      const titleAttr = col.title ? ` title="${col.title}"` : '';
      const rowSpanAttr = col.rowSpan ? ` rowspan="${col.rowSpan}"` : '';
      const colSpanAttr = col.colSpan ? ` colspan="${col.colSpan}"` : '';
      let th = `<th class="${col.cls || ''}${activeCls}${extraCls}"${rowSpanAttr}${colSpanAttr} ${click}${titleAttr}>${col.label}`;
      if (!col.nosort && col.key) th += ` <span class="sort-icon">${arrow}</span>`;
      th += '</th>';
      return th;
    };

    let html = '<table class="data-table"><thead>';
    html += '<tr class="header-top">';
    for (const col of topHeader) {
      html += renderTh(col);
    }
    html += '</tr>';
    html += '<tr class="header-sub">';
    for (const col of subHeader) {
      html += renderTh(col);
    }
    html += '</tr></thead><tbody>';

    if (subs.length === 0) {
      html += `<tr><td colspan="${columns.length}" style="text-align:center;padding:40px;color:var(--text-muted);">No matching entries</td></tr>`;
    }

    subs.forEach((s, i) => {
      const rank = i + 1;
      const rankCls = rank <= 3 ? ` rank-${rank}` : '';
      html += `<tr onclick="App.navigate('/${s.id}')">`;
      html += `<td class="col-rank"><span class="rank-badge${rankCls}">${rank}</span></td>`;
      const scaffoldUrl = SCAFFOLD_URLS[s.agent];
      html += scaffoldUrl
        ? `<td class="col-scaffold agent-name"><a href="${scaffoldUrl}" target="_blank" rel="noopener" class="scaffold-link" onclick="event.stopPropagation()">${s.agent}</a></td>`
        : `<td class="col-scaffold agent-name">${s.agent}</td>`;
      html += `<td class="col-model model-name">${s.model}</td>`;
      html += `<td class="col-date">${s.date}</td>`;
      html += `<td class="col-scaffold-org">${s.agent_org || '—'}</td>`;
      html += `<td class="col-model-org">${s.model_org}</td>`;
      const avgStr = s.avg != null ? s.avg.toFixed(2) : '—';
      html += `<td class="col-num col-avg rate-cell rate-good"><strong>${avgStr}</strong></td>`;
      html += `<td class="col-num col-bench-sub rate-cell">${App.formatRate(s.cross_repo?.resolved_rate)}</td>`;
      html += `<td class="col-num col-bench-sub rate-cell">${App.formatRate(s.domain_fix?.resolved_rate)}</td>`;
      html += `<td class="col-num col-bench-sub rate-cell">${App.formatRate(s.dep_migrate?.resolved_rate)}</td>`;
      html += `<td class="col-num col-doc2repo-sub rate-cell">${App.formatRate(s.doc2repo?.pass_rate)}</td>`;
      html += `<td class="col-num col-doc2repo-sub">${s.doc2repo?.almost_correct ?? '—'}</td>`;
      html += `<td class="col-num col-doc2repo-sub">${s.doc2repo?.correct ?? '—'}</td>`;
      html += '</tr>';
    });

    html += '</tbody></table>';
    html += `<div class="table-footer">Displaying ${subs.length} of ${total} entries</div>`;
    html += `<div class="table-declaration">
      <p>Results in this leaderboard correspond to <a href="https://huggingface.co/papers/2603.03194" target="_blank" rel="noopener"><u>BeyondSWE</u></a>.</p>
      <p>Send us an email to submit your agents' results: <a href="mailto:awe.ai.chn@gmail.com">awe.ai.chn@gmail.com</a> <a href="mailto:mengfanzhe16@gmail.com">mengfanzhe16@gmail.com</a></p>
    </div>`;
    tc.innerHTML = html;
  },

  getSortValue(sub, key) {
    switch (key) {
      case 'agent': return sub.agent;
      case 'model': return sub.model;
      case 'model_org': return sub.model_org;
      case 'agent_org': return sub.agent_org || '';
      case 'date': return sub.date;
      case 'cross_repo': return sub.cross_repo?.resolved_rate;
      case 'domain_fix': return sub.domain_fix?.resolved_rate;
      case 'dep_migrate': return sub.dep_migrate?.resolved_rate;
      case 'doc2repo': return sub.doc2repo?.pass_rate;
      case 'doc2repo_ac': return sub.doc2repo?.almost_correct;
      case 'doc2repo_c': return sub.doc2repo?.correct;
      case 'avg': return sub.avg;
      default: return null;
    }
  },

  toggleSort(key) {
    if (this.state.sortKey === key) {
      this.state.sortDir = this.state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortKey = key;
      this.state.sortDir = 'desc';
    }
    this.renderTable();
  }
};
