# Hướng dẫn

### Cách chạy chương trình

1. **Clone project** về máy.
2. Mở terminal tại project, sau đó chạy lệnh:
   ```bash
   yarn
   ```
3. Để khởi chạy chương trình, chạy lệnh:
   ```bash
   yarn dev
   ```

### Một vài lưu ý

- **Server** sẽ chạy ở port **8080**.
- **Logic** được cài đặt theo mô hình: **Controller -> Service**.
- **Cấu hình route** theo mẫu đã có sẵn.
- **API upload ảnh** cần sử dụng middleware để xử lý việc upload.
- **Kiểu dữ liệu** được đặt trong thư mục `@type` với các file có đuôi `.d.ts`, để khi sử dụng không cần phải import.
- Để trả về lỗi có 2 cách:

  1. **Throw ErrorHandler**: Sử dụng khi cần trả về lỗi do validation.
  2. **Throw error**: Sử dụng khi gặp lỗi từ server (dùng trong trycatch).

  (Xem ví dụ mẫu trong code để biết thêm chi tiết).

### Cách push code lên GitHub

1. Tạo **nhánh mới** với tên nhánh là tên chức năng bạn đang làm.
2. **Push code** lên nhánh mới và tạo **pull request**.
3. **Trước khi làm**, luôn nhớ **pull code mới nhất** để đồng bộ với dự án.
4. **Nhánh master** được bảo vệ, không thể push code trực tiếp lên nhánh này.
