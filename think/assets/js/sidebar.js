const sidebar = document.getElementById('sidebar');
document.getElementById('menuToggle').addEventListener('click', () => {
  sidebar.classList.add('open');
});
document.getElementById('closeSidebar').addEventListener('click', () => {
  sidebar.classList.remove('open');
});

