const apps = [
  {title:'Camera', href:'#', img:'https://camera.text2.click/apple-touch-icon.png'},
  {title:'Note', href:'#', img:'https://note.text2.click/apple-touch-icon.png'},
  {title:'Calendar', href:'#', img:'https://calendar.text2.click/apple-touch-icon.png'},
  {title:'Chat AI', href:'#', img:'https://chat.text2.click/apple-touch-icon.png'},
  {title:'Grammar Checker', href:'#', img:'https://grammar.text2.click/apple-touch-icon.png'},
  {title:'Img Design', href:'#', img:'https://img.text2.click/apple-touch-icon.png'},
  {title:'Scan QR', href:'#', img:'https://qr.text2.click/scan/apple-touch-icon.png'},
  {title:'Add Luts', href:'#', img:'https://luts.text2.click/apple-touch-icon.png'},
  {title:'Translate', href:'#', img:'https://translate.text2.click/apple-touch-icon.png'},
  {title:'Love Match', href:'#', img:'https://love.text2.click/apple-touch-icon.png'}
];

export default function AppGrid(){
  const wrap = document.createElement('section');
  wrap.className = 'apps-section';
  wrap.innerHTML = `<div class="section-title">Text2 Ecosystem</div>`;

  const grid = document.createElement('div');
  grid.className = 'icon-container';

  apps.forEach(a=>{
    const node = document.createElement('a');
    node.className = 'card';
    node.href = a.href;
    node.target = '_blank';
    node.rel = 'noopener';
    node.innerHTML = `
      <img src="${a.img}" alt="${a.title}" onerror="this.style.opacity=.6"/>
      <p>${a.title}</p>
    `;
    grid.appendChild(node);
  });

  wrap.appendChild(grid);
  return wrap;
}
