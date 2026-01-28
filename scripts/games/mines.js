(function(){
  const gridEl = document.querySelector('[data-mines-grid]');
  const betEl = document.querySelector('[data-mines-bet]');
  const minesEl = document.querySelector('[data-mines-mines]');
  const startBtn = document.querySelector('[data-mines-start]');
  const cashBtn = document.querySelector('[data-mines-cash]');
  const resetBtn = document.querySelector('[data-mines-reset]');
  const statusEl = document.querySelector('[data-mines-status]');
  const minesCountEl = document.querySelector('[data-mines-count]');
  const safeEl = document.querySelector('[data-mines-safe]');
  const mEl = document.querySelector('[data-mines-m]');

  if(!gridEl || !window.MTMWallet) return;

  window.MTMWallet.mountUI();

  const N = 25;
  const EDGE = 0.03; // small house edge for feel

  let cells = [];
  let active = false;
  let mineSet = new Set();
  let revealed = new Set();
  let bet = 0;

  function setStatus(t){ statusEl.textContent = t; }
  function clampInt(v, min, max){
    const n = Math.floor(Number(v)||0);
    return Math.max(min, Math.min(max, n));
  }

  function buildGrid(){
    gridEl.innerHTML = '';
    cells = [];
    for(let i=0; i<N; i++){
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'minecell';
      btn.setAttribute('aria-label', `Tile ${i+1}`);
      btn.dataset.i = String(i);
      const dot = document.createElement('span');
      dot.className = 'minecell__dot';
      btn.appendChild(dot);
      btn.addEventListener('click', () => onPick(i));
      gridEl.appendChild(btn);
      cells.push(btn);
    }
  }

  function placeMines(count){
    mineSet = new Set();
    while(mineSet.size < count){
      mineSet.add(Math.floor(Math.random()*N));
    }
  }

  function multiplierFor(safePicks, mineCount){
    // Fair-ish multiplier based on conditional probability of surviving each pick.
    // m = Π (remaining tiles / remaining safe tiles)
    let m = 1;
    const total = N;
    const safeTotal = total - mineCount;
    for(let i=0; i<safePicks; i++){
      m *= (total - i) / (safeTotal - i);
    }
    m *= (1 - EDGE);
    return Math.max(1, m);
  }

  function renderStats(){
    const mineCount = clampInt(minesEl.value, 1, 24);
    minesCountEl.textContent = String(mineCount);
    safeEl.textContent = String(revealed.size);
    const m = active ? multiplierFor(revealed.size, mineCount) : 1;
    mEl.textContent = `${m.toFixed(2)}×`;
  }

  function setButtons(){
    startBtn.disabled = active;
    cashBtn.disabled = !active || revealed.size === 0;
  }

  function lockGrid(lock){
    for(const c of cells){
      c.disabled = lock;
      c.classList.toggle('minecell--disabled', lock);
    }
  }

  function start(){
    const mineCount = clampInt(minesEl.value, 1, 24);
    const b = clampInt(betEl.value, 1, 1_000_000);

    if(!window.MTMWallet.canAfford(b)){
      setStatus('Not enough credits for that bet.');
      return;
    }
    window.MTMWallet.spend(b);
    bet = b;
    active = true;
    revealed = new Set();
    buildGrid();
    placeMines(mineCount);
    setStatus('Round started — click tiles. Cash out any time.');
    renderStats();
    setButtons();
    lockGrid(false);
  }

  function endRound(message, revealAll=false){
    active = false;
    if(revealAll){
      for(let i=0; i<N; i++){
        if(mineSet.has(i)){
          cells[i].classList.add('minecell--boom');
        }
      }
    }
    lockGrid(true);
    setStatus(message);
    renderStats();
    setButtons();
  }

  function cashOut(){
    if(!active || revealed.size === 0) return;
    const mineCount = clampInt(minesEl.value, 1, 24);
    const m = multiplierFor(revealed.size, mineCount);
    const payout = Math.floor(bet * m);
    window.MTMWallet.add(payout);
    endRound(`✅ Cashed out for ${payout.toLocaleString()} credits at ${m.toFixed(2)}×.`, true);
  }

  function onPick(i){
    if(!active) return;
    if(revealed.has(i)) return;

    if(mineSet.has(i)){
      cells[i].classList.add('minecell--boom');
      endRound(`💥 Mine! You lost ${bet.toLocaleString()} credits.`, true);
      return;
    }

    revealed.add(i);
    cells[i].classList.add('minecell--safe');
    renderStats();
    setButtons();

    const mineCount = clampInt(minesEl.value, 1, 24);
    const safeTotal = N - mineCount;
    if(revealed.size >= safeTotal){
      // cleared all safe tiles
      const m = multiplierFor(revealed.size, mineCount);
      const payout = Math.floor(bet * m);
      window.MTMWallet.add(payout);
      endRound(`🏆 Perfect clear! Won ${payout.toLocaleString()} credits at ${m.toFixed(2)}×.`, true);
      return;
    }
    const m = multiplierFor(revealed.size, mineCount);
    setStatus(`Safe! Current: ${m.toFixed(2)}× — cash out or keep going.`);
  }

  function reset(){
    active = false;
    bet = 0;
    revealed = new Set();
    mineSet = new Set();
    buildGrid();
    lockGrid(true);
    setStatus('Set your bet + mines, then press Start.');
    renderStats();
    setButtons();
  }

  minesEl.addEventListener('change', () => {
    minesEl.value = String(clampInt(minesEl.value, 1, 24));
    renderStats();
  });
  betEl.addEventListener('change', () => {
    betEl.value = String(clampInt(betEl.value, 1, 1_000_000));
  });
  startBtn.addEventListener('click', start);
  cashBtn.addEventListener('click', cashOut);
  resetBtn.addEventListener('click', reset);

  reset();
})();
