const moment = require('moment');

function formatDate(date, format = "YYYY-MM-DD HH:mm:ss") {
    return moment(date).format(format);
}

function formatCurrency(amount) {
    return Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function progressBar(length, progress, options = {}) {
  // Guard: validate inputs
  if (
    typeof length !== 'number' || length <= 0 ||
    typeof progress !== 'number' || isNaN(progress) || progress <= 0
  ) {
    return '';
  }

  const {
    height = '15px',
    color = null,
    animated = false,
    label = null,
    showPercent = false,
  } = options;

  // Clamp progress between 0 and length
  const clampedProgress = Math.min(Math.max(progress, 0), length);
  const step = Math.floor(clampedProgress);
  const percent = Number((clampedProgress / length) * 100).toFixed(2);

  const tooltipLabel = label ?? step;
  const colorStyle = color ? `background-color: ${color};` : '';
  const animatedClass = animated ? ' progress-bar-striped progress-bar-animated' : '';
  const percentText = showPercent ? `${percent}%` : '';

  return `
    <div class="progress progress-sm" style="height: ${height};" role="progressbar" aria-label="Progress" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
      <div
        class="progress-bar${animatedClass}"
        style="width: ${percent}%; ${colorStyle}"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-title="${tooltipLabel}"
      >${percentText}</div>
    </div>
  `.trim();
}

function normalizeAmount(val) {
  if (!val) return 0;
  const num = parseFloat(val.replace(/,/g, ''));
  return Number.isNaN(num) ? 0 : num;
}

function normalizeObjCode(code) {
  if (!code) return null;
  // remove spaces and ensure dash format
  const cleaned = code.replace(/\s+/g, '');
  // if it’s 10 digits without a dash, insert one before the last two digits
  return cleaned.match(/^\d{10}$/)
    ? cleaned.slice(0, 8) + '-' + cleaned.slice(8)
    : cleaned;
}

module.exports = { formatDate, formatCurrency, progressBar, normalizeAmount, normalizeObjCode };