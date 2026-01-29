(function () {
  // --- Configuración Firebase (opcional) ---
  // Crea un proyecto en https://console.firebase.google.com → Realtime Database
  // En reglas pon: { "rules": { ".read": true, ".write": true } } (solo para uso personal)
  // Pega aquí tu config:
  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyD3Wr4ms4ieKflUZueYYnhgvSzEGBBBgxs",
    authDomain: "trackerwinlose.firebaseapp.com",
    databaseURL: "https://trackerwinlose-default-rtdb.firebaseio.com",
    projectId: "trackerwinlose",
    storageBucket: "trackerwinlose.firebasestorage.app",
    messagingSenderId: "1029566617545",
    appId: "1:1029566617545:web:97767d36fd956c4adb3a18"
  };

  var winEl = document.getElementById('win-count');
  var lossEl = document.getElementById('loss-count');
  var winMinus = document.getElementById('win-minus');
  var winPlus = document.getElementById('win-plus');
  var lossMinus = document.getElementById('loss-minus');
  var lossPlus = document.getElementById('loss-plus');
  var resetBtn = document.getElementById('reset-btn');
  var shareUrlEl = document.getElementById('share-url');
  var copyBtn = document.getElementById('copy-btn');
  var syncStatusEl = document.getElementById('sync-status');

  var state = { win: 0, loss: 0 };
  var tokenId = null;
  var dbRef = null;
  var unsubscribeFirebase = null;

  function getTokenFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('id') || null;
  }

  function generateToken() {
    return 'x' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
  }

  function ensureTokenInUrl() {
    tokenId = getTokenFromUrl();
    if (!tokenId) {
      tokenId = generateToken();
      var url = new URL(window.location.href);
      url.searchParams.set('id', tokenId);
      window.history.replaceState({}, '', url.toString());
    }
    if (shareUrlEl) shareUrlEl.value = window.location.href;
  }

  function render() {
    winEl.textContent = state.win;
    lossEl.textContent = state.loss;
  }

  function setStateFromData(data) {
    if (!data) return;
    state.win = Math.max(0, Number(data.win) || 0);
    state.loss = Math.max(0, Number(data.loss) || 0);
    render();
  }

  function saveLocal() {
    try {
      var key = 'contador-partidas' + (tokenId ? '-' + tokenId : '');
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {}
  }

  function loadLocal() {
    try {
      var key = 'contador-partidas' + (tokenId ? '-' + tokenId : '');
      var s = localStorage.getItem(key);
      if (s) {
        var data = JSON.parse(s);
        setStateFromData(data);
        return;
      }
    } catch (e) {}
    setStateFromData(state);
  }

  function changeWin(delta) {
    state.win = Math.max(0, state.win + delta);
    render();
    saveLocal();
    if (dbRef) {
      dbRef.set({ win: state.win, loss: state.loss });
    }
  }

  function changeLoss(delta) {
    state.loss = Math.max(0, state.loss + delta);
    render();
    saveLocal();
    if (dbRef) {
      dbRef.set({ win: state.win, loss: state.loss });
    }
  }

  function resetCounters() {
    state.win = 0;
    state.loss = 0;
    render();
    saveLocal();
    if (dbRef) {
      dbRef.set({ win: state.win, loss: state.loss });
    }
  }

  function initFirebase() {
    if (!FIREBASE_CONFIG || !tokenId) return;
    try {
      try {
        window.firebase.app();
      } catch (e) {
        window.firebase.initializeApp(FIREBASE_CONFIG);
      }
      var db = window.firebase.database();
      dbRef = db.ref('counters/' + tokenId);

      unsubscribeFirebase = dbRef.on('value', function (snap) {
        var val = snap.val();
        if (val && (typeof val.win !== 'undefined' || typeof val.loss !== 'undefined')) {
          setStateFromData(val);
        }
      });

      dbRef.once('value').then(function (snap) {
        var val = snap.val();
        if (val && (val.win !== undefined || val.loss !== undefined)) {
          setStateFromData(val);
        } else {
          dbRef.set({ win: state.win, loss: state.loss });
        }
      });

      if (syncStatusEl) {
        syncStatusEl.textContent = 'Sincronizado';
        syncStatusEl.classList.remove('offline');
      }
    } catch (e) {
      if (syncStatusEl) {
        syncStatusEl.textContent = 'Solo local (revisa Firebase config)';
        syncStatusEl.classList.add('offline');
      }
    }
  }

  function setupUi() {
    ensureTokenInUrl();
    loadLocal();
    initFirebase();

    if (copyBtn && shareUrlEl) {
      copyBtn.addEventListener('click', function () {
        shareUrlEl.select();
        shareUrlEl.setSelectionRange(0, 99999);
        try {
          navigator.clipboard.writeText(shareUrlEl.value);
          copyBtn.textContent = '¡Copiado!';
          setTimeout(function () { copyBtn.textContent = 'Copiar'; }, 1500);
        } catch (e) {
          copyBtn.textContent = 'Selecciona y copia';
        }
      });
    }

    if (!FIREBASE_CONFIG && syncStatusEl) {
      syncStatusEl.textContent = 'Solo local — configura Firebase para sincronizar';
      syncStatusEl.classList.add('offline');
    }

    winMinus.addEventListener('click', function () { changeWin(-1); });
    winPlus.addEventListener('click', function () { changeWin(1); });
    if (resetBtn) resetBtn.addEventListener('click', resetCounters);
    lossMinus.addEventListener('click', function () { changeLoss(-1); });
    lossPlus.addEventListener('click', function () { changeLoss(1); });
  }

  setupUi();
})();
