const MODAL_ID = 'global-dialog-modal'
const _lastFetched = {}
const _lastRenderOpts = {}

function debounce(fn, wait = 250) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}

function ensureModal() {
  let modal = document.getElementById(MODAL_ID)
  if (modal) return modal

  modal = document.createElement('div')
  modal.id = MODAL_ID
  modal.style.cssText = `position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9999;`;
  modal.innerHTML = `
    <div style="background:#fff;border-radius:8px;max-width:880px;width:94%;max-height:84%;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.25);display:flex;flex-direction:column;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #eee;">
        <strong id="gd-title">List</strong>
        <button id="gd-close" style="border:0;background:transparent;font-size:18px;cursor:pointer;padding:6px 10px;">✕</button>
      </div>
      <div style="padding:10px 12px;border-bottom:1px solid #f2f2f2;">
        <input id="gd-search" placeholder="Search..." style="width:100%;padding:8px 10px;border:1px solid #e6e6e6;border-radius:6px;" />
      </div>
      <div id="gd-body" style="padding:12px;overflow:auto;flex:1 1 auto;"></div>
    </div>`
  document.body.appendChild(modal)

  modal.querySelector('#gd-close').addEventListener('click', () => closeModal())
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal() })
  // attach search handler
  const search = modal.querySelector('#gd-search')
  if (search) {
    const onSearch = debounce((e) => {
      const q = e.target.value.trim().toLowerCase()
      const bodyEl = modal.querySelector('#gd-body')
      const type = modal.dataset.type || ''
      const items = (_lastFetched[type] || [])
      const opts = _lastRenderOpts[type] || { show: modal.dataset.show || '' }
      if (!q) return renderTable(bodyEl, items, opts)
      const filtered = items.filter(it => {
        return Object.values(it).some(v => (v || '').toString().toLowerCase().includes(q))
      })
      renderTable(bodyEl, filtered, opts)
    }, 220)
    search.addEventListener('input', onSearch)
  }
  return modal
}

function openModal(title) {
  const modal = ensureModal()
  modal.style.display = 'flex'
  modal.querySelector('#gd-title').textContent = title || 'List'
  return modal.querySelector('#gd-body')
}

function closeModal() {
  const modal = document.getElementById(MODAL_ID)
  if (modal) modal.style.display = 'none'
}

async function fetchList(type, options = {}) {
  const url = options.url || '/api/dialog/list'
  const body = { type, show: options.show || '', params: options.params || {} }
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error('Server error: ' + res.status)
  return res.json()
}

function renderTable(container, items, opts = {}) {
  container.innerHTML = ''
  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = '<div style="padding:18px;color:#666">No records found.</div>'
    return
  }

  const show = (opts.show || '').split(',').map(s => s.trim()).filter(Boolean)
  const columns = show.length ? show : Object.keys(items[0])

  const table = document.createElement('table')
  table.style.width = '100%'
  table.style.borderCollapse = 'collapse'
  const thead = document.createElement('thead')
  const trh = document.createElement('tr')
  columns.forEach(col => {
    const th = document.createElement('th')
    th.textContent = col
    th.style.borderBottom = '1px solid #eee'
    th.style.padding = '8px'
    trh.appendChild(th)
  })
  thead.appendChild(trh)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  items.forEach(item => {
    const tr = document.createElement('tr')
    tr.style.cursor = 'pointer'
    tr.addEventListener('click', () => {
      if (opts.onSelect) opts.onSelect(item)
    })
    columns.forEach(col => {
      const td = document.createElement('td')
      td.textContent = (item[col] !== undefined && item[col] !== null) ? item[col] : ''
      td.style.padding = '8px'
      td.style.borderBottom = '1px solid #f2f2f2'
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)
  container.appendChild(table)
}

function attachToInputs(root = document) {
  const inputs = Array.from(root.querySelectorAll('[data-dialog="true"]'))
  inputs.forEach(inp => {
    if (inp._gd_attached) return
    inp._gd_attached = true
    inp.addEventListener('focus', (e) => openForElement(inp))
    inp.addEventListener('click', (e) => openForElement(inp))
  })
}

async function openForElement(el, options = {}) {
  const type = el.dataset.type
  if (!type) return console.warn('data-type missing for dialog input')

  const show = options.show || el.dataset.show || ''
  const params = options.params || (el.dataset.params ? JSON.parse(el.dataset.params) : {})
  const url = options.url || el.dataset.url || '/api/dialog/list'

  const body = await fetchList(type, { show, params, url })
  const container = openModal(type)
  // store fetched items for search filtering
  const modal = document.getElementById(MODAL_ID)
  if (modal) {
    modal.dataset.type = type
    modal.dataset.show = show
    const searchInput = modal.querySelector('#gd-search')
    if (searchInput) searchInput.value = ''
  }
  _lastFetched[type] = Array.isArray(body) ? body : (body && body.rows) || []
  const renderOpts = {
    show,
    onSelect(item) {
      // If selecting an employee, format as "Firstname Lastname, Position"
      const isEmployeeType = (type || '').toString().toLowerCase() === 'employees' || item.firstname || item.lastname || item.experience

      if (isEmployeeType) {
        let first = item.firstname || item.first_name || item.first || ''
        let last = item.lastname || item.last_name || item.last || ''
        // Fallback to common fields
        if (!first && item.name) {
          const parts = item.name.split(' ')
          first = parts[0]
          last = parts.slice(1).join(' ')
        }

        // Extract position from item.position or from experience JSON
        let position = item.position || item.job_title || ''
        if (!position && item.experience) {
          try {
            const exp = (typeof item.experience === 'string') ? JSON.parse(item.experience) : item.experience
            const firstEntry = exp && exp.lists ? exp.lists[0] : exp && Array.isArray(exp) ? exp[0] : null
            if (firstEntry) position = firstEntry.position || firstEntry.job_title || ''
          } catch (e) {
            // ignore parse errors
          }
        }

        const name = `${(first || '').toString().trim()} ${(last || '').toString().trim()}`.trim()
        el.value = position ? `${name}, ${position}` : name || JSON.stringify(item)
      } else {
        const displayField = el.dataset.display || (show.split(',')[0] || Object.keys(item)[0])
        el.value = item[displayField] !== undefined ? item[displayField] : JSON.stringify(item)
      }
      closeModal()
      const ev = new CustomEvent('dialog:selected', { detail: { element: el, item } })
      el.dispatchEvent(ev)
    }
  }
  _lastRenderOpts[type] = renderOpts
  renderTable(container, body, renderOpts)
}

function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => attachToInputs(document))
  } else {
    attachToInputs(document)
  }
  const obs = new MutationObserver(mutations => {
    mutations.forEach(m => { if (m.addedNodes.length) attachToInputs(document) })
  })
  obs.observe(document.documentElement || document.body, { childList: true, subtree: true })
}

const api = { init, openForElement, fetchList, attachToInputs }
if (typeof window !== 'undefined') window.GlobalDialog = api
export default api
