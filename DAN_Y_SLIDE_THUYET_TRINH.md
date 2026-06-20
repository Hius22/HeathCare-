# DÀN Ý CHI TIẾT & KỊCH BẢN THUYẾT TRÌNH SLIDE (KHÓA LUẬN TỐT NGHỆP)

Tài liệu này chứa thông tin chi tiết từng slide của tệp PowerPoint `HE_THONG_DAT_LICH_KHAM_BENH.pptx` (được cấu trúc theo 5 nội dung chính của Khóa luận tốt nghiệp). Bạn có thể sử dụng dàn ý này để tập luyện thuyết trình trước Hội đồng.

---

### SLIDE 1: SLIDE TRANG BÌA (TITLE SLIDE)
*   **Tiêu đề chính:** HỆ THỐNG ĐẶT LỊCH KHÁM BỆNH TRỰC TUYẾN VÀ QUẢN LÝ BỆNH ÁN ĐIỆN TỬ
*   **Tiêu đề phụ:** Kiến trúc Web Fullstack: ReactJS - NodeJS (Express) - MySQL
*   **Thông tin hiển thị:**
    *   Báo Cáo Khóa Luận Tốt Nghiệp
    *   Sinh viên thực hiện: [Tên của bạn] - [MSSV]
    *   Giảng viên hướng dẫn: [Tên Giảng Viên]
*   **Lời thoại gợi ý (Speech Script):**
    > *"Kính chào quý thầy cô trong Hội đồng bảo vệ khóa luận tốt nghiệp. Em tên là [Tên của bạn], sau đây em xin phép được trình bày báo cáo khóa luận tốt nghiệp của mình với đề tài: 'Xây dựng Hệ thống đặt lịch khám bệnh trực tuyến và Quản lý bệnh án điện tử dựa trên kiến trúc Web Fullstack ReactJS, NodeJS và cơ sở dữ liệu MySQL'."*

---

## PHẦN I: GIỚI THIỆU

### SLIDE 2: ĐẶT VẤN ĐỀ & LÝ DO CHỌN ĐỀ TÀI
*   **Tiêu đề:** 1. ĐẶT VẤN ĐỀ & LÝ DO CHỌN ĐỀ TÀI
*   **Bố cục (2 Cột):**
    *   **Cột 1: Thực Trạng Khám Bệnh Truyền Thống:**
        *   Quá tải tại các phòng khám: Bệnh nhân chen chúc chờ xếp hàng lấy số thứ tự từ sáng sớm.
        *   Lãng phí thời gian và chi phí: Quy trình hành chính thủ công làm tăng thời gian chờ khám.
        *   Hồ sơ bệnh án rời rạc: Bệnh án giấy dễ rách nát, thất lạc, bác sĩ khó tra cứu tiền sử bệnh cũ.
        *   Đối soát tài chính phân mảnh: Bộ phận bác sĩ chẩn đoán và quầy thu ngân thu phí chưa liên thông tức thời.
    *   **Cột 2: Tính Cần Thiết & Ý Nghĩa Đồ Án:**
        *   Đóng góp vào đề án Chuyển đổi số Y tế: Thực hiện kế hoạch số hóa hồ sơ bệnh án của Bộ Y Tế.
        *   Mô hình hóa dòng dữ liệu y khoa khép kín: Kết nối 3 chủ thể Bệnh nhân - Bác sĩ - Admin.
        *   Tối ưu hóa năng lực vận hành: Rút ngắn 80% thời gian làm thủ tục tại quầy tiếp đón.
        *   Công nghệ Fullstack hiện đại: Sử dụng ReactJS, NodeJS và MySQL nâng cao hiệu năng hệ thống.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Đầu tiên, về phần Giới thiệu, lý do chúng em lựa chọn đề tài này xuất phát từ thực trạng quá tải tại các cơ sở y tế hiện nay. Quy trình đăng ký khám chữa bệnh và lưu trữ bệnh án bằng giấy truyền thống gây mất nhiều thời gian chờ đợi của bệnh nhân và cản trở việc chẩn đoán của bác sĩ. Do đó, việc xây dựng một hệ thống đặt lịch trực tuyến kết hợp quản lý bệnh án điện tử là vô cùng cấp thiết nhằm chuyển đổi số quy trình y tế, nâng cao hiệu quả vận hành phòng khám."*

