const groups = [
  {title:'Facebook', links:[{label:'Text2 Official', href:'#'},{label:'Group Text2 Team', href:'#'}]},
  {title:'YouTube', links:[{label:'Text2 Home', href:'#'},{label:'Text2 - Vietnam', href:'#'}]},
  {title:'TikTok', links:[{label:'Text2 Vietnam', href:'#'}]},
  {title:'Instagram', links:[{label:'Text2 Official', href:'#'}]},
  {title:'Twitter (X)', links:[{label:'Text2', href:'#'}]},
  {title:'Threads', links:[{label:'Text2', href:'#'}]}
];

export default function SocialMedia(){
  const sec = document.createElement('section');
  sec.style.marginTop = '28px';
  sec.innerHTML = `<div class="section-title">Our Channels</div>`;
  const grid = document.createElement('div');
  grid.className = 'icon-container';

  groups.forEach(g=>{
    const node = document.createElement('div');
    node.className = 'card social-media-group';
    node.innerHTML = `<div style="font-weight:700;color:var(--accent);margin-bottom:8px">${g.title}</div>`;
    g.links.forEach(l=>{
      const a = document.createElement('a');
      a.className = 'social-link';
      a.href = l.href;
      a.textContent = l.label;
      node.appendChild(a);
    });
    grid.appendChild(node);
  });

  sec.appendChild(grid);
  return sec;
}
