# Sprite Sheet Generator - Đặc Tả Kỹ Thuật

## Tổng Quan

Ứng dụng web cho phép người dùng tạo sprite sheet bằng cách upload và sắp xếp nhiều ảnh vào một lưới (grid) tùy chỉnh, sau đó xuất ra file ảnh sprite sheet hoàn chỉnh.

## Mục Tiêu Người Dùng

**User Story:** Là một game developer/designer, tôi muốn upload nhiều ảnh riêng lẻ và tạo sprite sheet theo layout tùy chỉnh để sử dụng trong dự án game/web của mình.

## Tính Năng Chính

### 1. Cấu Hình Layout

- **Input Fields:**
  - Số hàng (rows): Input number
  - Số cột (columns): Input number
- **Nút "Tạo Layout":** Khi nhấn, tạo ra lưới placeholder theo số hàng và cột đã nhập

### 2. Upload Ảnh Theo Hàng

- **Hover Interaction:**
  - Khi hover vào bất kỳ hàng nào, hiển thị text "Upload Ảnh" hoặc icon upload
  - Click vào hàng để mở file picker
- **Multi-Select:**
  - Cho phép chọn nhiều ảnh cùng lúc cho mỗi hàng
  - Số ảnh được chọn phải khớp với số cột đã định nghĩa
- **Preview:**
  - Sau khi chọn ảnh, tự động ghép và hiển thị ảnh lên các ô trong hàng đó
  - Người dùng có thể review trước khi tiếp tục

### 3. Quản Lý Ảnh

- **Hiển thị:**
  - Mỗi ô trong lưới hiển thị ảnh đã upload
  - Hỗ trợ preview thumbnail
- **Thay Đổi:**
  - Cho phép thay thế ảnh trong từng ô nếu cần
  - Có thể xóa và upload lại

### 4. Xuất Sprite Sheet

- **Nút "Tạo Sprite Sheet":**
  - Kích hoạt khi đã có đủ ảnh trong tất cả các ô
  - Ghép tất cả ảnh thành một file ảnh duy nhất
- **Download:**
  - Cho phép tải sprite sheet đã tạo về máy
  - Format: PNG (hoặc các format khác tùy chọn)
  - Tên file mặc định: `sprite-sheet-[timestamp].png`

## Luồng Sử Dụng (User Flow)

1. **Bước 1:** Người dùng truy cập trang web
2. **Bước 2:** Nhập số hàng và cột mong muốn
3. **Bước 3:** Nhấn "Tạo Layout" → Hiển thị lưới placeholder
4. **Bước 4:** Hover vào hàng 1 → Click để upload ảnh
5. **Bước 5:** Chọn nhiều ảnh (số lượng = số cột)
6. **Bước 6:** Ảnh được hiển thị lên hàng 1 để review
7. **Bước 7:** Lặp lại bước 4-6 cho các hàng còn lại
8. **Bước 8:** Nhấn "Tạo Sprite Sheet"
9. **Bước 9:** Download file sprite sheet về máy

## Yêu Cầu Kỹ Thuật

### Chức Năng Bắt Buộc

- [ ] Tạo layout động theo input hàng/cột
- [ ] Upload nhiều ảnh cùng lúc
- [ ] Hiển thị preview ảnh trong lưới
- [ ] Ghép ảnh thành sprite sheet
- [ ] Download sprite sheet

### Trải Nghiệm Người Dùng

- [ ] Giao diện trực quan, dễ sử dụng
- [ ] Hover effects rõ ràng
- [ ] Validation input (số hàng/cột > 0)
- [ ] Thông báo lỗi khi upload sai số lượng ảnh
- [ ] Loading state khi xử lý ảnh

### Tối Ưu Hóa

- [ ] Hỗ trợ các định dạng ảnh phổ biến (PNG, JPG, WEBP)
- [ ] Xử lý ảnh có kích thước khác nhau
- [ ] Responsive design cho mobile/tablet