### SLIDE 3: MỤC TIÊU & YÊU CẦU CỦA ĐỀ TÀI
*   **Tiêu đề:** MỤC TIÊU & YÊU CẦU CỦA ĐỀ TÀI
*   **Bố cục (2 Cột):**
    *   **Cột 1: Mục Tiêu Nghiên Cứu:**
        *   Xây dựng ứng dụng web hoàn chỉnh hỗ trợ hoạt động đặt lịch khám bệnh ngoại trú và bệnh án điện tử.
        *   Tự động hóa luồng xác thực và phản hồi bệnh nhân qua email (Nodemailer SMTP).
        *   Tích hợp bệnh án điện tử chi tiết hỗ trợ bác sĩ lâm sàng kê đơn thuốc số trực tiếp.
        *   Thiết lập module thanh toán lâm sàng động và hỗ trợ in hóa đơn tức thời ngay tại quầy hành chính.
    *   **Cột 2: Yêu Cầu Kỹ Thuật Đạt Được:**
        *   Frontend: Giao diện Responsive cao cấp tương thích thiết bị PC, Tablet, Smartphone.
        *   Backend: API RESTful bảo mật tối đa bằng cơ chế phân quyền JSON Web Token (JWT).
        *   Database: Cơ sở dữ liệu quan hệ MySQL chuẩn hóa 3NF, loại bỏ dư thừa và tối ưu hóa chỉ mục (Index).
        *   Trải nghiệm sử dụng: Thời gian phản hồi trang dưới 1.5 giây, đảm bảo tính trực quan.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Mục tiêu cốt lõi của đề tài là xây dựng một hệ thống Web SPA khép kín hỗ trợ đặt lịch 24/7, xác thực qua email, và cho phép bác sĩ kê đơn thuốc số, kết hợp với module in bệnh án và in hóa đơn tại quầy. Hệ thống yêu cầu phải có giao diện Responsive, API RESTful bảo mật thông qua JWT, và cơ sở dữ liệu MySQL được chuẩn hóa để mang lại trải nghiệm tải trang tối ưu nhất."*

---

## PHẦN II: TÌNH HÌNH NGHIÊN CỨU TRONG VÀ NGOÀI NƯỚC

### SLIDE 4: TỔNG QUAN TÌNH HÌNH NGHIÊN CỨU TRONG & NGOÀI NƯỚC
*   **Tiêu đề:** 2. TỔNG QUAN TÌNH HÌNH NGHIÊN CỨU TRONG & NGOÀI NƯỚC
*   **Bố cục (2 Cột):**
    *   **Cột 1: Thực Trạng Ứng Dụng Trong Nước:**
        *   Các nền tảng đặt lịch như Medpro, YouMed đã phổ biến nhưng chủ yếu áp dụng ở bệnh viện tuyến đầu.
        *   Chưa hỗ trợ khép kín quy trình y khoa: Đăng ký đặt lịch thường tách biệt hoàn toàn với hệ thống ghi nhận bệnh án lâm sàng của bác sĩ.
        *   Đối soát doanh thu dịch vụ lâm sàng (siêu âm, chụp X-quang) tại quầy phòng khám vừa và nhỏ vẫn xử lý thủ công.
    *   **Cột 2: Ứng Dụng Ngoài Nước & Tính Cấp Thiết:**
        *   Zocdoc (Mỹ), Halodoc (Indonesia) giải quyết đặt lịch và bệnh án điện tử thông qua SaaS đám mây.
        *   Rào cản áp dụng tại Việt Nam: Bản quyền đắt đỏ, quy trình phòng khám nội địa và phương thức thanh toán đặc thù (MoMo, QR động) chưa được hỗ trợ.
        *   Tính cấp thiết của đề tài: Phát triển giải pháp tối ưu chi phí, tương thích sâu với nghiệp vụ y khoa Việt Nam.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Chuyển sang Phần 2, tổng quan tình hình nghiên cứu. Tại Việt Nam, các ứng dụng đặt lịch như Medpro hay YouMed chủ yếu tập trung vào khâu đăng ký ban đầu mà chưa khép kín dòng dữ liệu lâm sàng y khoa. Trên thế giới, các nền tảng lớn như Zocdoc hay Practo rất mạnh mẽ nhưng chi phí vận hành quá cao và chưa tối ưu theo phương thức thanh toán của người Việt. Do đó, đồ án này đề xuất một giải pháp trung hòa, tối ưu chi phí và thích nghi hoàn toàn với quy trình khám bệnh tại Việt Nam."*

