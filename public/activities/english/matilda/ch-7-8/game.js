const gridLetters = [
  'KLW FJMPQXY',
  'HDHAB C JUGS',
  'NFI E WRTKLP',
  'WGSQX HJMNB',
  'OTPN ER VOU S',
  'RKELF WJHMX',
  'MDRA B NEWTQ',
  'ACFJH KLPWG',
  'CROC O DIL EZ',
  'SVXJF HKMNP'
].map(r => r.replaceAll(' ', ''));

const targets = {
  WHISPER: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2]],
  CROCODILE: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8]],
  NERVOUS: [[4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9]],
  WORM: [[3, 0], [4, 0], [5, 0], [6, 0]],
  JUG: [[1, 6], [1, 7], [1, 8]],
  NEWT: [[6, 5], [6, 6], [6, 7], [6, 8]]
};

const wordColors = {
  WHISPER: '#f3a6a6',
  CROCODILE: '#a9d99a',
  NERVOUS: '#c6b5ee',
  WORM: '#f1cf68',
  JUG: '#9ed8e6',
  NEWT: '#f4c5c4'
};

const style = document.createElement('style');
style.textContent = Object.keys(targets).map(w => `.cell.found-${w.toLowerCase()} { background: ${wordColors[w]}; }`).join('\n');
document.head.appendChild(style);

const gridEl = document.querySelector('#grid');
const wordsEl = document.querySelector('#words');
const statusEl = document.querySelector('#status');
const completeEl = document.querySelector('#complete');
const hintEl = document.querySelector('#hint');
const cells = new Map();
const found = new Set();
let firstCell = null;
let hintIndex = 0;

function key(row, col) { return `${row},${col}`; }
function cellsFor(word) { return targets[word].map(([row, col]) => key(row, col)); }
function clearSelection() {
  gridEl.querySelectorAll('.selected, .preview').forEach(cell => cell.classList.remove('selected', 'preview'));
}
function updateStatus() {
  const count = found.size;
  statusEl.innerHTML = `<strong>${count} of ${Object.keys(targets).length}</strong> words found`;
  completeEl.classList.toggle('show', count === Object.keys(targets).length);
}
function renderWords() {
  wordsEl.innerHTML = Object.keys(targets).map(word => `<li class="word${found.has(word) ? ' found' : ''}" data-word="${word}" style="--word-color: ${wordColors[word]}">${word.toLowerCase()}</li>`).join('');
}
function renderGrid() {
  gridLetters.forEach((row, rowIndex) => [...row].forEach((letter, colIndex) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.textContent = letter.toLowerCase();
    cell.dataset.row = rowIndex;
    cell.dataset.col = colIndex;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `${letter}, row ${rowIndex + 1}, column ${colIndex + 1}`);
    cell.addEventListener('click', () => chooseCell(rowIndex, colIndex));
    gridEl.appendChild(cell);
    cells.set(key(rowIndex, colIndex), cell);
  }));
}
function getSelection(startRow, startCol, endRow, endCol) {
  const rowStep = Math.sign(endRow - startRow);
  const colStep = Math.sign(endCol - startCol);
  const rowDistance = Math.abs(endRow - startRow);
  const colDistance = Math.abs(endCol - startCol);
  if (rowDistance !== 0 && colDistance !== 0 && rowDistance !== colDistance) return null;
  const distance = Math.max(rowDistance, colDistance);
  return Array.from({ length: distance + 1 }, (_, i) => key(startRow + rowStep * i, startCol + colStep * i));
}
function chooseCell(row, col) {
  const selected = key(row, col);
  if (!firstCell) {
    firstCell = [row, col];
    cells.get(selected).classList.add('selected');
    hintEl.hidden = true;
    return;
  }
  const [startRow, startCol] = firstCell;
  clearSelection();
  firstCell = null;
  const selection = getSelection(startRow, startCol, row, col);
  if (!selection) {
    statusEl.innerHTML = '<strong>Try again.</strong> Choose a straight line across, down, or diagonally.';
    return;
  }
  const reversed = [...selection].reverse();
  const match = Object.keys(targets).find(word => !found.has(word) && (selection.join('|') === cellsFor(word).join('|') || reversed.join('|') === cellsFor(word).join('|')));
  if (match) {
    found.add(match);
    selection.forEach(cellKey => {
      const cell = cells.get(cellKey);
      cell.classList.add('found', `found-${match.toLowerCase()}`);
    });
    renderWords();
    updateStatus();
    hintEl.hidden = true;
  } else {
    statusEl.innerHTML = '<strong>Not quite.</strong> Try another line.';
    updateStatus();
  }
}
function showHint() {
  const remaining = Object.keys(targets).filter(word => !found.has(word));
  if (!remaining.length) return;
  const word = remaining[hintIndex % remaining.length];
  const [row, col] = targets[word][0];
  hintIndex += 1;
  hintEl.hidden = false;
  hintEl.textContent = `Hint: ${word.toLowerCase()} starts at row ${row + 1}, column ${col + 1}.`;
  cells.get(key(row, col)).classList.add('preview');
  setTimeout(() => cells.get(key(row, col))?.classList.remove('preview'), 1200);
}
function reset() {
  found.clear();
  firstCell = null;
  hintIndex = 0;
  clearSelection();
  gridEl.querySelectorAll('.found').forEach(cell => {
    cell.classList.remove('found');
    Object.keys(targets).forEach(word => cell.classList.remove(`found-${word.toLowerCase()}`));
  });
  hintEl.hidden = true;
  renderWords();
  updateStatus();
}
document.querySelector('#hintBtn').addEventListener('click', showHint);
document.querySelector('#resetBtn').addEventListener('click', reset);
renderGrid();
renderWords();
updateStatus();
