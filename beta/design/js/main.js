// Khởi tạo Icons
lucide.createIcons();

// --- QUẢN LÝ DỮ LIỆU ---
let projects = JSON.parse(localStorage.getItem('t2paint_projects')) || [];
let currentProjectId = null;

// --- CẤU HÌNH CANVAS & BIẾN TOÀN CỤC ---
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const brushCursor = document.getElementById('brush-cursor');
const symmetryGuide = document.getElementById('symmetry-guide');

let dpr = 1;

// Cấu hình lưu trữ trạng thái vẽ (cho Line AI)
let snapshotCanvas = document.createElement('canvas');
let snapshotCtx = snapshotCanvas.getContext('2d');

// Trạng thái vẽ
let isDrawing = false;
let startX = 0; let startY = 0;
let lastX = 0; let lastY = 0;
let snappedX = 0; let snappedY = 0; // Điểm kết thúc của AI Line

// Hệ thống Undo/Redo
const MAX_HISTORY = 20;
let undoStack = [];
let redoStack = [];

// Cài đặt hiện tại
let currentTool = 'brush';
let currentColor = '#0f172a';
let currentSize = 5;

// --- KHỞI TẠO APP ---
function initApp() {
    renderProjects();
    setupEventListeners();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!document.getElementById('canvas-view').classList.contains('hidden')) {
                const imgData = canvas.toDataURL();
                setupCanvasSize();
                loadCanvasImage(imgData);
            }
        }, 200);
    });
}

// --- LOGIC GIAO DIỆN (VIEWS) ---
function showView(viewId) {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('canvas-view').classList.add('hidden');

    const targetView = document.getElementById(viewId);
    targetView.classList.remove('hidden');
    targetView.classList.add('fade-enter');

    setTimeout(() => {
        targetView.classList.remove('fade-enter');
        lucide.createIcons();
    }, 300);
}

function goHome() {
    if (currentProjectId) saveProject(false); // Lưu ngầm
    brushCursor.style.display = 'none';
    renderProjects();
    showView('home-view');
    currentProjectId = null;
}

function createNewProject() {
    currentProjectId = Date.now().toString();
    undoStack = []; redoStack = [];
    showView('canvas-view');

    setTimeout(() => {
        setupCanvasSize(true);
        clearCanvas(false);
        saveState();
    }, 50);
}

function openProject(id) {
    currentProjectId = id;
    const project = projects.find(p => p.id === id);
    if (project) {
        undoStack = []; redoStack = [];
        showView('canvas-view');
        setTimeout(() => {
            setupCanvasSize(true);
            loadCanvasImage(project.data, () => {
                saveState();
            });
        }, 50);
    }
}

function deleteProject(id) {
    if (confirm("Are you sure you want to delete this artwork?")) {
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('t2paint_projects', JSON.stringify(projects));
        renderProjects();
        showToast("Artwork deleted", "trash-2", "text-red-400");
    }
}

// --- LOGIC CANVAS & VẼ ---
function setupCanvasSize() {
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();

    dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
}

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (evt.touches && evt.touches.length > 0) {
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
    } else {
        clientX = evt.clientX;
        clientY = evt.clientY;
    }

    return { x: clientX - rect.left, y: clientY - rect.top };
}

function updateBrushCursor(e) {
    // Không hiện cursor tròn nếu đang dùng Line AI
    if (currentTool === 'line-ai') {
        brushCursor.style.display = 'none';
        return;
    }
    if (e.touches) return;

    brushCursor.style.display = 'block';
    brushCursor.style.width = `${currentSize}px`;
    brushCursor.style.height = `${currentSize}px`;
    brushCursor.style.left = `${e.clientX}px`;
    brushCursor.style.top = `${e.clientY}px`;
    brushCursor.style.borderColor = currentTool === 'eraser' ? 'rgba(0,0,0,0.5)' : currentColor;
}