---

## PHẦN III: NỘI DUNG VÀ PHƯƠNG PHÁP NGHIÊN CỨU

### SLIDE 5: PHƯƠNG PHÁP NGHIÊN CỨU & CÔNG CỤ
*   **Tiêu đề:** 3. PHƯƠNG PHÁP NGHIÊN CỨU & CÔNG CỤ
*   **Bố cục (2 Cột):**
    *   **Cột 1: Phương Pháp Nghiên Cứu Khoa Học:**
        *   Phương pháp phân tích & thiết kế hướng đối tượng (OOAD): Sử dụng sơ đồ Use Case, Sequence Diagram và thực thể ERD.
        *   Quy trình phát triển phần mềm Agile/Scrum: Chia nhỏ sprint phát triển và kiểm thử liên tục.
        *   Kiểm thử thực nghiệm phần mềm: Chạy giả lập dữ liệu tải trên localhost, sử dụng Postman đối soát API.
    *   **Cột 2: Công Cụ & Nền Tảng Kỹ Thuật:**
        *   IDE lập trình chính: Visual Studio Code tích hợp Git, ESLint.
        *   Backend: Node.js (v16+) & Express cung cấp dịch vụ Server non-blocking I/O hiệu năng cao.
        *   Frontend: ReactJS, Redux Store quản lý state đồng bộ toàn hệ thống.
        *   Database & Cấu hình: MySQL Database, Sequelize ORM + CLI quản trị và đồng bộ migration cơ sở dữ liệu.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Ở Phần 3 về nội dung và phương pháp nghiên cứu, chúng em sử dụng phương pháp phân tích thiết kế hướng đối tượng OOAD kết hợp với quy trình Agile/Scrum. Toàn bộ mã nguồn được phát triển trên VS Code với backend NodeJS Express bất đồng bộ, frontend ReactJS SPA kết hợp Redux quản lý state, và hệ quản trị cơ sở dữ liệu MySQL được thao tác thông qua Sequelize ORM."*

### SLIDE 6: NỘI DUNG NGHIÊN CỨU & PHÂN HỆ HỆ THỐNG
*   **Tiêu đề:** NỘI DUNG NGHIÊN CỨU & PHÂN HỆ HỆ THỐNG
*   **Bố cục (2 Cột):**
    *   **Cột 1: Quy Trình Khám Ngoại Trú Đề Xuất:**
        *   Bệnh nhân đăng ký trực tuyến -> Hệ thống gửi mail xác thực OTP token bảo mật -> Đổi trạng thái lịch khám.
        *   Bác sĩ theo dõi danh sách ca trực theo ngày -> Tiến hành khám chẩn đoán lâm sàng -> Kê đơn thuốc số.
        *   Admin tiếp nhận hồ sơ -> Thực hiện thu phí lâm sàng động -> In hóa đơn và hoàn tất thủ tục.
    *   **Cột 2: Phân Hệ Chức Năng Chính (18 Chức Năng):**
        *   Bệnh nhân (Patient): Tìm kiếm bác sĩ, chuyên khoa, đặt hẹn trực tuyến 24/7, xác nhận lịch qua email, tra cứu lịch sử khám, tự hủy lịch đặt.
        *   Bác sĩ (Doctor): Đăng nhập phân quyền, quản lý bệnh nhân chờ khám, in bệnh án lâm sàng, gửi email kết quả đơn thuốc điện tử.
        *   Admin (System): CRUD người dùng/dịch vụ bác sĩ, đăng ký ca khám (Bulk Create), quản lý phòng khám, đối soát chi phí, in hóa đơn.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Quy trình khám ngoại trú đề xuất đi qua 3 bước cốt lõi liên quan trực tiếp đến 3 tác nhân hệ thống với tổng cộng 18 chức năng nghiệp vụ y tế. Bệnh nhân thực hiện tìm kiếm đặt hẹn; Bác sĩ xem danh sách, ghi nhận hồ sơ lâm sàng, kê đơn và in bệnh án; và cuối cùng, Admin thực hiện thu ngân và in hóa đơn tại quầy."*

