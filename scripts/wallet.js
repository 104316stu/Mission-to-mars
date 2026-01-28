(function(){
  const KEY = 'mtm_wallet_v1';
  const DEFAULT = 1000;

  function read(){
    try{
      const v = Number(localStorage.getItem(KEY));
      return Number.isFinite(v) && v >= 0 ? v : DEFAULT;
    }catch(_){
      return DEFAULT;
    }
  }

  function write(v){
    const n = Math.max(0, Math.floor(Number(v) || 0));
    try{ localStorage.setItem(KEY, String(n)); }catch(_){/* ignore */}
    notify(n);
    return n;
  }

  function format(n){
    return `${Math.floor(n).toLocaleString()} cr`;
  }

  const listeners = new Set();
  function notify(n){
    for(const fn of listeners){
      try{ fn(n); }catch(_){/* ignore */}
    }
  }

  function onChange(fn){
    listeners.add(fn);
    fn(read());
    return () => listeners.delete(fn);
  }

  function add(delta){
    return write(read() + Number(delta || 0));
  }

  function canAfford(amount){
    const a = Math.floor(Number(amount) || 0);
    return a > 0 && read() >= a;
  }

  function spend(amount){
    const a = Math.floor(Number(amount) || 0);
    if(a <= 0) return { ok:false, balance: read() };
    const b = read();
    if(b < a) return { ok:false, balance: b };
    return { ok:true, balance: write(b - a) };
  }

  function set(amount){
    return write(amount);
  }

  // Optional UI wiring
  function mountUI(root=document){
    const balanceEls = root.querySelectorAll('[data-wallet-balance]');
    const resetBtns = root.querySelectorAll('[data-wallet-reset]');
    const addBtns = root.querySelectorAll('[data-wallet-add]');

    onChange((bal) => {
      balanceEls.forEach(el => el.textContent = format(bal));
    });

    resetBtns.forEach(btn => {
      btn.addEventListener('click', () => set(DEFAULT));
    });

    addBtns.forEach(btn => {
      btn.addEventListener('click', () => add(DEFAULT));
    });
  }

  // Expose
  window.MTMWallet = { read, write, set, add, spend, canAfford, format, onChange, mountUI, DEFAULT };
})();
