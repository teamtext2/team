export default function Header(){
  const header = document.createElement('header');
  header.className = 'topbar';

  const left = document.createElement('div');
  left.className = 'topbar-left';
  left.innerHTML = `
    <div class="start-button">
      <img src="https://lh3.googleusercontent.com/p/AF1QipMAH2F9BWWLSU14YABENNfSIUDTinGdHOO3wC-S=s1360-w1360-h1020-rw" alt="logo"/>
      <span>Text2</span>
    </div>
    <nav class="pills">
      <div class="pill">APP</div>
      <div class="pill">TEAM</div>
      <div class="pill">Camera</div>
      <div class="pill" style="background:linear-gradient(90deg,#23a6f0,#4fc3f7);color:#000">Install</div>
    </nav>
  `;

  const right = document.createElement('div');
  right.className = 'topbar-actions';
  right.innerHTML = `
    <div class="search-box">
      <input id="searchInput" placeholder="Search your app..." />
      <button id="searchButton" class="search-button" title="Search">🔍</button>
    </div>
    <div class="clock" id="clock">00:00:00</div>
  `;

  header.appendChild(left);
  header.appendChild(right);
  return header;
}
