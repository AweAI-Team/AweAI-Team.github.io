const Detail = {
  DOMAINS: ['cross_repo', 'domain_fix', 'dep_migrate', 'doc2repo'],
  DOMAIN_LABELS: {
    cross_repo: 'CrossRepo',
    domain_fix: 'DomainFix',
    dep_migrate: 'DepMigrate',
    doc2repo: 'Doc2Repo'
  },

  activeTab: 'cross_repo',

  async renderModelDetail(container, submissionId) {
    const [lb, results] = await Promise.all([
      App.fetchJSON('data/leaderboard.json'),
      App.fetchJSON(`data/results/${submissionId}.json`)
    ]);

    const submission = lb.submissions.find(s => s.id === submissionId);
    this.activeTab = 'cross_repo';

    const displayName = `${results.agent} – ${results.model}`;

    let html = App.renderBreadcrumb([
      { label: displayName, href: `#/${submissionId}` }
    ]);

    html += `
      <div class="detail-header">
        <div class="model-title">${displayName}</div>
        <div class="model-org-tag">${results.model_org}</div>
      </div>
    `;

    if (results.notes) {
      html += `<div class="eval-notes"><span class="eval-notes-label">Setup:</span> ${results.notes}</div>`;
    }

    html += '<div class="tabs" id="domain-tabs">';
    for (const d of this.DOMAINS) {
      const cases = results[d] || [];
      const count = cases.length;
      let summary = '';
      if (d !== 'doc2repo') {
        const resolved = cases.filter(c => c.resolved).length;
        summary = `${resolved}/${count}`;
      } else {
        const avgRate = count > 0
          ? (cases.reduce((sum, c) => sum + (c.score || 0), 0) / count * 100).toFixed(1)
          : '0';
        summary = `${avgRate}%`;
      }
      html += `<button class="tab-btn${d === this.activeTab ? ' active' : ''}"
                data-domain="${d}" onclick="Detail.switchTab('${d}')">
                ${this.DOMAIN_LABELS[d]}<span class="tab-summary">(${summary})</span>
              </button>`;
    }
    html += '</div>';

    html += '<div id="domain-content"></div>';
    container.innerHTML = html;

    this._submissionId = submissionId;
    this._results = results;
    this._lb = lb;
    this.renderDomainTab();
  },

  switchTab(domain) {
    this.activeTab = domain;
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.domain === domain);
    });
    this.renderDomainTab();
  },

  renderDomainTab() {
    const dc = document.getElementById('domain-content');
    const domain = this.activeTab;
    const cases = this._results[domain] || [];
    const lb = this._lb;
    const isDoc2Repo = domain === 'doc2repo';
    const benchTotal = lb.total_cases?.[domain] || cases.length;
    const evaluated = cases.length;
    const skippedCount = benchTotal - evaluated;

    let html = '<div class="table-wrapper">';

    if (!isDoc2Repo) {
      const resolved = cases.filter(c => c.resolved).length;
      const rate = evaluated > 0 ? (resolved / evaluated * 100).toFixed(1) : '0';
      const skippedNote = skippedCount > 0 ? ` <span style="color:var(--text-muted);font-weight:400;">(${skippedCount} skipped)</span>` : '';
      html += `<div class="table-toolbar">
        <span class="entries-info">${this.DOMAIN_LABELS[domain]}: <strong>${resolved} / ${evaluated}</strong> resolved (${rate}%)${skippedNote}</span>
      </div>`;
      html += '<table class="data-table"><thead><tr>';
      html += '<th>Task</th><th class="col-num">Resolved</th><th class="col-num">Steps</th><th class="col-num">Duration</th>';
      html += '</tr></thead><tbody>';

      for (const c of cases) {
        const icon = c.resolved
          ? '<span class="resolved-icon pass">✓</span>'
          : '<span class="resolved-icon fail">✗</span>';
        html += `<tr onclick="App.navigate('/${this._submissionId}/${c.instance_id}')">`;
        html += `<td style="font-family:monospace;font-size:13px;">${c.instance_id}</td>`;
        html += `<td class="col-num">${icon}</td>`;
        html += `<td class="col-num">${c.steps}</td>`;
        html += `<td class="col-num">${App.formatDuration(c.duration)}</td>`;
        html += '</tr>';
      }
      html += '</tbody></table>';
    } else {
      const avgRate = cases.length > 0
        ? (cases.reduce((sum, c) => sum + (c.score || 0), 0) / cases.length * 100).toFixed(2)
        : '0';
      const almostCorrect = cases.filter(c => (c.score || 0) >= 0.9).length;
      const correct = cases.filter(c => c.resolved).length;

      const d2rSkippedNote = skippedCount > 0 ? ` <span style="color:var(--text-muted);font-weight:400;">(${skippedCount} skipped)</span>` : '';
      html += `<div class="table-toolbar">
        <span class="entries-info">Doc2Repo (${evaluated} cases${d2rSkippedNote}): Avg Pass Rate <strong>${avgRate}%</strong> · Almost Correct <strong>${almostCorrect}</strong> · Correct <strong>${correct}</strong></span>
      </div>`;
      html += '<table class="data-table"><thead><tr>';
      html += '<th>Task</th><th class="col-num">Pass Rate</th><th class="col-num">Passed</th><th class="col-num">Failed</th><th class="col-num">Total</th><th class="col-num">Steps</th><th class="col-num">Duration</th>';
      html += '</tr></thead><tbody>';

      for (const c of cases) {
        const pt = c.pytest_details || {};
        const rate = (pt.pass_rate != null) ? (pt.pass_rate * 100).toFixed(1) + '%' : '—';
        const rateClass = pt.pass_rate >= 1.0 ? 'rate-good' : '';
        html += `<tr onclick="App.navigate('/${this._submissionId}/${c.instance_id}')">`;
        html += `<td style="font-family:monospace;font-size:13px;">${c.instance_id}</td>`;
        html += `<td class="col-num ${rateClass}">${rate}</td>`;
        html += `<td class="col-num">${pt.passed ?? '—'}</td>`;
        html += `<td class="col-num">${pt.failed ?? '—'}</td>`;
        html += `<td class="col-num">${pt.total ?? '—'}</td>`;
        html += `<td class="col-num">${c.steps}</td>`;
        html += `<td class="col-num">${App.formatDuration(c.duration)}</td>`;
        html += '</tr>';
      }
      html += '</tbody></table>';
    }

    html += '</div>';
    dc.innerHTML = html;
  },

  async renderCaseDetail(container, submissionId, caseId) {
    const results = await App.fetchJSON(`data/results/${submissionId}.json`);

    const displayName = `${results.agent} – ${results.model}`;
    let caseData = null;
    let domain = null;
    for (const d of this.DOMAINS) {
      const found = (results[d] || []).find(c => c.instance_id === caseId);
      if (found) { caseData = found; domain = d; break; }
    }

    if (!caseData) {
      container.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><div class="msg">Case not found.</div></div>';
      return;
    }

    let html = App.renderBreadcrumb([
      { label: displayName, href: `#/${submissionId}` },
      { label: caseId, href: `#/${submissionId}/${caseId}` }
    ]);

    html += '<div class="case-detail-page">';
    html += `<div class="case-title">${caseId}</div>`;

    const rc = caseData.resolved ? 'pass' : 'fail';
    const rt = caseData.resolved ? '✓ Pass' : '✗ Fail';
    const scoreDisplay = domain === 'doc2repo' ? (caseData.score * 100).toFixed(1) + '%' : caseData.score;

    html += '<div class="detail-card">';
    html += '<h3>Basic Information</h3>';
    html += '<div class="detail-info-grid">';
    html += this._infoRow('Result', `<span class="result-badge ${rc}">${rt}</span>`);
    html += this._infoRow('Task', caseId);
    html += this._infoRow('Scaffold', results.agent);
    html += this._infoRow('Models', results.model);
    html += this._infoRow('Domain', this.DOMAIN_LABELS[domain]);
    html += this._infoRow('Score', `<span style="color:var(--${rc})">${scoreDisplay}</span>`);
    html += this._infoRow('Duration', App.formatDuration(caseData.duration));
    html += this._infoRow('Steps', caseData.steps ?? 'N/A');
    html += this._infoRow('LLM Call Time', App.formatDuration(caseData.llm_time));
    html += this._infoRow('Tool Time', App.formatDuration(caseData.tool_time));
    html += '</div></div>';

    if (domain === 'doc2repo' && caseData.pytest_details) {
      const pt = caseData.pytest_details;
      html += '<div class="detail-card">';
      html += '<h3>Pytest Details</h3>';
      html += '<div class="pytest-grid">';
      html += `<div class="pytest-card"><div class="num">${pt.total}</div><div class="lbl">Total</div></div>`;
      html += `<div class="pytest-card"><div class="num green">${pt.passed}</div><div class="lbl">Passed</div></div>`;
      html += `<div class="pytest-card"><div class="num red">${pt.failed}</div><div class="lbl">Failed</div></div>`;
      html += `<div class="pytest-card"><div class="num orange">${pt.errors}</div><div class="lbl">Errors</div></div>`;
      html += `<div class="pytest-card"><div class="num gray">${pt.skipped}</div><div class="lbl">Skipped</div></div>`;
      html += `<div class="pytest-card"><div class="num${pt.pass_rate >= 1 ? ' green' : ''}">${(pt.pass_rate * 100).toFixed(1)}%</div><div class="lbl">Pass Rate</div></div>`;
      html += '</div></div>';
    }

    if (caseData.tool_usage) {
      html += this.renderToolUsage(caseData.tool_usage);
    }

    html += '</div>';
    container.innerHTML = html;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => this._animateBars());
    });
  },

  _infoRow(label, value) {
    return `<div class="detail-info-row">
      <span class="di-label">${label}</span>
      <span class="di-value">${value}</span>
    </div>`;
  },

  TOOL_DISPLAY_NAMES: {
    'Search': 'Web Search',
    'LinkSummary': 'Link Summary',
  },

  renderToolUsage(usage) {
    const entries = Object.entries(usage).sort((a, b) => b[1] - a[1]);
    const maxVal = Math.max(...entries.map(e => e[1]), 1);
    let html = '<div class="detail-card tool-chart-section"><h3>Tool Usage</h3>';
    entries.forEach(([tool, count], i) => {
      const displayName = this.TOOL_DISPLAY_NAMES[tool] || tool;
      const pct = (count / maxVal) * 100;
      const colorClass = `bar-c${i % 6}`;
      html += `<div class="tool-bar-row">
        <span class="tool-bar-label">${displayName}</span>
        <div class="tool-bar-track">
          <div class="tool-bar-fill ${colorClass}" data-width="${pct}"></div>
        </div>
        <span class="tool-bar-count">${count}</span>
      </div>`;
    });
    html += '</div>';
    return html;
  },

  _animateBars() {
    document.querySelectorAll('.tool-bar-fill[data-width]').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.dataset.width + '%';
        const countEl = bar.closest('.tool-bar-row')?.querySelector('.tool-bar-count');
        if (countEl) countEl.classList.add('visible');
      }, i * 100);
    });
  }
};
