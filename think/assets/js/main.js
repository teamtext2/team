// Đồng hồ
function updateClock() {
    const now = new Date();
    const el = document.getElementById('clock');
    el.textContent = now.toLocaleTimeString();
  }
  setInterval(updateClock, 1000);
  updateClock();
  