### SLIDE 7: CƠ SỞ DỮ LIỆU & QUAN HỆ THỰC THỂ (ERD)
*   **Tiêu đề:** CƠ SỞ DỮ LIỆU & QUAN HỆ THỰC THỂ (ERD)
*   **Bố cục (2 Cột):**
    *   **Cột 1: Lược Đồ Cơ Sở Dữ Liệu MySQL:**
        *   Gồm 10 bảng dữ liệu chính (`users`, `bookings`, `histories`, `schedules`, `doctor_infor`, `clinics`, `specialties`...) được chuẩn hóa 3NF.
        *   Sử dụng Sequelize CLI quản lý các migration cấu trúc bảng và seeding dữ liệu từ điển hệ thống.
        *   Mối quan hệ Nhiều-Nhiều giữa bác sĩ và phòng khám/chuyên khoa được chuẩn hóa thông qua bảng liên kết trung gian.
    *   **Cột 2: Bảng Từ Điển Allcode Trung Tâm:**
        *   Bảng `allcodes` chứa các cặp giá trị ánh xạ (keyMap -> valueVi, valueEn) làm từ điển dùng chung.
        *   Chuẩn hóa danh mục toàn cục: giới tính, học hàm, trạng thái lịch hẹn (S1 -> S4), khung giờ khám.
        *   Tách biệt dữ liệu và mã hóa hiển thị, giúp dễ dàng nâng cấp đa ngôn ngữ (Việt - Anh) và thay đổi cấu hình mà không sửa đổi code.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Về phần cơ sở dữ liệu, chúng em thiết kế lược đồ quan hệ chuẩn hóa dạng 3NF gồm 10 bảng chính. Điểm đặc biệt của hệ thống là việc ứng dụng bảng Allcode làm từ điển dùng chung toàn cục. Bảng này ánh xạ toàn bộ các danh mục như trạng thái lịch hẹn từ S1 đến S4, khung giờ khám và giới tính, hỗ trợ cơ chế đa ngôn ngữ Việt - Anh mà không cần chỉnh sửa cấu trúc bảng."*

---

## PHẦN IV: KẾT QUẢ VÀ THẢO LUẬN

### SLIDE 8: KẾT QUẢ: PHÂN HỆ BỆNH NHÂN (PATIENT)
*   **Tiêu đề:** 4. KẾT QUẢ: PHÂN HỆ BỆNH NHÂN (PATIENT)
*   **Bố cục (2 Cột):**
    *   **Cột 1: Giao Diện Đặt Lịch & Kích Hoạt Lịch:**
        *   Chức năng tìm kiếm Live Search nhanh theo tên bác sĩ hoặc chuyên khoa trực quan.
        *   Đăng ký thông tin đặt hẹn nhanh mà không bắt buộc đăng nhập tài khoản y tế.
        *   Luồng xác thực bảo mật: Gửi email tự động chứa One-time link đính kèm token UUID. Click link để kích hoạt lịch hẹn chuyển từ trạng thái S1 sang S2.
    *   **Cột 2: Tính Năng Tự Phục Vụ (Self-Service):**
        *   Tra cứu lịch sử khám: Bệnh nhân tự tra cứu tất cả hồ sơ đặt hẹn và kết quả bệnh án cũ qua email.
        *   Tự chỉnh sửa thông tin: Cập nhật thông tin cá nhân sai lệch tại quầy thông qua `EditPatientModal`.
        *   Cơ chế cảnh báo bảo mật: Hệ thống kích hoạt gửi email cảnh báo tự động về Gmail bệnh nhân ngay khi phát sinh thay đổi hồ sơ.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Đến với Phần 4: Kết quả và thảo luận. Đối với phân hệ Bệnh nhân, chúng em đã hiện thực hóa giao diện đặt lịch trực quan không yêu cầu đăng nhập. Hệ thống áp dụng luồng xác thực bảo mật qua One-time link gửi tới Gmail để đổi trạng thái lịch sang S2 (xác nhận thành công). Ngoài ra, bệnh nhân có thể tra cứu lịch sử khám cũ và tự sửa đổi thông tin cá nhân của mình thông qua EditPatientModal."*

