// Minimal integration with Toast UI Image Editor
const container = document.getElementById('tui-image-editor-container');

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
  cssMaxWidth: 700,
  cssMaxHeight: 500,
  selectionStyle: {
    cornerSize: 20,
    rotatingPointOffset: 70
  }
});

// Helpers
function enableDownload(enable) {
  document.getElementById('btn-download').disabled = !enable;
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
  imageEditor.toDataURL().then(dataUrl => {
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
        imageEditor.crop(imageEditor.getCropzoneRect()).catch(()=>{});
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
