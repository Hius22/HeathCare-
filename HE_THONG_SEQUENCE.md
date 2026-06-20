# BIỂU ĐỒ TUẦN TỰ HỆ THỐNG
## HỆ THỐNG ĐẶT LỊCH KHÁM BỆNH TRỰC TUYẾN (HEALTHCARE BOOKING SYSTEM)

Tài liệu này cung cấp các biểu đồ tuần tự (Sequence Diagrams) mô tả chi tiết luồng tương tác giữa các thành phần trong hệ thống: **Người dùng (Bệnh nhân/Bác sĩ/Admin)**, **Giao diện Client (ReactJS)**, **Máy chủ (NodeJS API)**, **Cơ sở dữ liệu (MySQL Database/Sequelize)** và **Hệ thống gửi Email**.

---

## MỤC LỤC
1. [XÁC THỰC TÀI KHOẢN (AUTHENTICATION)](#1-xác-thực-tài-khoản-authentication)
   - [1.1 Đăng nhập hệ thống](#11-đăng-nhập-hệ-thống)
   - [1.2 Đăng xuất hệ thống](#12-đăng-xuất-hệ-thống)
2. [PHÂN HỆ BỆNH NHÂN (PATIENT)](#2-phân-hệ-bệnh-nhân-patient)
   - [2.1 Tìm kiếm & Xem chi tiết thông tin](#21-tìm-kiếm--xem-chi-tiết-thông-tin)
   - [2.2 Đặt lịch hẹn khám bệnh](#22-đặt-lịch-hẹn-khám-bệnh)
   - [2.3 Xác nhận đặt lịch qua Email](#23-xác-nhận-đặt-lịch-qua-email)
   - [2.4 Tra cứu lịch sử & Hủy lịch khám](#24-tra-cứu-lịch-sử--hủy-lịch-khám)
3. [PHÂN HỆ BÁC SĨ (DOCTOR)](#3-phân-hệ-bác-sĩ-doctor)
   - [3.1 Xem lịch làm việc/ca khám](#31-xem-lịch-làm-việcca-khám)
   - [3.2 Xác nhận khám xong & Gửi hóa đơn/đơn thuốc](#32-xác-nhận-khám-xong--gửi-hóa-đơnđơn-thuốc)
   - [3.3 Hủy lịch hẹn của bệnh nhân](#33-hủy-lịch-hẹn-của-bệnh-nhân)
4. [PHÂN HỆ QUẢN TRỊ VIÊN (ADMIN)](#4-phân-hệ-quản-trị-viên-admin)
   - [4.1 Quản lý người dùng (CRUD Users)](#41-quản-lý-người-dùng-crud-users)
   - [4.2 Cấu hình thông tin chi tiết bác sĩ](#42-cấu-hình-thông-tin-chi-tiết-bác-sĩ)
   - [4.3 Thiết lập lịch khám cho bác sĩ](#43-thiết-lập-lịch-khám-cho-bác-sĩ)
   - [4.4 Quản lý Chuyên khoa (CRUD Specialty)](#44-quản-lý-chuyên-khoa-crud-specialty)
   - [4.5 Cấu hình Thông tin Phòng khám (Cơ sở y tế)](#45-cấu-hình-thông-tin-phòng-khám-cơ-sở-y-tế)
   - [4.6 Quản lý lịch hẹn toàn hệ thống](#46-quản-lý-lịch-hẹn-toàn-hệ-thống)

---

## 1. XÁC THỰC TÀI KHOẢN (AUTHENTICATION)

### 1.1 Đăng nhập hệ thống
Mô tả quy trình người dùng (Admin, Bác sĩ, hoặc Bệnh nhân) đăng nhập vào hệ thống để xác thực quyền truy cập.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng (Admin/Doctor)
    participant UI as ReactJS Frontend (/login)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)

    User->>UI: Nhập Email & Password và nhấn "Đăng nhập"
    UI->>API: POST /api/login {email, password}
    activate API
    API->>DB: Tìm User theo email trong bảng Users
    DB-->>API: Trả về thông tin User (gồm password đã hash, roleId)
    
    alt Không tìm thấy User
        API-->>UI: Trả về lỗi: Email không tồn tại (errCode = 1)
        UI-->>User: Hiển thị thông báo "Email không tồn tại!"
    else Tìm thấy User
        API->>API: So sánh password nhập vào với password hash (bcrypt.compare)
        alt Mật khẩu sai
            API-->>UI: Trả về lỗi: Sai mật khẩu (errCode = 2)
            UI-->>User: Hiển thị thông báo "Mật khẩu không chính xác!"
        else Mật khẩu đúng
            API-->>UI: Trả về thông tin User & JWT token (errCode = 0)
            UI->>UI: Lưu thông tin đăng nhập vào Redux store & localStorage
            UI-->>User: Điều hướng tới Dashboard tương ứng với vai trò (roleId)
        end
    end
    deactivate API
```

---

### 1.2 Đăng xuất hệ thống
Mô tả tiến trình xóa phiên làm việc và đăng xuất khỏi giao diện hệ thống.

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant UI as ReactJS Frontend
    
    User->>UI: Nhấn chọn nút "Đăng xuất" (Logout)
    UI->>UI: Dispatch action LOGOUT_USER tới Redux
    UI->>UI: Xóa thông tin User khỏi Redux state & LocalStorage/Cookies
    UI-->>User: Điều hướng về màn hình đăng nhập (/login)
```

---

## 2. PHÂN HỆ BỆNH NHÂN (PATIENT)

### 2.1 Tìm kiếm & Xem chi tiết thông tin
Mô tả cách bệnh nhân tìm kiếm thông tin phòng khám, chuyên khoa hoặc bác sĩ và xem chi tiết trên giao diện.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Bệnh nhân
    participant UI as ReactJS Frontend
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)

    %% Search Flow
    Patient->>UI: Nhập từ khóa tìm kiếm (bác sĩ/chuyên khoa/phòng khám)
    UI->>API: GET /api/top-doctor-home hoặc tìm kiếm chuyên khoa/phòng khám
    API->>DB: Truy vấn dữ liệu theo từ khóa
    DB-->>API: Trả về kết quả phù hợp
    API-->>UI: Phản hồi JSON danh sách kết quả
    UI-->>Patient: Hiển thị danh sách bác sĩ, phòng khám, chuyên khoa

    %% View Detail Flow
    Patient->>UI: Click chọn xem chi tiết bác sĩ/phòng khám/chuyên khoa
    UI->>API: GET /api/get-detail-[doctor/specialty/clinic]-by-id?id=...
    API->>DB: Query bảng Users, Markdown, Doctor_Infor, v.v.
    DB-->>API: Trả về dữ liệu chi tiết
    API-->>UI: Phản hồi JSON thông tin chi tiết & lịch khám khả dụng
    UI-->>Patient: Hiển thị thông tin mô tả, giá khám, địa chỉ và lịch hẹn (slots)
```

---

### 2.2 Đặt lịch hẹn khám bệnh
Mô tả quy trình bệnh nhân điền thông tin và yêu cầu đặt lịch khám bệnh trên hệ thống.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Bệnh nhân
    participant UI as ReactJS Frontend
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)
    participant Mail as Mail Server (Nodemailer)

    Patient->>UI: Chọn khung giờ khám & nhấn nút Đặt lịch
    UI-->>Patient: Hiển thị Booking Modal điền thông tin cá nhân
    Patient->>UI: Điền thông tin (họ tên, SĐT, email, địa chỉ, lý do) và click Xác nhận
    UI->>API: POST /api/patient-book-appointment (Gửi data)
    
    activate API
    API->>DB: Kiểm tra Email bệnh nhân trong bảng Users
    alt Bệnh nhân chưa tồn tại
        API->>DB: Tạo mới User vai trò PATIENT (Bệnh nhân)
        DB-->>API: Trả về User mới
    else Bệnh nhân đã tồn tại
        DB-->>API: Trả về thông tin User
    end

    API->>DB: Tạo bản ghi mới trong bảng Booking (Status = S1 - Chờ xác nhận, Token = Ngẫu nhiên)
    DB-->>API: Lưu thành công và trả về dữ liệu Booking
    
    API->>Mail: Gọi hàm gửi email xác nhận đặt lịch khám (Đính kèm Token link)
    activate Mail
    Mail-->>Patient: Gửi Email chứa link xác nhận cuộc hẹn
    deactivate Mail

    API-->>UI: Trả về kết quả tạo lịch thành công (errCode = 0)
    deactivate API

    UI-->>Patient: Hiển thị thông báo: "Đặt lịch thành công! Vui lòng check email để xác nhận."
```

---

### 2.3 Xác nhận đặt lịch qua Email
Mô tả tiến trình khi bệnh nhân nhấp chọn liên kết xác nhận lịch đặt trong email.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Bệnh nhân
    participant Mail as Hòm thư cá nhân
    participant UI as ReactJS Frontend (/verify-booking)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)

    Patient->>Mail: Mở email và Click vào link xác nhận cuộc hẹn
    Mail->>UI: Điều hướng đến trang verify (kèm params: token & doctorId)
    UI->>API: POST /api/verify-book-appointment (token, doctorId)
    
    activate API
    API->>DB: Tìm bản ghi Booking có token & doctorId khớp, trạng thái S1
    DB-->>API: Trả về thông tin Booking
    
    alt Tìm thấy và hợp lệ
        API->>DB: Cập nhật trạng thái Booking: S1 -> S2 (Đã xác nhận)
        DB-->>API: Lưu thành công
        API-->>UI: Trả về kết quả: Xác nhận thành công (errCode = 0)
        UI-->>Patient: Hiển thị giao diện "Xác nhận lịch khám thành công!"
    else Không tìm thấy hoặc Token hết hạn/Đã được xác nhận trước đó
        API-->>UI: Trả về lỗi (errCode = -1 hoặc -2)
        UI-->>Patient: Hiển thị thông báo "Lịch hẹn không tồn tại hoặc đã được kích hoạt!"
    end
    deactivate API
```

---

### 2.4 Tra cứu lịch sử & Hủy lịch khám
Mô tả quy trình bệnh nhân tự tra cứu lịch hẹn đã đặt của mình thông qua Email và tiến hành hủy lịch hẹn sắp tới.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Bệnh nhân
    participant UI as ReactJS Frontend (/appointments)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)

    %% Tra cứu lịch sử
    Patient->>UI: Nhập email cá nhân và nhấn nút "Tra cứu"
    UI->>API: GET /api/get-patient-history?patientEmail=...
    API->>DB: Query bảng Booking tham chiếu theo Email bệnh nhân (kèm Doctor, Specialty, Allcode)
    DB-->>API: Trả về danh sách các lịch hẹn liên quan
    API-->>UI: Trả về mảng JSON dữ liệu lịch hẹn
    UI-->>Patient: Hiển thị danh sách lịch hẹn phân tab (Tất cả, Sắp tới, Đã khám, Đã hủy)

    %% Hủy lịch hẹn
    Patient->>UI: Click nút "Hủy lịch" của lịch hẹn sắp tới (Status S1 hoặc S2)
    UI-->>Patient: Yêu cầu xác nhận hủy lịch (Confirm Dialog)
    Patient->>UI: Click đồng ý
    UI->>API: POST /api/cancel-booking (doctorId, patientId, timeType, date)
    API->>DB: Tìm bản ghi Booking phù hợp
    DB-->>API: Trả về Booking
    API->>DB: Cập nhật trạng thái Booking sang S4 (Đã hủy)
    DB-->>API: Lưu trạng thái mới thành công
    API-->>UI: Phản hồi kết quả hủy thành công (errCode = 0)
    UI-->>Patient: Thông báo hủy lịch hẹn thành công và cập nhật lại danh sách hiển thị
```

---

## 3. PHÂN HỆ BÁC SĨ (DOCTOR)

### 3.1 Xem lịch làm việc/ca khám
Mô tả cách bác sĩ xem lịch làm việc (ca khám bệnh) được Admin thiết lập cho mình.

```mermaid
sequenceDiagram
    autonumber
    actor Doctor as Bác sĩ
    participant UI as ReactJS Frontend (/doctor/manage-schedule-doctor)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)

    Doctor->>UI: Truy cập trang "Lịch khám của tôi" và chọn ngày xem lịch
    UI->>API: GET /api/get-schedule-doctor-by-date?doctorId=...&date=... (Gửi ID bác sĩ đăng nhập)
    activate API
    API->>DB: Tìm các bản ghi lịch làm việc khớp doctorId và date (Join bảng Allcode lấy giờ)
    DB-->>API: Trả về danh sách lịch làm việc
    API-->>UI: Phản hồi mảng JSON danh sách các ca khám
    deactivate API
    UI-->>Doctor: Hiển thị danh sách ca khám (ca sáng/ca chiều) dạng thống kê thẻ & bảng biểu
```

---

### 3.2 Xác nhận khám xong & Gửi hóa đơn/đơn thuốc
Mô tả nghiệp vụ khi bác sĩ hoàn thành buổi khám và gửi bệnh án/hóa đơn cho bệnh nhân để kết thúc quy trình.

```mermaid
sequenceDiagram
    autonumber
    actor Doctor as Bác sĩ
    participant UI as ReactJS Frontend (/doctor/manage-patient)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)
    participant Mail as Mail Server (Nodemailer)
    actor Patient as Bệnh nhân

    Doctor->>UI: Chọn ngày khám cần xem
    UI->>API: GET /api/get-list-patient-for-doctor?doctorId=...&date=...
    API->>DB: Tìm các bản ghi Booking có doctorId & date khớp, trạng thái S2 (Đã xác nhận)
    DB-->>API: Trả về danh sách bệnh nhân
    API-->>UI: Phản hồi danh sách bệnh nhân
    UI-->>Doctor: Hiển thị bảng bệnh nhân tương ứng

    Doctor->>UI: Thực hiện khám trực tiếp cho bệnh nhân. Chọn "Xác nhận khám xong"
    UI-->>Doctor: Hiển thị RemedyModal (Nhập ghi chú, tải lên ảnh đơn thuốc)
    Doctor->>UI: Nhập ghi chú dặn dò, chọn tệp đơn thuốc và nhấn "Gửi"
    UI->>API: POST /api/send-remedy (doctorId, patientId, email, timeType, date, imageBase64, ghiChu)
    
    activate API
    API->>DB: Cập nhật Booking: S2 -> S3 (Hoàn thành / Đã khám)
    API->>DB: Tạo bản ghi lịch sử bệnh án trong bảng History (Lưu kết quả khám, đơn thuốc)
    DB-->>API: Xác nhận lưu trữ thành công
    
    API->>Mail: Gửi email thông báo kết luận và file đính kèm đơn thuốc/hóa đơn cho bệnh nhân
    activate Mail
    Mail-->>Patient: Gửi Email chi tiết kèm hình ảnh đơn thuốc
    deactivate Mail
    
    API-->>UI: Phản hồi kết quả gửi thành công (errCode = 0)
    deactivate API
    
    UI-->>Doctor: Đóng Modal, báo thành công và tải lại danh sách bệnh nhân
```

---

### 3.3 Hủy lịch hẹn của bệnh nhân
Mô tả luồng nghiệp vụ khi bác sĩ chủ động hủy ca khám của bệnh nhân vì lý do khách quan (ví dụ: lịch bận đột xuất).

```mermaid
sequenceDiagram
    autonumber
    actor Doctor as Bác sĩ
    participant UI as ReactJS Frontend (/doctor/manage-patient)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)
    participant Mail as Mail Server (Nodemailer)
    actor Patient as Bệnh nhân

    Doctor->>UI: Click chọn nút "Hủy lịch" trên hàng của bệnh nhân
    UI-->>Doctor: Hiển thị CancelBookingModal yêu cầu nhập lý do hủy
    Doctor->>UI: Nhập lý do hủy lịch hẹn và click "Xác nhận hủy"
    UI->>API: POST /api/cancel-booking {doctorId, patientId, date, timeType, reason}
    
    activate API
    API->>DB: Cập nhật trạng thái lịch hẹn trong bảng Booking: S2 -> S4 (Đã hủy)
    DB-->>API: Cập nhật dữ liệu thành công
    
    API->>Mail: Gọi hàm gửi email thông báo hủy lịch kèm lý do hủy của bác sĩ
    activate Mail
    Mail-->>Patient: Gửi Email thông báo lịch hẹn đã bị hủy kèm lý do bác sĩ đưa ra
    deactivate Mail

    API-->>UI: Trả về kết quả thành công (errCode = 0)
    deactivate API
    UI-->>Doctor: Đóng Modal, hiển thị toast thông báo thành công và tải lại danh sách bệnh nhân
```

---

## 4. PHÂN HỆ QUẢN TRỊ VIÊN (ADMIN)

### 4.1 Quản lý người dùng (CRUD Users)
Mô tả quy trình Admin thực hiện thao tác quản lý tài khoản người dùng hệ thống. Chức năng dưới đây đặc tả việc tạo mới người dùng, các chức năng sửa/xóa/đọc có luồng tương tự.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant UI as ReactJS Frontend (/system/manage-users)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)

    %% Render Load User
    Admin->>UI: Truy cập trang quản trị tài khoản
    UI->>API: GET /api/get-all-users?id=ALL
    API->>DB: Tìm tất cả người dùng trong bảng Users
    DB-->>API: Trả về mảng dữ liệu Users
    API-->>UI: Trả về danh sách User dạng JSON
    UI-->>Admin: Hiển thị danh sách người dùng trong bảng dữ liệu

    %% Create User
    Admin->>UI: Nhập thông tin người dùng mới (Email, mật khẩu, họ tên, vai trò, giới tính,...) và click "Lưu"
    UI->>API: POST /api/create-new-user (Gửi data)
    activate API
    API->>DB: Kiểm tra Email đã tồn tại chưa
    alt Email đã tồn tại
        DB-->>API: Trả về kết quả trùng lặp
        API-->>UI: Trả về lỗi: Email đã được sử dụng (errCode = 1)
        UI-->>Admin: Toast báo lỗi: Email đã tồn tại!
    else Email chưa tồn tại
        API->>API: Thực hiện Hash mật khẩu của người dùng mới
        API->>DB: Thêm bản ghi mới vào bảng Users
        DB-->>API: Lưu thành công
        API-->>UI: Trả về kết quả thành công (errCode = 0)
        UI->>API: GET /api/get-all-users?id=ALL (Reload dữ liệu mới)
        API->>DB: Truy vấn danh sách người dùng cập nhật
        DB-->>API: Trả về danh sách mới
        API-->>UI: Phản hồi danh sách mới
        UI-->>Admin: Hiển thị bảng danh sách cập nhật mới & thông báo toast thành công
    end
    deactivate API
```

---

### 4.2 Cấu hình thông tin chi tiết bác sĩ
Mô tả quy trình Admin thiết lập giá khám, chuyên khoa, phòng khám liên kết và bài viết giới thiệu cho bác sĩ.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant UI as ReactJS Frontend (/system/manage-doctor)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)

    Admin->>UI: Chọn bác sĩ từ danh sách Select dropdown
    UI->>API: GET /api/get-detail-doctor-by-id?id=...
    API->>DB: Tìm thông tin liên quan (Users join Markdown & Doctor_Infor)
    DB-->>API: Trả về cấu hình hiện tại của bác sĩ
    API-->>UI: Phản hồi chi tiết thông tin
    UI-->>Admin: Đổ dữ liệu hiện tại lên các ô nhập liệu (giá khám, chuyên khoa, Markdown soạn thảo)

    Admin->>UI: Thay đổi thông tin, viết giới thiệu (Markdown) và click "Lưu thông tin"
    UI->>API: POST /api/save-infor-doctors (Truyền các thông tin đã cập nhật)
    activate API
    API->>DB: Tìm thông tin bác sĩ trong CSDL
    alt Đã tồn tại thông tin chi tiết
        API->>DB: Cập nhật thông tin trong bảng Markdown & Doctor_Infor
    else Chưa tồn tại thông tin chi tiết
        API->>DB: Tạo mới bản ghi trong bảng Markdown & Doctor_Infor
    end
    DB-->>API: Lưu/Cập nhật dữ liệu thành công
    API-->>UI: Trả về kết quả thành công (errCode = 0)
    deactivate API
    UI-->>Admin: Toast thông báo "Lưu thông tin bác sĩ thành công!"
```

---

### 4.3 Thiết lập lịch khám cho bác sĩ
Mô tả quy trình Admin chủ động thiết lập hoặc điều chỉnh khung thời gian làm việc (ca khám bệnh) cho từng bác sĩ.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant UI as ReactJS Frontend (/system/manage-schedule)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)

    %% Khởi tạo danh sách bác sĩ & giờ khám
    Admin->>UI: Truy cập trang kế hoạch khám bệnh
    UI->>API: GET /api/get-all-doctors (Lấy danh sách các bác sĩ trong hệ thống)
    API->>DB: Lấy tất cả User có vai trò là DOCTOR
    DB-->>API: Trả về danh sách bác sĩ
    UI->>API: GET /api/allcode?type=TIME (Lấy danh sách các khung giờ mặc định)
    API->>DB: Tìm các bản ghi code hệ thống có type = TIME
    DB-->>API: Trả về danh sách thời gian (ví dụ: T1: 8h-9h, T2: 9h-10h,...)
    API-->>UI: Phản hồi dữ liệu khởi tạo lên UI
    UI-->>Admin: Hiển thị giao diện lập lịch (Chọn Bác sĩ, Chọn ngày, click chọn các khung giờ khám)

    %% Lưu lịch
    Admin->>UI: Chọn Bác sĩ từ dropdown, chọn Ngày khám, chọn các ca khám và bấm "Lưu"
    UI->>API: POST /api/bulk-create-schedule {arrSchedule, doctorId, formattedDate}
    activate API
    API->>DB: Đối chiếu, lọc trùng lặp với lịch hẹn đã có sẵn trong bảng Schedule
    API->>DB: BulkCreate (Thêm hàng loạt) lịch làm việc mới vào bảng Schedule
    DB-->>API: Lưu thành công
    API-->>UI: Trả về kết quả thành công (errCode = 0)
    deactivate API
    UI-->>Admin: Toast thông báo: "Lưu thông tin lịch khám thành công!" và reload bảng danh sách lịch hiện có
```

---

### 4.4 Quản lý Chuyên khoa (CRUD Specialty)
Mô tả luồng công việc của Admin khi thiết lập danh mục Chuyên khoa y khoa mới hoặc sửa đổi chuyên khoa cũ.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant UI as ReactJS Frontend (/system/manage-specialty)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)

    Admin->>UI: Nhập Tên chuyên khoa, chọn ảnh đại diện, viết nội dung và bấm "Lưu"
    UI->>API: POST /api/create-new-specialty {name, imageBase64, descriptionHTML, descriptionMarkdown}
    activate API
    API->>DB: Thêm bản ghi mới vào bảng Specialties
    DB-->>API: Tạo thành công
    API-->>UI: Trả về kết quả thành công (errCode = 0)
    deactivate API
    UI-->>Admin: Hiển thị thông báo Toast "Tạo mới chuyên khoa thành công!" và tải lại danh sách chuyên khoa
```

---

### 4.5 Cấu hình Thông tin Phòng khám (Cơ sở y tế)
Mô tả quy trình Admin thiết lập và cập nhật thông tin giới thiệu, địa chỉ, hình ảnh cho cơ sở y tế duy nhất của hệ thống.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant UI as ReactJS Frontend (/system/manage-clinic)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)

    %% Tải dữ liệu phòng khám hiện tại
    Admin->>UI: Truy cập trang cấu hình thông tin phòng khám
    UI->>API: GET /api/get-clinic-info
    activate API
    API->>DB: Lấy dữ liệu cơ sở y tế duy nhất từ bảng Clinics
    DB-->>API: Trả về thông tin phòng khám (nếu đã được tạo)
    API-->>UI: Phản hồi thông tin (errCode, data)
    deactivate API
    UI-->>Admin: Điền thông tin cũ lên form (tên, địa chỉ, ảnh đại diện, bài viết Markdown)
    
    %% Lưu cấu hình
    Admin->>UI: Nhập thông tin mới và click nút "Lưu"
    alt Nếu chưa có phòng khám nào được tạo (isEditMode = false)
        UI->>API: POST /api/create-clinic-info {name, address, imageBase64, descriptionHTML, descriptionMarkdown}
        API->>DB: Tạo mới bản ghi duy nhất trong bảng Clinics
    else Đã có phòng khám (isEditMode = true)
        UI->>API: PUT /api/update-clinic-info {id, name, address, imageBase64, descriptionHTML, descriptionMarkdown}
        API->>DB: Cập nhật thông tin bản ghi hiện tại trong bảng Clinics
    end
    activate API
    DB-->>API: Lưu/Cập nhật dữ liệu thành công
    API-->>UI: Trả về kết quả thành công (errCode = 0)
    deactivate API
    UI-->>Admin: Hiển thị thông báo Toast thành công và tải lại giao diện
```

---

### 4.6 Quản lý lịch hẹn toàn hệ thống
Mô tả quy trình Admin giám sát và thay đổi trạng thái các lịch đặt khám của bệnh nhân trên hệ thống.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant UI as ReactJS Frontend (/system/manage-booking)
    participant API as NodeJS Express Server
    participant DB as MySQL (Sequelize)

    %% Load Appointments
    Admin->>UI: Truy cập trang quản lý lịch hẹn
    UI->>API: GET /api/get-all-bookings?date=... (date để trống để lấy tất cả)
    API->>DB: Query bảng Booking tham chiếu thông tin bệnh nhân & bác sĩ
    DB-->>API: Trả về danh sách các lịch đặt hẹn khám
    API-->>UI: Phản hồi danh sách Booking và số liệu thống kê
    UI-->>Admin: Hiển thị các ô thống kê và bảng lịch hẹn

    %% Update Status
    Admin->>UI: Nhấn nút "Xác nhận" (S1 -> S2) hoặc "Hủy" (S1/S2 -> S4)
    UI->>API: PUT /api/update-booking-status (bookingId, statusId)
    API->>DB: Cập nhật cột statusId của bản ghi Booking tương ứng trong CSDL
    DB-->>API: Cập nhật thành công
    API-->>UI: Trả về kết quả thành công (errCode = 0)
    UI->>API: GET /api/get-all-bookings?date=... (Reload dữ liệu)
    API->>DB: Lấy lại danh sách Booking sau cập nhật
    DB-->>API: Trả về danh sách mới
    API-->>UI: Phản hồi dữ liệu
    UI-->>Admin: Cập nhật giao diện trạng thái và thông báo toast thành công
```

---
*Tài liệu biểu đồ tuần tự được viết dựa trên luồng API thực tế của dự án.*