function startDrawing(e) {
    if (e.type === 'touchstart') e.preventDefault();

    isDrawing = true;
    let pos = getMousePos(e);
    pos = expandCanvasIfNeeded(pos);

    startX = pos.x; startY = pos.y;
    lastX = pos.x; lastY = pos.y;
    snappedX = pos.x; snappedY = pos.y;

    // Xử lý riêng cho Bút AI vẽ tường
    if (currentTool === 'line-ai') {
        snapshotCanvas.width = canvas.width;
        snapshotCanvas.height = canvas.height;
        snapshotCtx.drawImage(canvas, 0, 0);
        return; // Không chấm 1 điểm khi vừa click
    }

    // Chấm điểm đầu tiên cho các cọ khác
    ctx.beginPath();
    ctx.arc(lastX, lastY, currentSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);

    // Xử lý điểm đầu tiên cho Vẽ Đối Xứng
    if (currentTool === 'symmetry') {
        const canvasRect = canvas.getBoundingClientRect();
        const cssCenterX = canvasRect.width / 2;
        const mirrorLastX = cssCenterX - (lastX - cssCenterX);

        ctx.beginPath();
        ctx.arc(mirrorLastX, lastY, currentSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.fill();

        ctx.beginPath();
    }
}


// --- INFINITE CANVAS ---
function expandCanvasIfNeeded(pos) {
    if (currentTool !== 'brush' && currentTool !== 'eraser' && currentTool !== 'line-ai' && currentTool !== 'symmetry') return pos;
    if (!isDrawing) return pos;

    const padding = 120;
    let expanded = false;
    
    let cssW = parseFloat(canvas.style.width);
    let cssH = parseFloat(canvas.style.height);

    let newCssW = cssW;
    let newCssH = cssH;
    let shiftX = 0;
    let shiftY = 0;

    const wrapper = canvas.parentElement;

    if (pos.x > cssW - padding) {
        newCssW = cssW + 400;
        expanded = true;
    } else if (pos.x < padding && wrapper.scrollLeft <= padding) {
        newCssW = cssW + 400;
        shiftX = 400;
        expanded = true;
    }

    if (pos.y > cssH - padding) {
        newCssH = cssH + 400;
        expanded = true;
    } else if (pos.y < padding && wrapper.scrollTop <= padding) {
        newCssH = cssH + 400;
        shiftY = 400;
        expanded = true;
    }

    if (expanded) {
        const off = document.createElement('canvas');
        off.width = canvas.width;
        off.height = canvas.height;
        off.getContext('2d').drawImage(canvas, 0, 0);

        canvas.width = newCssW * dpr;
        canvas.height = newCssH * dpr;
        canvas.style.width = newCssW + 'px';
        canvas.style.height = newCssH + 'px';

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, newCssW, newCssH);

        const offCssW = off.width / dpr;
        const offCssH = off.height / dpr;
        ctx.drawImage(off, shiftX, shiftY, offCssW, offCssH);

        if (shiftX > 0 || shiftY > 0) {
            lastX += shiftX;
            lastY += shiftY;
            startX += shiftX;
            startY += shiftY;
            pos.x += shiftX;
            pos.y += shiftY;
            
            wrapper.scrollLeft += shiftX;
            wrapper.scrollTop += shiftY;
            
            if (currentTool === 'line-ai') {
                snappedX += shiftX;
                snappedY += shiftY;
            }
        }

        if (currentTool === 'line-ai') {
            snapshotCanvas.width = canvas.width;
            snapshotCanvas.height = canvas.height;
            snapshotCtx.fillStyle = '#ffffff';
            snapshotCtx.fillRect(0, 0, canvas.width, canvas.height);
            snapshotCtx.drawImage(off, shiftX * dpr, shiftY * dpr);
        }

        ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
        ctx.lineWidth = currentSize;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
    }
    return pos;
}

function draw(e) {

    updateBrushCursor(e);
    if (!isDrawing) return;
    if (e.type === 'touchmove') e.preventDefault();

    let pos = getMousePos(e);
    pos = expandCanvasIfNeeded(pos);

    if (currentTool === 'line-ai') {
        // Khôi phục bản nháp
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(snapshotCanvas, 0, 0);
        ctx.restore();

        let endX = pos.x;
        let endY = pos.y;

        // Thuật toán AI: Tính toán & Bắt dính góc (Snap Angle)
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const snappedAngle = Math.round(angle / 45) * 45; // Bắt dính 0, 45, 90, 135...
        const length = Math.sqrt(dx * dx + dy * dy);

        snappedX = startX + length * Math.cos(snappedAngle * Math.PI / 180);
        snappedY = startY + length * Math.sin(snappedAngle * Math.PI / 180);

        // Vẽ đường ngắm
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(snappedX, snappedY);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Hiển thị Thông số Độ Nhạy AI (Angle Text)
        if (length > 20) {
            ctx.fillStyle = '#6366f1'; // Màu Indigo-500
            ctx.font = 'bold 12px Inter';

            // Tính góc hiển thị đẹp (0-180 độ cho người dùng dễ hiểu)
            let displayAngle = Math.abs(snappedAngle);
            if (displayAngle > 180) displayAngle = 360 - displayAngle;

            ctx.fillText(`${displayAngle}°`, snappedX + 15, snappedY - 15);
        }

    } else if (currentTool === 'symmetry') {
        // Nét vẽ chính
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentSize;
        ctx.stroke();

        // Nét đối xứng (Mirror)
        const canvasRect = canvas.getBoundingClientRect();
        const cssCenterX = canvasRect.width / 2;
        const mirrorX = cssCenterX - (pos.x - cssCenterX);
        const mirrorLastX = cssCenterX - (lastX - cssCenterX);

        ctx.beginPath();
        ctx.moveTo(mirrorLastX, lastY);
        ctx.lineTo(mirrorX, pos.y);
        ctx.stroke();

        lastX = pos.x;
        lastY = pos.y;
    } else {
        // Cọ thường & Tẩy
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
        ctx.lineWidth = currentSize;
        ctx.stroke();

        lastX = pos.x;
        lastY = pos.y;
    }
}

