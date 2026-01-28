(function(){
  const canvas = document.querySelector('[data-crash-canvas]');
  const startBtn = document.querySelector('[data-crash-start]');
  const cashBtn = document.querySelector('[data-crash-cash]');
  const resetBtn = document.querySelector('[data-crash-reset]');
  const statusEl = document.querySelector('[data-crash-status]');
  const mEl = document.querySelector('[data-crash-m]');
  const targetEl = document.querySelector('[data-crash-target]');
  const betEl = document.querySelector('[data-crash-bet]');

  if(!canvas || !window.MTMWallet) return;

  window.MTMWallet.mountUI();

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  let raf = null;
  let running = false;
  let crashed = false;
  let t = 0;
  let m = 1;
  let crashAt = 1.5;
  let cashOutAt = null;
  let bet = 0;

  function setStatus(s){ statusEl.textContent = s; }

  function sampleCrash(){
    // Distribution: P(X >= x) = 1/x for x>=1  (classic crash-style)
    const u = Math.random();
    const x = 1 / (1 - u);
    return Math.min(30, Math.max(1.05, x));
  }

  function reset(){
    if(raf) cancelAnimationFrame(raf);
    raf = null;
    running = false;
    crashed = false;
    t = 0;
    m = 1;
    cashOutAt = null;
    crashAt = sampleCrash();
    targetEl.textContent = '—';
    mEl.textContent = '1.00×';
    startBtn.disabled = false;
    cashBtn.disabled = true;
    bet = 0;
    setStatus('Set your bet, then press Start. Cash out before the crash.');
    draw();
  }

  function start(){
    if(running) return;
    // Take bet up front
    const b = Math.max(1, Math.floor(Number(betEl?.value)||0));
    if(!window.MTMWallet.canAfford(b)){
      setStatus('Not enough credits for that bet.');
      return;
    }
    reset();
    window.MTMWallet.spend(b);
    bet = b;
    running = true;
    startBtn.disabled = true;
    cashBtn.disabled = false;
    setStatus('Running… cash out any time.');
    tick();
  }

  function cashOut(){
    if(!running || crashed || cashOutAt !== null) return;
    cashOutAt = m;
    cashBtn.disabled = true;
    const payout = Math.floor(bet * cashOutAt);
    window.MTMWallet.add(payout);
    setStatus(`✅ Cashed out at ${cashOutAt.toFixed(2)}× → won ${payout.toLocaleString()} credits. Waiting for crash…`);
  }

  function update(){
    if(!running || crashed) return;
    t += 1;
    // Smooth growth curve
    m = 1 + Math.pow(t / 140, 1.35);
    if(m >= crashAt){
      crashed = true;
      running = false;
      cashBtn.disabled = true;
      targetEl.textContent = `${crashAt.toFixed(2)}×`;
      if(cashOutAt !== null){
        setStatus(`💥 Crash at ${crashAt.toFixed(2)}× — you already cashed out. Nice.`);
      } else {
        setStatus(`💥 Crash at ${crashAt.toFixed(2)}× — you lost ${bet.toLocaleString()} credits.`);
      }
    }
    mEl.textContent = `${m.toFixed(2)}×`;
  }

  function draw(){
    ctx.clearRect(0,0,W,H);

    // axes
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(46, 16);
    ctx.lineTo(46, H-28);
    ctx.lineTo(W-16, H-28);
    ctx.stroke();

    // plot line based on current t
    const maxT = Math.max(220, t + 30);
    const maxM = Math.min(8, Math.max(3, m + 0.6));

    function px(tt){
      return 46 + (tt / maxT) * (W-62);
    }
    function py(mm){
      return (H-28) - ((mm-1) / (maxM-1)) * (H-54);
    }

    ctx.strokeStyle = 'rgba(77,227,255,0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px(0), py(1));
    for(let tt=0; tt<=t; tt+=2){
      const mm = 1 + Math.pow(tt / 140, 1.35);
      ctx.lineTo(px(tt), py(Math.min(mm, maxM)));
    }
    ctx.stroke();

    // current dot
    ctx.fillStyle = 'rgba(77,227,255,0.95)';
    ctx.beginPath();
    ctx.arc(px(t), py(Math.min(m, maxM)), 5, 0, Math.PI*2);
    ctx.fill();

    // cashout marker
    if(cashOutAt !== null){
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.arc(px(t), py(Math.min(cashOutAt, maxM)), 4, 0, Math.PI*2);
      ctx.fill();
    }

    // labels
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = '700 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('multiplier', 46, 14);
  }

  function tick(){
    update();
    draw();
    if(running) raf = requestAnimationFrame(tick);
  }

  if(betEl){
    betEl.addEventListener('change', () => {
      const b = Math.max(1, Math.floor(Number(betEl.value)||0));
      betEl.value = String(b);
    });
  }

  startBtn.addEventListener('click', start);
  cashBtn.addEventListener('click', cashOut);
  resetBtn.addEventListener('click', reset);

  reset();
})();
