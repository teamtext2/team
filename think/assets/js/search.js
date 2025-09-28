document.getElementById('searchInput').addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.app-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? 'block' : 'none';
    });
  });
  