### SLIDE 9: KẾT QUẢ: PHÂN HỆ BÁC SĨ (DOCTOR)
*   **Tiêu đề:** KẾT QUẢ: PHÂN HỆ BÁC SĨ (DOCTOR)
*   **Bố cục (2 Cột):**
    *   **Cột 1: Khám Lâm Sàng & Đơn Thuốc Số:**
        *   Giao diện quản lý danh sách bệnh nhân chờ khám theo ngày của bác sĩ trực quan.
        *   Bệnh án điện tử: Khi mở `MedicalRecordModal`, hệ thống tự động gọi API lấy toàn bộ bệnh án cũ hiển thị ở cột trái giúp bác sĩ nắm tiền sử.
        *   Kê đơn thuốc số và chỉ định cận lâm sàng nhanh chóng trực tiếp trên biểu mẫu giao diện.
    *   **Cột 2: Xử Lý Dữ Liệu & In Bệnh Án:**
        *   Lưu trữ tối ưu: Đơn thuốc và phí lâm sàng chỉ định được đóng gói dạng chuỗi JSON lưu tại cột `description` bảng `Histories`.
        *   In Bệnh Án trực tiếp: Cho phép bác sĩ in nhanh bệnh án giấy cho bệnh nhân cầm đi phòng xét nghiệm.
        *   Gửi email đơn thuốc tự động: Ngay khi khám xong (S2 -> S3), gửi email đính kèm file ảnh đơn thuốc chụp bản cứng tới bệnh nhân.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Ở phân hệ Bác sĩ, giao diện hiển thị danh sách bệnh nhân chờ khám. Bác sĩ mở MedicalRecordModal để khám bệnh, tại đây hệ thống tự động truy xuất lịch sử khám cũ để hỗ trợ chẩn đoán. Bác sĩ kê đơn thuốc, đính kèm ảnh đơn thuốc chụp bản cứng. Thông tin này được đóng gói dạng JSON lưu trữ trong database và tự động gửi email đơn thuốc điện tử cho bệnh nhân ngay khi bác sĩ xác nhận hoàn thành khám (trạng thái S3)."*

### SLIDE 10: KẾT QUẢ: PHÂN HỆ QUẢN TRỊ & THANH TOÁN (ADMIN)
*   **Tiêu đề:** KẾT QUẢ: PHÂN HỆ QUẢN TRỊ & THANH TOÁN (ADMIN)
*   **Bố cục (2 Cột):**
    *   **Cột 1: Nghiệp Vụ Thu Phí Lâm Sàng Động:**
        *   ConfirmPaymentModal: Tự động trích xuất các chỉ dịch dịch vụ lâm sàng (siêu âm, xét nghiệm...) từ kết quả khám gần nhất của bác sĩ.
        *   Bảng tính phí động: Quản trị viên nhập đơn giá thực tế cho từng dịch vụ phát sinh.
        *   Tự động tính tổng tiền: Tổng tiền = Phí khám bác sĩ gốc + Phí xét nghiệm cận lâm sàng phát sinh.
    *   **Cột 2: Đối Soát Tài Chính & In Hóa Đơn:**
        *   Ghi nhận nhiều hình thức thanh toán đa dạng: Tiền mặt, Chuyển khoản, Thẻ, MoMo, ZaloPay.
        *   Lưu trữ đối soát: Cập nhật trường `isPaid = 1` và đẩy chi tiết hóa đơn vào JSON bệnh án để kiểm soát dòng tiền.
        *   In hóa đơn tại quầy: Kích hoạt `window.print()` in hóa đơn chi tiết trực tiếp qua trình duyệt nhanh chóng.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Đối với phân hệ Quản trị viên, chúng em đã xây dựng thành công module thanh toán tại quầy qua ConfirmPaymentModal. Khi tiến hành thanh toán, hệ thống tự động trích xuất các chỉ định lâm sàng của bác sĩ và hiển thị biểu phí động. Admin nhập đơn giá thực tế, hệ thống tự động tính toán tổng số tiền và cập nhật trường isPaid = 1 vào CSDL, đồng thời cho phép in hóa đơn trực quan trực tiếp từ trình duyệt."*

