# Text2 PWA (Progressive Web App) Features

## 🚀 Tính năng PWA đã được triển khai

### 1. **Manifest.json** - Cấu hình PWA
- ✅ Tên ứng dụng và mô tả
- ✅ Icons cho các kích thước khác nhau (192x192, 512x512)
- ✅ Theme colors và background colors
- ✅ Display mode: standalone
- ✅ Shortcuts cho các tính năng chính
- ✅ Screenshots cho app stores
- ✅ Categories và metadata

### 2. **Service Worker** - Cache và Offline Support
- ✅ Cache static files (HTML, CSS, JS, images)
- ✅ Cache API responses
- ✅ Network-first strategy cho API calls
- ✅ Cache-first strategy cho static resources
- ✅ Background sync
- ✅ Push notifications
- ✅ Offline fallback

### 3. **Installation Prompt**
- ✅ Nút "Install Text2" tự động hiển thị
- ✅ Hỗ trợ beforeinstallprompt event
- ✅ Theo dõi trạng thái cài đặt
- ✅ Analytics tracking cho installations

### 4. **Offline Experience**
- ✅ Trang offline đẹp mắt
- ✅ Hiển thị trạng thái kết nối
- ✅ Auto-retry khi có kết nối
- ✅ Cached content access

### 5. **Cross-Platform Support**
- ✅ iOS Safari (apple-touch-icon, apple-mobile-web-app-capable)
- ✅ Android Chrome
- ✅ Microsoft Edge (browserconfig.xml)
- ✅ Desktop browsers

## 📱 Cách sử dụng PWA

### Cài đặt trên Mobile:
1. Mở trang web trên Chrome/Safari
2. Nhấn nút "Install Text2" (góc dưới bên phải)
3. Hoặc vào menu browser → "Add to Home Screen"

### Cài đặt trên Desktop:
1. Mở Chrome/Edge
2. Nhấn icon cài đặt trên thanh địa chỉ
3. Chọn "Install Text2"

### Tính năng Offline:
- Tự động cache nội dung khi online
- Truy cập cached content khi offline
- Background sync khi có kết nối trở lại

## 🔧 Cấu hình và Tùy chỉnh

### Thêm icons mới:
1. Tạo icons với kích thước 192x192 và 512x512
2. Cập nhật `manifest.json` với đường dẫn mới
3. Thêm vào `STATIC_FILES` trong service worker
4. Cập nhật cache version trong service worker

**Logo hiện tại**: `/logoc.jpg` (192x192 và 512x512)

### Thay đổi cache strategy:
- Sửa đổi logic trong `service-worker.js`
- Có thể chọn: cache-first, network-first, stale-while-revalidate

### Thêm push notifications:
1. Cấu hình VAPID keys
2. Thêm subscription logic
3. Gửi notifications từ server

## 📊 Analytics và Monitoring

### Events được track:
- `pwa_installed` - Khi user cài đặt PWA
- Service worker registration status
- Cache hit/miss rates
- Offline usage statistics

### Debug PWA:
1. Mở Chrome DevTools
2. Vào tab "Application"
3. Kiểm tra:
   - Manifest
   - Service Workers
   - Cache Storage
   - Background Services

## 🛠️ Troubleshooting

### PWA không cài đặt được:
- Kiểm tra HTTPS
- Đảm bảo manifest.json hợp lệ
- Kiểm tra service worker registration

### Cache không hoạt động:
- Xóa cache cũ trong DevTools
- Kiểm tra service worker status
- Reload trang và kiểm tra network tab

### Offline không hoạt động:
- Kiểm tra offline.html có được cache
- Đảm bảo service worker đang active
- Test với DevTools offline mode

## 🔄 Updates và Maintenance

### Cập nhật service worker:
1. Thay đổi `CACHE_NAME` version
2. Deploy code mới
3. Service worker sẽ tự động update

### Cập nhật manifest:
- Thay đổi version trong manifest
- Clear cache để force update

## 📈 Performance Tips

1. **Optimize images**: Sử dụng WebP format
2. **Minimize cache size**: Chỉ cache resources cần thiết
3. **Lazy loading**: Load content khi cần
4. **Preload critical resources**: Thêm vào manifest

## 🔒 Security Considerations

- ✅ HTTPS required cho PWA
- ✅ Content Security Policy
- ✅ Secure cache headers
- ✅ Validate manifest.json

## 📱 Browser Support

- ✅ Chrome 67+
- ✅ Firefox 67+
- ✅ Safari 11.1+
- ✅ Edge 79+
- ✅ Samsung Internet 7.2+

---

**Lưu ý**: PWA features có thể khác nhau tùy theo browser và platform. Test kỹ trên các thiết bị và browser khác nhau. 