function stopDrawing(e) {
    if (isDrawing) {
        // Nếu là Line AI, ta cần chốt nét vẽ cuối mà KHÔNG in chữ Số độ lên canvas
        if (currentTool === 'line-ai') {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(snapshotCanvas, 0, 0);
            ctx.restore();

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(snappedX, snappedY);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentSize;
            ctx.stroke();
        }

        ctx.closePath();
        isDrawing = false;
        saveState();
    }
}

// --- CÁC TÍNH NĂNG CHÍNH (UNDO/REDO/CLEAR/SAVE) ---
function clearCanvas(recordHistory = true) {
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    if (recordHistory) saveState();
}

function updateUndoRedoButtons() {
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');

    if (undoStack.length <= 1) {
        btnUndo.classList.add('text-slate-300');
        btnUndo.classList.remove('text-slate-600');
    } else {
        btnUndo.classList.remove('text-slate-300');
        btnUndo.classList.add('text-slate-600');
    }

    if (redoStack.length === 0) {
        btnRedo.classList.add('text-slate-300');
        btnRedo.classList.remove('text-slate-600');
    } else {
        btnRedo.classList.remove('text-slate-300');
        btnRedo.classList.add('text-slate-600');
    }
}

function saveState() {
    redoStack = [];
    if (undoStack.length >= MAX_HISTORY) undoStack.shift();
    undoStack.push(canvas.toDataURL());
    updateUndoRedoButtons();
}

function undo() {
    if (undoStack.length > 1) {
        const currentState = undoStack.pop();
        redoStack.push(currentState);

        const previousState = undoStack[undoStack.length - 1];
        loadCanvasImage(previousState);
        updateUndoRedoButtons();
    }
}

function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        undoStack.push(nextState);
        loadCanvasImage(nextState);
        updateUndoRedoButtons();
    }
}

function loadCanvasImage(dataUrl, callback) {
    const img = new Image();
    img.onload = () => {
        let tgtW = Math.max(canvas.width / dpr, img.width / dpr);
        let tgtH = Math.max(canvas.height / dpr, img.height / dpr);
        
        if (tgtW > canvas.width / dpr || tgtH > canvas.height / dpr) {
            canvas.width = tgtW * dpr;
            canvas.height = tgtH * dpr;
            canvas.style.width = `${tgtW}px`;
            canvas.style.height = `${tgtH}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tgtW, tgtH);
        ctx.drawImage(img, 0, 0, img.width/dpr, img.height/dpr);
        if (callback) callback();
    };
    img.src = dataUrl;
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = `T2-Paint-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded successfully", "download", "text-blue-400");
}

function saveProject(showAlert = true) {
    if (!currentProjectId) return;

    const thumbnail = canvas.toDataURL("image/jpeg", 0.1);
    const data = canvas.toDataURL("image/jpeg", 0.8);

    const existingIndex = projects.findIndex(p => p.id === currentProjectId);

    const projectData = {
        id: currentProjectId,
        name: `Artwork ${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        thumbnail: thumbnail,
        data: data,
        updatedAt: Date.now()
    };

    if (existingIndex >= 0) projects[existingIndex] = projectData;
    else projects.unshift(projectData);

    try {
        localStorage.setItem('t2paint_projects', JSON.stringify(projects));
        if (showAlert) showToast("Project saved", "check-circle", "text-green-400");
    } catch (e) {
        console.error("Storage full error:", e);
        alert("Storage is full! Please download your images or delete older projects.");
    }
}

// --- UI COMPONENTS ---
function showToast(message, iconName, iconColorClass) {
    const oldToast = document.getElementById('app-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-lg z-[100] text-sm font-medium fade-enter flex items-center gap-2 border border-slate-700';
    toast.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 ${iconColorClass}"></i> ${message}`;
    document.body.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -10px)';
        toast.style.transition = 'all 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    const emptyState = document.getElementById('empty-state');
    grid.innerHTML = '';

    projects.sort((a, b) => b.updatedAt - a.updatedAt);

    if (projects.length === 0) {
        emptyState.classList.remove('hidden');
        emptyState.classList.add('flex');
    } else {
        emptyState.classList.add('hidden');
        emptyState.classList.remove('flex');

        projects.forEach(project => {
            const date = new Date(project.updatedAt).toLocaleDateString('en-US');
            const card = document.createElement('div');
            card.className = 'bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-indigo-300/60 flex flex-col';
            card.onclick = () => openProject(project.id);

            const trashSvg = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;
            const clockSvg = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

            card.innerHTML = `
                        <div class="aspect-[4/3] w-full bg-[#f8fafc] relative overflow-hidden border-b border-slate-100 p-2 flex items-center justify-center">
                            <img src="${project.thumbnail}" class="w-full h-full object-contain drop-shadow-sm rounded" alt="Thumbnail">
                            <div class="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <button class="delete-btn absolute top-3 right-3 bg-white/95 text-slate-400 hover:text-red-500 p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 sm:block hidden z-10 border border-slate-100">
                                ${trashSvg}
                            </button>
                        </div>
                        <div class="p-4 flex justify-between items-center bg-white relative z-20">
                            <div class="truncate pr-2">
                                <h3 class="font-bold text-slate-800 truncate text-sm transition-colors group-hover:text-indigo-600">${project.name}</h3>
                                <p class="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1.5">${clockSvg} ${date}</p>
                            </div>
                            <button class="delete-btn text-slate-300 hover:text-red-500 p-2 sm:hidden rounded-full bg-slate-50 border border-slate-100">
                                ${trashSvg}
                            </button>
                        </div>
                    `;

            // Gắn sự kiện xóa một cách độc lập để không bị đụng (conflict)
            const deleteBtns = card.querySelectorAll('.delete-btn');
            deleteBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Ngăn sự kiện click truyền tới khung lớn
                    deleteProject(project.id);
                });
            });

            grid.appendChild(card);
        });
        lucide.createIcons();
    }
}