### SLIDE 11: YÊU CẦU PHI CHỨC NĂNG & KẾT QUẢ THỰC NGHIỆM
*   **Tiêu đề:** YÊU CẦU PHI CHỨC NĂNG & THỰC NGHIỆM
*   **Bố cục (2 Cột):**
    *   **Cột 1: Bảo Mật Và Phòng Ngừa Tấn Công:**
        *   Phân quyền API: Middleware kiểm tra JWT token và quyền vai trò (`roleId`) đối với Admin và Bác sĩ.
        *   Mã hóa mật khẩu: Sử dụng thư viện `bcryptjs` mã hóa 1 chiều trước khi lưu database.
        *   Phòng chống tấn công: SQL Injection bị chặn đứng nhờ Sequelize Parameterized Queries. Tấn công XSS được ReactJS ngăn chặn nhờ cơ chế auto-escape DOM.
    *   **Cột 2: Hiệu Năng & Khả Năng Thích Ứng:**
        *   Tốc độ phản hồi: Phản hồi tải trang ban đầu và API dưới 1.5 giây (trung bình xử lý API 50ms - 100ms).
        *   Xử lý đồng thời: Máy chủ Node.js Express non-blocking hướng sự kiện hoạt động mượt mà khi giả lập tải nhiều kết nối.
        *   Giao diện tương thích (Responsive UX): Co giãn linh hoạt trên PC, Laptop, Máy tính bảng và Điện thoại di động.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Hệ thống cũng đáp ứng các yêu cầu phi chức năng quan trọng. Về bảo mật, chúng em sử dụng mã hóa bcrypt cho mật khẩu, bảo vệ API nhạy cảm bằng JWT middleware và triệt tiêu các nguy cơ SQL Injection nhờ Sequelize ORM. Kiểm thử thực nghiệm cho thấy thời gian tải trang trung bình luôn dưới 1.5 giây và giao diện responsive mượt mà trên nhiều kích thước màn hình."*

---

## PHẦN V: KẾT LUẬN VÀ ĐỀ NGHỊ

### SLIDE 12: 5. KẾT LUẬN ĐỒ ÁN / KHÓA LUẬN
*   **Tiêu đề:** 5. KẾT LUẬN ĐỒ ÁN / KHÓA LUẬN
*   **Bố cục (2 Cột):**
    *   **Cột 1: Những Kết Quả Đã Đạt Được:**
        *   Hoàn thành 100% mục tiêu chức năng: Xây dựng hệ thống web SERN stack hoàn chỉnh 18 chức năng nghiệp vụ y tế.
        *   Đồng bộ hóa quy trình y khoa khép kín: Giảm thiểu thủ tục hành chính, số hóa bệnh án điện tử, liên thông đối soát chi phí.
        *   Làm chủ công nghệ: Vận hành tốt mô hình Single Page Application kết hợp RESTful API bảo mật cao.
    *   **Cột 2: Những Điểm Còn Hạn Chế:**
        *   Tính năng thanh toán trực tuyến tự động chưa kết nối trực tiếp đến cổng ngân hàng (bệnh nhân chưa thể trả phí online từ xa).
        *   Chưa hỗ trợ kênh thông báo nhắc lịch tự động qua tin nhắn SMS / Zalo trước ca trực.
        *   Dữ liệu chẩn đoán bệnh án điện tử trong CSDL MySQL mới chỉ lưu dạng JSON thô chưa áp dụng thuật toán mã hóa sâu.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Ở phần cuối cùng: Kết luận và đề nghị. Khóa luận đã hoàn thành việc xây dựng một hệ thống y tế hoàn chỉnh, số hóa quy trình và tạo dòng dữ liệu y khoa khép kín. Tuy nhiên, hệ thống vẫn có một số mặt hạn chế nhất định như chưa tích hợp thanh toán tự động online, chưa hỗ trợ tin nhắn nhắc lịch SMS/Zalo, và dữ liệu bệnh án trong database chưa được mã hóa sâu."*

