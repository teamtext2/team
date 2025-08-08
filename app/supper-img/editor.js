// Minimal integration with Toast UI Image Editor + UX Enhancements
const container = document.getElementById('tui-image-editor-container');
const dropOverlay = document.getElementById('drop-overlay');

const imageEditor = new tui.ImageEditor(container, {
  includeUI: {
    loadImage: {
      path: '',
      name: 'Blank'
    },
    theme: {},
    initMenu: 'filter',
    menuBarPosition: 'bottom'
  },
  cssMaxWidth: 1200,
  cssMaxHeight: 800,
  selectionStyle: {
    cornerSize: 20,
    rotatingPointOffset: 70
  }
});

// Helpers
function enableDownload(enable) {
  document.getElementById('btn-download').disabled = !enable;
}

function updateThemeButtonLabel(){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btn = document.getElementById('btn-theme');
  if (!btn) return;
  btn.textContent = isDark ? 'Giao diện sáng' : 'Giao diện tối';
}

// Open local file
document.getElementById('file-input').addEventListener('change', function(e){
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    imageEditor.loadImageFromURL(evt.target.result, 'UserImage').then(() => {
      enableDownload(true);
    }).catch(err => console.error(err));
  };
  reader.readAsDataURL(file);
});

// sample image
document.getElementById('btn-open-sample').addEventListener('click', ()=>{
  const sample = 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&q=80&auto=format&fit=crop';
  imageEditor.loadImageFromURL(sample, 'Sample').then(()=> enableDownload(true));
});

// download result
document.getElementById('btn-download').addEventListener('click', ()=>{
  imageEditor.toDataURL({format: 'png'}).then(dataUrl => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'edited_' + Date.now() + '.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
});

// Left panel quick actions
document.querySelectorAll('[data-tool]').forEach(btn => {
  btn.addEventListener('click', async ()=>{
    const tool = btn.getAttribute('data-tool');
    switch(tool) {
      case 'crop':
        try {
          const rect = imageEditor.getCropzoneRect();
          if (rect && rect.width && rect.height) {
            await imageEditor.crop(rect);
          }
        } catch(_){}
        imageEditor.ui.changeMenu('crop');
        break;
      case 'flip':
        imageEditor.ui.changeMenu('flip');
        break;
      case 'rotate':
        imageEditor.ui.changeMenu('rotate');
        break;
      case 'draw':
        imageEditor.ui.changeMenu('draw');
        break;
      case 'text':
        imageEditor.ui.changeMenu('text');
        break;
      case 'filter':
        imageEditor.ui.changeMenu('filter');
        break;
      case 'watermark':
        // simple text watermark
        const txt = prompt('Nhập text watermark', 'taoanhdep.com');
        if (txt) {
          imageEditor.addText(txt, {styles: {fill: '#ffffff', stroke: '#000000'}});
        }
        break;
    }
  });
});

// Theme toggle (persist)
const THEME_KEY = 'mini_editor_theme';
function applySavedTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme','dark');
  } else if (saved === 'light') {
    document.documentElement.setAttribute('data-theme','light');
  }
  updateThemeButtonLabel();
}
applySavedTheme();

document.getElementById('btn-theme').addEventListener('click', ()=>{
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeButtonLabel();
});

// Drag & drop upload
['dragenter','dragover'].forEach(evt => {
  container.addEventListener(evt, e => {
    e.preventDefault();
    document.body.setAttribute('data-dragover','true');
  });
});
['dragleave','drop'].forEach(evt => {
  container.addEventListener(evt, e => {
    e.preventDefault();
    document.body.removeAttribute('data-dragover');
  });
});
container.addEventListener('drop', e => {
  const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    imageEditor.loadImageFromURL(evt.target.result, 'Dropped').then(()=> enableDownload(true));
  };
  reader.readAsDataURL(file);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e)=>{
  if (e.ctrlKey && e.key.toLowerCase() === 's') { // Ctrl+S to download
    e.preventDefault();
    const btn = document.getElementById('btn-download');
    if (!btn.disabled) btn.click();
  }
  if (e.ctrlKey && e.key.toLowerCase() === 'o') { // Ctrl+O to open
    e.preventDefault();
    document.getElementById('file-input').click();
  }
});

// Resize observer to keep canvas sharp on container changes
const resizeObserver = new ResizeObserver(() => {
  try { imageEditor.ui.resizeEditor(); } catch(_) {}
});
resizeObserver.observe(container.parentElement);