// --- GẮN SỰ KIỆN (EVENT LISTENERS) ---
function setupEventListeners() {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);

    canvas.addEventListener('mouseenter', (e) => updateBrushCursor(e));
    canvas.addEventListener('mouseleave', () => {
        brushCursor.style.display = 'none';
        stopDrawing();
    });

    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDrawing);
    window.addEventListener('touchcancel', stopDrawing);

    window.addEventListener('keydown', (e) => {
        if (!document.getElementById('canvas-view').classList.contains('hidden')) {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') { e.preventDefault(); undo(); }
                if (e.key === 'y') { e.preventDefault(); redo(); }
                if (e.key === 's') { e.preventDefault(); saveProject(); }
            }
        }
    });

    // Gắn sự kiện chọn công cụ (Bao gồm các tool AI)
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Reset CSS của tất cả các nút
            document.querySelectorAll('.tool-btn').forEach(b => {
                b.classList.remove('active', 'bg-slate-800', 'text-white', 'shadow-md');
                if (!b.classList.contains('ai-tool-btn')) {
                    b.classList.add('text-slate-600');
                }
            });

            const target = e.currentTarget;
            target.classList.add('active', 'shadow-md');
            target.classList.remove('text-slate-600');
            currentTool = target.dataset.tool;

            // Logic bật/tắt hiển thị Trục đối xứng
            if (currentTool === 'symmetry') {
                symmetryGuide.classList.remove('hidden');
            } else {
                symmetryGuide.classList.add('hidden');
            }

            // Logic hiển thị con trỏ
            if (currentTool === 'eraser' || currentTool === 'brush' || currentTool === 'symmetry') {
                canvas.style.cursor = 'none';
            } else if (currentTool === 'line-ai') {
                canvas.style.cursor = 'crosshair';
            } else {
                canvas.style.cursor = 'pointer';
            }
        });
    });

    document.querySelectorAll('.color-btn:not(.custom-color-wrapper)').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setActiveColorBtn(e.target);
            currentColor = e.target.dataset.color;
            autoSwitchToBrush();
        });
    });

    const customColorInput = document.getElementById('custom-color-input');
    const customColorWrapper = document.querySelector('.custom-color-wrapper');

    customColorInput.addEventListener('input', (e) => {
        currentColor = e.target.value;
        customColorWrapper.style.background = currentColor;
        setActiveColorBtn(customColorWrapper);
        autoSwitchToBrush();
    });

    const sizeInput = document.getElementById('brush-size');
    sizeInput.addEventListener('input', (e) => {
        currentSize = parseInt(e.target.value);
    });
}

function setActiveColorBtn(targetElement) {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    targetElement.classList.add('active');
}

function autoSwitchToBrush() {
    if (currentTool === 'eraser') {
        document.querySelector('[data-tool="brush"]').click();
    }
}

window.onload = initApp;
