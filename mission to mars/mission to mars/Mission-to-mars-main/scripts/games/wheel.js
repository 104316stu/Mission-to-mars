(function(){
  const canvas = document.querySelector('[data-wheel-canvas]');
  const spinBtn = document.querySelector('[data-wheel-spin]');
  const resetBtn = document.querySelector('[data-wheel-reset]');
  const betEl = document.querySelector('[data-wheel-bet]');
  const lastEl = document.querySelector('[data-wheel-last]');
  const statusEl = document.querySelector('[data-wheel-status]');

  if(!canvas || !window.MTMWallet) return;
  window.MTMWallet.mountUI();

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const cx = W/2;
  const cy = H/2;
  const R = Math.min(W,H)*0.46;

  const prizes = [
    { label: '5 cr', value: 5, weight: 24 },
    { label: '10 cr', value: 10, weight: 22 },
    { label: '25 cr', value: 25, weight: 16 },
    { label: '50 cr', value: 50, weight: 12 },
    { label: '100 cr', value: 100, weight: 9 },
    { label: '250 cr', value: 250, weight: 6 },
    { label: '1,000 cr', value: 1000, weight: 2.0 },
    { label: '5,000 cr', value: 5000, weight: 0.45 },
    { label: '10,000 cr', value: 10000, weight: 0.18 },
    { label: 'Space Supercar', value: 250000, weight: 0.05 }
  ];

  // Precompute segment angles (equal sized segments for clarity)
  const segCount = prizes.length;
  const segAngle = (Math.PI * 2) / segCount;

  let angle = -Math.PI/2; // start with segment center at top
  let spinning = false;
  let raf = null;

  function setStatus(t){ statusEl.textContent = t; }
  function clampInt(v, min, max){
    const n = Math.floor(Number(v)||0);
    return Math.max(min, Math.min(max, n));
  }

  function pickWeighted(){
    const total = prizes.reduce((s,p)=>s+p.weight,0);
    let r = Math.random() * total;
    for(let i=0; i<prizes.length; i++){
      r -= prizes[i].weight;
      if(r <= 0) return i;
    }
    return prizes.length-1;
  }

  function draw(){
    ctx.clearRect(0,0,W,H);

    // base glow
    const g = ctx.createRadialGradient(cx, cy, 20, cx, cy, R*1.2);
    g.addColorStop(0, 'rgba(77,227,255,0.18)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    // segments
    for(let i=0; i<segCount; i++){
      const a0 = angle + i*segAngle;
      const a1 = a0 + segAngle;
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,R,a0,a1);
      ctx.closePath();
      ctx.fillStyle = i%2===0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // label
      const mid = (a0+a1)/2;
      ctx.save();
      ctx.translate(cx,cy);
      ctx.rotate(mid);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = '800 16px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillText(prizes[i].label, R-14, 0);
      ctx.restore();
    }

    // hub
    ctx.beginPath();
    ctx.arc(cx,cy,R*0.18,0,Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '900 14px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', cx, cy);
  }

  function easeOutCubic(x){ return 1 - Math.pow(1-x, 3); }

  function spin(){
    if(spinning) return;
    const cost = clampInt(betEl.value, 1, 1_000_000);
    betEl.value = String(cost);

    if(!window.MTMWallet.canAfford(cost)){
      setStatus('Not enough credits for that spin.');
      return;
    }
    window.MTMWallet.spend(cost);

    // Select outcome (weighted), then compute target angle so that chosen segment lands at pointer (top).
    const idx = pickWeighted();
    const prize = prizes[idx];

    // We want the center of segment idx to align to top (-PI/2).
    // Current wheel angle is `angle`. Segment idx center = angle + (idx+0.5)*segAngle.
    // Solve for finalAngle such that center == -PI/2 (mod 2pi).
    const desiredCenter = -Math.PI/2;
    const currentCenter = angle + (idx + 0.5)*segAngle;
    let delta = desiredCenter - currentCenter;
    // normalize delta to [0, 2pi)
    delta = ((delta % (Math.PI*2)) + (Math.PI*2)) % (Math.PI*2);

    const spins = 6 + Math.random()*2; // full rotations
    const totalDelta = spins*(Math.PI*2) + delta;

    const start = performance.now();
    const duration = 2800 + Math.random()*600;

    spinning = true;
    spinBtn.disabled = true;
    resetBtn.disabled = true;
    setStatus('Spinning…');

    const startAngle = angle;

    function tick(now){
      const t = Math.min(1, (now - start) / duration);
      const e = easeOutCubic(t);
      angle = startAngle + totalDelta * e;
      draw();

      if(t < 1){
        raf = requestAnimationFrame(tick);
        return;
      }

      // Award prize
      window.MTMWallet.add(prize.value);
      const fancy = prize.label.toLowerCase().includes('supercar');
      lastEl.textContent = fancy ? `${prize.label} (ultra-rare!)` : `${prize.label}`;
      setStatus(fancy
        ? `🚗✨ JACKPOT! You won the ${prize.label} → +${prize.value.toLocaleString()} credits.`
        : `✅ You won ${prize.label} → +${prize.value.toLocaleString()} credits.`
      );

      spinning = false;
      spinBtn.disabled = false;
      resetBtn.disabled = false;
    }

    raf = requestAnimationFrame(tick);
  }

  function reset(){
    if(raf) cancelAnimationFrame(raf);
    raf = null;
    spinning = false;
    spinBtn.disabled = false;
    resetBtn.disabled = false;
    lastEl.textContent = '—';
    setStatus('Set spin cost, then press Spin.');
    angle = -Math.PI/2;
    draw();
  }

  betEl.addEventListener('change', () => {
    betEl.value = String(clampInt(betEl.value, 1, 1_000_000));
  });
  spinBtn.addEventListener('click', spin);
  resetBtn.addEventListener('click', reset);

  reset();
})();