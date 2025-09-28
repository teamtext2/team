export function startClock(){
  const el = document.getElementById('clock');
  if(!el) return;
  function tick(){
    const d = new Date();
    el.textContent = d.toLocaleTimeString();
  }
  tick();
  setInterval(tick,1000);
}
