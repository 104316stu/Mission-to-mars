(function(){
  const canvas = document.querySelector('[data-plinko-canvas]');
  const dropBtn = document.querySelector('[data-plinko-drop]');
  const resetBtn = document.querySelector('[data-plinko-reset]');
  const statusEl = document.querySelector('[data-plinko-status]');
  const lastEl = document.querySelector('[data-plinko-last]');
  const betEl = document.querySelector('[data-plinko-bet]');

  if(!canvas || !window.MTMWallet) return;
  window.MTMWallet.mountUI();

  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const pegR = 7;
  const ballR = 9;
  const g = 0.38;
  const damping = 0.98;

  const slots = 9;
  const slotW = W / slots;
  const multipliers = [0.2, 0.5, 1, 2, 5, 2, 1, 0.5, 0.2];

  let pegs = [];
  let ball = null;
  let running = false;
  let raf = null;
  let activeBet = 0;

  function setStatus(t){ statusEl.textContent = t; }
  function clampInt(v, min, max){
    const n = Math.floor(Number(v)||0);
    return Math.max(min, Math.min(max, n));
  }

  function buildPegs(){
    pegs = [];
    const rows = 9;
    const top = 90;
    const vGap = 55;
    for(let r=0; r<rows; r++){
      const count = r%2===0 ? 8 : 7;
      const xOff = r%2===0 ? 0 : slotW/2;
      const y = top + r*vGap;
      for(let i=0; i<count; i++){
        pegs.push({x: (i+1)*slotW + xOff - slotW/2, y});
      }
    }
  }

  function spawnBall(){
    if(ball) return;
    const b = clampInt(betEl.value, 1, 1_000_000);
    if(!window.MTMWallet.canAfford(b)){
      setStatus('Not enough credits for that bet.');
      return;
    }
    window.MTMWallet.spend(b);
    activeBet = b;

    ball = {
      x: W/2 + (Math.random()*30-15),
      y: 30,
      vx: (Math.random()*1.2-0.6),
      vy: 0
    };
    running = true;
    dropBtn.disabled = true;
    setStatus('Dropping…');
    tick();
  }

  function reset(){
    ball = null;
    running = false;
    activeBet = 0;
    dropBtn.disabled = false;
    if(raf) cancelAnimationFrame(raf);
    raf = null;
    lastEl.textContent = '—';
    setStatus('Set your bet, then press Drop.');
    draw();
  }

  function collideWithPeg(px, py){
    const dx = ball.x - px;
    const dy = ball.y - py;
    const dist = Math.hypot(dx,dy);
    const minD = pegR + ballR;
    if(dist >= minD || dist === 0) return;
    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = minD - dist;
    ball.x += nx * overlap;
    ball.y += ny * overlap;
    const vn = ball.vx*nx + ball.vy*ny;
    ball.vx -= 1.85 * vn * nx;
    ball.vy -= 1.85 * vn * ny;
    ball.vx += (Math.random()*0.18-0.09);
  }

  function update(){
    if(!ball) return;

    ball.vy += g;
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vx *= damping;
    ball.vy *= damping;

    if(ball.x < ballR){ ball.x = ballR; ball.vx = Math.abs(ball.vx); }
    if(ball.x > W-ballR){ ball.x = W-ballR; ball.vx = -Math.abs(ball.vx); }

    for(const p of pegs) collideWithPeg(p.x, p.y);

    if(ball.y > H - 26){
      const slot = Math.max(0, Math.min(slots-1, Math.floor(ball.x / slotW)));
      const m = multipliers[slot];
      const payout = Math.floor(activeBet * m);
      window.MTMWallet.add(payout);
      lastEl.textContent = `${m.toFixed(2)}× → ${payout.toLocaleString()} cr`;
      setStatus(`Landed in slot ${slot+1}: ${m.toFixed(2)}×`);
      ball = null;
      running = false;
      activeBet = 0;
      dropBtn.disabled = false;
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);

    const grad = ctx.createRadialGradient(W*0.3, H*0.1, 20, W*0.3, H*0.1, H);
    grad.addColorStop(0, 'rgba(77,227,255,0.10)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,H);

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    for(const p of pegs){
      ctx.beginPath();
      ctx.arc(p.x, p.y, pegR, 0, Math.PI*2);
      ctx.fill();
    }

    for(let i=0; i<slots; i++){
      ctx.fillStyle = i%2===0 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.10)';
      ctx.fillRect(i*slotW, H-40, slotW, 40);
      ctx.fillStyle = 'rgba(255,255,255,0.70)';
      ctx.font = '800 14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(multipliers[i]), i*slotW + slotW/2, H-20);
    }

    if(ball){
      ctx.fillStyle = 'rgba(77,227,255,0.95)';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballR, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function tick(){
    update();
    draw();
    if(running) raf = requestAnimationFrame(tick);
  }

  betEl.addEventListener('change', () => {
    betEl.value = String(clampInt(betEl.value, 1, 1_000_000));
  });
  dropBtn.addEventListener('click', spawnBall);
  resetBtn.addEventListener('click', reset);

  buildPegs();
  reset();
})();
