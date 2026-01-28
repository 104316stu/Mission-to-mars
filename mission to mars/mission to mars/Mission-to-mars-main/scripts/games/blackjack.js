(function(){
  const dealerEl = document.querySelector('[data-bj-dealer]');
  const playerEl = document.querySelector('[data-bj-player]');
  const dealerScoreEl = document.querySelector('[data-bj-dealer-score]');
  const playerScoreEl = document.querySelector('[data-bj-player-score]');
  const statusEl = document.querySelector('[data-bj-status]');
  const newBtn = document.querySelector('[data-bj-new]');
  const hitBtn = document.querySelector('[data-bj-hit]');
  const standBtn = document.querySelector('[data-bj-stand]');
  const betEl = document.querySelector('[data-bj-bet]');

  if(!dealerEl || !window.MTMWallet) return;

  window.MTMWallet.mountUI();

  const suits = ['♠','♥','♦','♣'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  let deck = [];
  let dealer = [];
  let player = [];
  let hideDealerHole = true;
  let done = false;
  let bet = 0;
  let betLocked = false;

  function setStatus(t){ statusEl.textContent = t; }

  function buildDeck(){
    deck = [];
    for(const s of suits){
      for(const r of ranks){
        deck.push({r, s});
      }
    }
    // shuffle
    for(let i=deck.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function drawCard(){
    if(deck.length === 0) buildDeck();
    return deck.pop();
  }

  function value(hand){
    let total = 0;
    let aces = 0;
    for(const c of hand){
      if(c.r === 'A'){ aces++; total += 11; }
      else if(['K','Q','J'].includes(c.r)) total += 10;
      else total += Number(c.r);
    }
    while(total > 21 && aces > 0){
      total -= 10;
      aces--;
    }
    return total;
  }

  function renderHand(el, hand, hideSecond){
    el.innerHTML = '';
    hand.forEach((c, i) => {
      const d = document.createElement('div');
      d.className = 'cardchip';
      if(hideSecond && i===1){
        d.textContent = '🂠';
      } else {
        d.textContent = `${c.r}${c.s}`;
      }
      el.appendChild(d);
    });
  }

  function render(){
    renderHand(playerEl, player, false);
    renderHand(dealerEl, dealer, hideDealerHole);
    playerScoreEl.textContent = String(value(player));
    dealerScoreEl.textContent = hideDealerHole ? '—' : String(value(dealer));
  }

  function setButtons(active){
    hitBtn.disabled = !active;
    standBtn.disabled = !active;
    betEl && (betEl.disabled = betLocked);
  }

  function endGame(message){
    done = true;
    hideDealerHole = false;
    setButtons(false);
    render();
    setStatus(message);
  }

  function dealerPlay(){
    hideDealerHole = false;
    while(value(dealer) < 17){
      dealer.push(drawCard());
    }
  }

  function outcome(){
    const pv = value(player);
    const dv = value(dealer);
    if(pv > 21) return '❌ Bust — you went over 21.';
    if(dv > 21) return '✅ Dealer busts — you win!';
    if(pv > dv) return '✅ You win!';
    if(pv < dv) return '❌ Dealer wins.';
    return '🤝 Push (tie).';
  }

  function newGame(){
    // take bet up-front
    const b = Math.max(1, Math.floor(Number(betEl?.value)||0));
    if(!window.MTMWallet.canAfford(b)){
      setStatus('Not enough credits for that bet.');
      return;
    }
    window.MTMWallet.spend(b);
    bet = b;
    betLocked = true;

    buildDeck();
    dealer = [drawCard(), drawCard()];
    player = [drawCard(), drawCard()];
    hideDealerHole = true;
    done = false;
    setButtons(true);
    setStatus('Hit or Stand. Win pays 2×, blackjack pays 2.5×, push refunds.');
    render();

    const pv = value(player);
    if(pv === 21){
      dealerPlay();
      if(value(dealer) === 21){
        // push refund
        window.MTMWallet.add(bet);
        endGame('🤝 Both blackjack — push. Bet refunded.');
      } else {
        const payout = Math.floor(bet * 2.5);
        window.MTMWallet.add(payout);
        endGame(`✅ Blackjack! You win ${payout.toLocaleString()} credits.`);
      }
    }
  }

  function settle(){
    const pv = value(player);
    const dv = value(dealer);

    if(pv > 21){
      endGame(`❌ Bust — you lost ${bet.toLocaleString()} credits.`);
      return;
    }
    if(dv > 21){
      const payout = bet * 2;
      window.MTMWallet.add(payout);
      endGame(`✅ Dealer busts — you win ${payout.toLocaleString()} credits.`);
      return;
    }
    if(pv > dv){
      const payout = bet * 2;
      window.MTMWallet.add(payout);
      endGame(`✅ You win ${payout.toLocaleString()} credits.`);
      return;
    }
    if(pv < dv){
      endGame(`❌ Dealer wins — you lost ${bet.toLocaleString()} credits.`);
      return;
    }
    // push
    window.MTMWallet.add(bet);
    endGame('🤝 Push (tie) — bet refunded.');
  }

  hitBtn.addEventListener('click', () => {
    if(done) return;
    player.push(drawCard());
    render();
    if(value(player) > 21){
      dealerPlay();
      settle();
    }
  });

  standBtn.addEventListener('click', () => {
    if(done) return;
    dealerPlay();
    settle();
  });

  newBtn.addEventListener('click', () => {
    // allow changing bet before next round
    betLocked = false;
    setButtons(false);
    newGame();
  });

  // set a sane default bet input
  if(betEl){
    betEl.addEventListener('change', () => {
      betEl.value = String(Math.max(1, Math.floor(Number(betEl.value)||0)));
    });
  }

  newGame();
})();
