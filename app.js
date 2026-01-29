(function () {
  var winEl = document.getElementById('win-count');
  var lossEl = document.getElementById('loss-count');
  var winMinus = document.getElementById('win-minus');
  var winPlus = document.getElementById('win-plus');
  var lossMinus = document.getElementById('loss-minus');
  var lossPlus = document.getElementById('loss-plus');

  var state = {
    win: 0,
    loss: 0
  };

  function load() {
    try {
      var s = localStorage.getItem('contador-partidas');
      if (s) {
        var data = JSON.parse(s);
        state.win = Number(data.win) || 0;
        state.loss = Number(data.loss) || 0;
      }
    } catch (e) {}
    render();
  }

  function save() {
    try {
      localStorage.setItem('contador-partidas', JSON.stringify(state));
    } catch (e) {}
  }

  function render() {
    winEl.textContent = state.win;
    lossEl.textContent = state.loss;
  }

  function changeWin(delta) {
    state.win = Math.max(0, state.win + delta);
    render();
    save();
  }

  function changeLoss(delta) {
    state.loss = Math.max(0, state.loss + delta);
    render();
    save();
  }

  winMinus.addEventListener('click', function () { changeWin(-1); });
  winPlus.addEventListener('click', function () { changeWin(1); });
  lossMinus.addEventListener('click', function () { changeLoss(-1); });
  lossPlus.addEventListener('click', function () { changeLoss(1); });

  load();
})();