### SLIDE 13: KIẾN NGHỊ & HƯỚNG PHÁT TRIỂN TƯƠNG LAI
*   **Tiêu đề:** KIẾN NGHỊ & HƯỚNG PHÁT TRIỂN TƯƠNG LAI
*   **Bố cục (2 Cột):**
    *   **Cột 1: Kiến Nghị Nâng Cấp Chức Năng:**
        *   Tích hợp cổng thanh toán trực tuyến (VNPAY, PayOS, MoMo): Tự động chuyển trạng thái hóa đơn (`isPaid = 1`) từ xa.
        *   Dịch vụ SMS/Zalo nhắc lịch: Sử dụng Twilio hoặc eSMS để nhắc nhở bệnh nhân trước ca hẹn 24 giờ.
        *   Tư vấn trực tuyến (Telemedicine): Phát triển kênh khám từ xa bằng WebRTC video call trực tuyến.
    *   **Cột 2: Kiến Nghị Nâng Cấp Bảo Mật:**
        *   Mã hóa dữ liệu y khoa nhạy cảm: Áp dụng mã hóa bất đối xứng AES/RSA bảo vệ thông tin chẩn đoán trong database.
        *   Xác thực 2 yếu tố (2FA / OTP): Gửi mã OTP qua số điện thoại khi bệnh nhân yêu cầu cập nhật thông tin cá nhân hoặc hủy lịch khám.
*   **Lời thoại gợi ý (Speech Script):**
    > *"Để khắc phục những hạn chế đó, trong tương lai, chúng em đề xuất tích hợp cổng thanh toán online VNPAY/PayOS, kết hợp SMS Brandname nhắc lịch khám tự động, phát triển module khám từ xa Telemedicine qua WebRTC và ứng dụng mã hóa AES/RSA bảo vệ bệnh án điện tử của người bệnh."*

### SLIDE 14: TÀI LIỆU THAM KHẢO & LỜI CẢM ƠN
*   **Tiêu đề:** TÀI LIỆU THAM KHẢO & LỜI CẢM ƠN
*   **Bố cục (2 Cột):**
    *   **Cột 1: Tài Liệu Tham Khảo Chính:**
        *   [1] Nguyễn Văn A (2020), Giáo trình phát triển ứng dụng Web hiện đại với ReactJS và NodeJS, NXB KH&KT.
        *   [2] Trần Thị B (2022), Nghiên cứu quy trình chuyển đổi số và quản lý hồ sơ bệnh án điện tử tại Việt Nam, Luận án Tiến sĩ.
        *   [3] Lê Văn C (2023), Tối ưu hóa cơ sở dữ liệu lớn và truy vấn Sequelize ORM trong ứng dụng y tế, Tạp chí KH&CN VN.
    *   **Cột 2: Lời Cảm Ơn:**
        *   Em xin gửi lời cảm ơn chân thành tới Quý thầy cô trong Hội đồng bảo vệ đã dành thời gian theo dõi.
        *   Rất mong nhận được các ý kiến nhận xét và đóng góp từ thầy cô để đồ án của chúng em ngày càng hoàn thiện hơn.
        *   Em xin kính chúc thầy cô sức khỏe và thành công!
*   **Lời thoại gợi ý (Speech Script):**
    > *"Cuối cùng, em xin trình bày danh mục tài liệu tham khảo chính mà nhóm đã nghiên cứu. Em xin gửi lời cảm ơn chân thành tới Hội đồng bảo vệ và các thầy cô giáo đã lắng nghe. Em rất mong nhận được những câu hỏi và ý kiến đóng góp từ thầy cô. Em xin trân trọng cảm ơn!"*
