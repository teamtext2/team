export default function Footer(){
  const f = document.createElement('footer');
  f.className = 'footer';
  f.innerHTML = `
    <div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:space-between;align-items:flex-start">
      <div style="flex:1;min-width:200px">
        <div style="display:flex;align-items:center;gap:10px">
          <img src="/public/favicon.ico" alt="logo" style="width:40px;height:40px;background:#23272a;border-radius:8px"/>
          <div style="font-weight:700;color:var(--accent)">Text2</div>
        </div>
        <div style="color:var(--muted);margin-top:6px">We made a difference with AI tools, chat, and digital services.</div>
      </div>
      <div style="min-width:140px">
        <div style="font-weight:600;color:var(--accent);margin-bottom:8px">Quick Links</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <a href="#" style="color:#fff">Home</a>
          <a href="#" style="color:#fff">Blog</a>
          <a href="mailto:team@text2.click" style="color:#fff">Contact</a>
        </div>
      </div>
    </div>
    <div style="margin-top:18px;color:var(--muted);font-size:13px;text-align:center">© 2025 Text2. All rights reserved.</div>
  `;
  return f;
}
