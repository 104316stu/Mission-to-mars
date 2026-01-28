(function(){
  const boardEl = document.querySelector('[data-towers-board]');
  const betEl = document.querySelector('[data-towers-bet]');
  const diffEl = document.querySelector('[data-towers-diff]');
  const startBtn = document.querySelector('[data-towers-start]');
  const cashBtn = document.querySelector('[data-towers-cash]');
  const resetBtn = document.querySelector('[data-towers-reset]');
  const statusEl = document.querySelector('[data-towers-status]');
  const floorEl = document.querySelector('[data-towers-floor]');
  const mEl = document.querySelector('[data-towers-m]');

  if(!boardEl || !window.MTMWallet) return;
  window.MTMWallet.mountUI();

  const FLOORS = 8;
  const COLS = 3;
  const EDGE = 0.03;

  let bet = 0;
  let active = false;
  let floor = 0; // 0..FLOORS
  let traps = []; // array of trap col for each floor or set if hard

  function setStatus(t){ statusEl.textContent = t; }
  function clampInt(v, min, max){
    const n = Math.floor(Number(v)||0);
    return Math.max(min, Math.min(max, n));
  }

  function bombsPerFloor(){
    return diffEl && diffEl.value === 'hard' ? 2 : 1;
  }

  function multiplierFor(safeFloors, bombs){
    // Each floor: chance of safe pick = (3 - bombs) / 3
    // Fair-ish multiplier: (3/(3-bombs))^k, with small edge.
    const base = 3 / (3 - bombs);
    const m = Math.pow(base, safeFloors) * (1 - EDGE);
    return Math.max(1, m);
  }

  function renderStats(){
    floorEl.textContent = String(floor);
    const m = active ? multiplierFor(floor, bombsPerFloor()) : 1;
    mEl.textContent = `${m.toFixed(2)}×`;
  }

  function setButtons(){
    startBtn.disabled = active;
    cashBtn.disabled = !active || floor === 0;
  }

  function buildBoard(){
    boardEl.innerHTML = '';
    for(let r=0; r<FLOORS; r++){
      const row = document.createElement('div');
      row.className = 'towerrow';
      row.dataset.r = String(r);
      for(let c=0; c<COLS; c++){
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'towerdoor';
        b.dataset.r = String(r);
        b.dataset.c = String(c);
        b.setAttribute('aria-label', `Floor ${FLOORS - r}, door ${c+1}`);
        b.appendChild(Object.assign(document.createElement('span'), { className: 'towerdoor__dot' }));
        b.addEventListener('click', () => onPick(r, c));
        row.appendChild(b);
      }
      boardEl.appendChild(row);
    }
  }

  function lockAll(lock){
    boardEl.querySelectorAll('button').forEach(btn => btn.disabled = lock);
  }

  function setActiveRow(r){
    boardEl.querySelectorAll('.towerdoor').forEach(btn => btn.classList.remove('towerdoor--active'));
    if(r < 0 || r >= FLOORS) return;
    boardEl.querySelectorAll(`.towerdoor[data-r="${r}"]`).forEach(btn => {
      btn.classList.add('towerdoor--active');
      btn.disabled = false;
    });
    // disable other floors
    boardEl.querySelectorAll('.towerdoor').forEach(btn => {
      if(btn.dataset.r !== String(r)) btn.disabled = true;
    });
  }

  function generateTraps(){
    traps = [];
    const bombs = bombsPerFloor();
    for(let r=0; r<FLOORS; r++){
      // pick bombs unique columns
      const set = new Set();
      while(set.size < bombs){
        set.add(Math.floor(Math.random()*COLS));
      }
      traps.push(set);
    }
  }

  function revealAll(){
    for(let r=0; r<FLOORS; r++){
      for(let c=0; c<COLS; c++){
        const btn = boardEl.querySelector(`.towerdoor[data-r="${r}"][data-c="${c}"]`);
        if(!btn) continue;
        const isTrap = traps[r].has(c);
        btn.classList.add(isTrap ? 'towerdoor--boom' : 'towerdoor--safe');
      }
    }
  }

  function start(){
    const b = clampInt(betEl.value, 1, 1_000_000);
    if(!window.MTMWallet.canAfford(b)){
      setStatus('Not enough credits for that bet.');
      return;
    }
    window.MTMWallet.spend(b);
    bet = b;
    active = true;
    floor = 0;
    buildBoard();
    generateTraps();
    setActiveRow(FLOORS-1); // bottom row first
    setStatus('Round started — pick a door on the bottom floor.');
    renderStats();
    setButtons();
  }

  function endRound(message){
    active = false;
    lockAll(true);
    revealAll();
    setStatus(message);
    renderStats();
    setButtons();
  }

  function cashOut(){
    if(!active || floor === 0) return;
    const m = multiplierFor(floor, bombsPerFloor());
    const payout = Math.floor(bet * m);
    window.MTMWallet.add(payout);
    endRound(`✅ Cashed out for ${payout.toLocaleString()} credits at ${m.toFixed(2)}×.`);
  }

  function onPick(r, c){
    if(!active) return;
    // playable row index for current floor count: bottom is FLOORS-1, then ...
    const currentRow = FLOORS - 1 - floor;
    if(r !== currentRow) return;

    const btn = boardEl.querySelector(`.towerdoor[data-r="${r}"][data-c="${c}"]`);
    if(!btn || btn.disabled) return;

    const isTrap = traps[r].has(c);
    btn.classList.remove('towerdoor--active');
    btn.classList.add(isTrap ? 'towerdoor--boom' : 'towerdoor--safe');

    // lock row after pick
    boardEl.querySelectorAll(`.towerdoor[data-r="${r}"]`).forEach(b => b.disabled = true);

    if(isTrap){
      endRound(`💥 Trap! You lost ${bet.toLocaleString()} credits.`);
      return;
    }

    floor += 1;
    renderStats();
    setButtons();

    if(floor >= FLOORS){
      const m = multiplierFor(floor, bombsPerFloor());
      const payout = Math.floor(bet * m);
      window.MTMWallet.add(payout);
      endRound(`🏆 Reached the top! Won ${payout.toLocaleString()} credits at ${m.toFixed(2)}×.`);
      return;
    }

    const nextRow = FLOORS - 1 - floor;
    setActiveRow(nextRow);
    const m = multiplierFor(floor, bombsPerFloor());
    setStatus(`Safe! Now at ${m.toFixed(2)}× — cash out or climb higher.`);
  }

  function reset(){
    active = false;
    bet = 0;
    floor = 0;
    buildBoard();
    lockAll(true);
    setStatus('Set your bet + difficulty, then press Start.');
    renderStats();
    setButtons();
  }

  betEl.addEventListener('change', () => {
    betEl.value = String(clampInt(betEl.value, 1, 1_000_000));
  });
  startBtn.addEventListener('click', start);
  cashBtn.addEventListener('click', cashOut);
  resetBtn.addEventListener('click', reset);

  reset();
})();
