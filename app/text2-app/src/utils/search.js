export function initSearch(){
  const input = document.getElementById('searchInput');
  if(!input) return;
  input.addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.card').forEach(card=>{
      const txt = (card.innerText || '').toLowerCase();
      card.style.display = txt.includes(q) ? '' : 'none';
    });
  });
}
