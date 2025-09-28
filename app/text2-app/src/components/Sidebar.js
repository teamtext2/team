export default function Sidebar(){
  const aside = document.createElement('aside');
  aside.className = 'sidebar';
  aside.innerHTML = `
    <div class="logo"><img src="https://lh3.googleusercontent.com/p/AF1QipMAH2F9BWWLSU14YABENNfSIUDTinGdHOO3wC-S=s1360-w1360-h1020-rw" style="width:28px;height:28px;border-radius:6px"/> <span>Text2</span></div>
    <div class="nav">
      <a href="#">Text2 - Team</a>
      <a href="#">App</a>
      <a href="#">Camera</a>
    </div>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.03);margin:12px 0" />
    <div style="color:var(--muted);font-weight:600;margin-bottom:8px">Social Media</div>
    <div class="nav">
      <a href="#">Facebook</a>
      <a href="#">YouTube</a>
      <a href="#">TikTok</a>
      <a href="#">Instagram</a>
      <a href="#">Twitter (X)</a>
      <a href="#">Threads</a>
    </div>
  `;
  return aside;
}
