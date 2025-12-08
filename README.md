# 🎨 Sprite Sheet Generator

**Công cụ tạo sprite sheet chuyên nghiệp từ nhiều ảnh riêng lẻ**

[![Deploy to GitHub Pages](https://github.com/yourusername/create-sprites-sheet/workflows/Deploy%20Vue%20to%20GitHub%20Pages/badge.svg)](https://github.com/yourusername/create-sprites-sheet/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Tính năng

### 🎯 Core Features

- **Upload linh hoạt**: Upload từng ảnh, theo hàng, hoặc hàng loạt
- **Tách Sprite Sheet**: Tự động tách sprite sheet thành các ô riêng lẻ
- **Auto Resize**: Tự động resize ảnh về kích thước chuẩn
- **Preview**: Xem trước sprite sheet trước khi tạo
- **Download**: Tải về sprite sheet dạng PNG

### 🔧 Advanced Features

- **Auto Calculate Grid**: Tự động tính số hàng/cột từ số lượng ảnh
- **Auto Square Mode**: Tạo grid vuông tối ưu từ số ảnh
- **Skip Empty Rows**: Tự động bỏ qua dòng trống
- **Dynamic Grid**: Thêm/xóa/chèn hàng và cột tùy ý
- **Flexible Upload**: Upload bất kỳ số lượng ảnh cho mỗi hàng

### 🎨 UI/UX

- **Dark Theme**: Giao diện tối hiện đại
- **Responsive**: Hoạt động tốt trên mọi thiết bị
- **Smooth Animations**: Hiệu ứng mượt mà
- **Horizontal Scroll**: Grid scroll ngang khi có nhiều cột
- **Visual Feedback**: Loading states và thông báo rõ ràng

## 🚀 Demo

[Live Demo](https://trongtien02m.github.io/create-sprites-sheet/)

## 🛠️ Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS with CSS Variables
- **Canvas API**: Image processing

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/trongtien02m/create-sprites-sheet.git
cd create-sprites-sheet

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

## 📖 Usage Guide

### 1. Tạo Grid Cơ Bản

```
1. Nhập số hàng và cột (ví dụ: 5 hàng × 10 cột)
2. Nhập kích thước ô (mặc định: 64px)
3. Click "Tạo Layout"
```

### 2. Upload Ảnh

#### **Cách 1: Upload từng ô**

- Click vào ô trống
- Chọn 1 ảnh
- Ảnh tự động resize về kích thước ô

#### **Cách 2: Upload theo hàng**

- Click nút "📤 Upload" ở cuối hàng
- Chọn nhiều ảnh (có thể ít hơn hoặc nhiều hơn số cột)
- Ảnh được điền vào các ô theo thứ tự

#### **Cách 3: Upload hàng loạt**

- Click "📤 Upload Hàng Loạt"
- Chọn tất cả ảnh cần upload
- Ảnh tự động điền vào grid từ trái sang phải, trên xuống dưới

#### **Cách 4: Tách Sprite Sheet**

- Click "📎 Tách Sprite Sheet"
- Chọn 1 file sprite sheet hoàn chỉnh
- Tự động tách thành các ô theo grid

### 3. Auto Calculate Mode

#### **Auto Rows** (Tự động tính hàng)

```
1. Nhập số cột: 10
2. Tick ✓ "Tự động" ở Số Hàng
3. Upload 50 ảnh
→ Tự động tạo 5 hàng × 10 cột
```

#### **Auto Cols** (Tự động tính cột)

```
1. Nhập số hàng: 5
2. Tick ✓ "Tự động" ở Số Cột
3. Upload 50 ảnh
→ Tự động tạo 5 hàng × 10 cột
```

#### **Auto Square** (Tự động tạo grid vuông)

```
1. Tick ✓ cả 2: "Tự động" ở Hàng VÀ Cột
2. Upload 50 ảnh
→ Tự động tạo 7×7 (49 ảnh, bỏ 1 ảnh dư)
```

### 4. Chỉnh sửa Grid

#### **Thêm/Xóa Hàng**

- Click ➡️ để chèn hàng trước vị trí đó
- Click 🗑️ để xóa hàng
- Click "➕ Thêm Hàng" để thêm hàng cuối

#### **Thêm/Xóa Cột**

- Click ⬇️ ở header để chèn cột trước vị trí đó
- Click ❌ ở header để xóa cột

### 5. Tạo Sprite Sheet

```
1. Upload đủ ảnh cho tất cả ô
2. Click "👁️ Preview" để xem trước
3. Click "✨ Tạo Sprite Sheet"
4. Click "💾 Tải Về" để download
```

## 🎯 Use Cases

### Game Development

- Tạo sprite sheet cho nhân vật
- Tạo tileset cho map
- Tạo icon set cho UI

### Animation

- Tạo sprite sheet cho animation frames
- Tạo sprite sheet cho particle effects

### Web Development

- Tạo icon sprite sheet
- Tạo image sprite cho CSS

## 🏗️ Project Structure

```
create-sprites-sheet/
├── src/
│   ├── components/
│   │   ├── GridConfigForm.vue      # Grid configuration
│   │   ├── SpriteGrid.vue           # Grid display
│   │   ├── UploadActions.vue        # Upload buttons
│   │   └── PreviewModal.vue         # Preview modal
│   ├── composables/
│   │   └── useImageUtils.ts         # Image utilities
│   ├── App.vue                      # Main app
│   ├── main.ts                      # Entry point
│   └── style.css                    # Global styles
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Configuration

### Vite Config

```typescript
// vite.config.ts
export default defineConfig({
  base: '/create-sprites-sheet/', // GitHub Pages base path
  plugins: [vue()],
})
```

### TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Vite team for the blazing fast build tool
- All contributors who helped improve this project

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Contact me at your.email@example.com

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
