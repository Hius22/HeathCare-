# ĐẶC TẢ CHI TIẾT TOÀN BỘ CHỨC NĂNG HỆ THỐNG (DẠNG BẢNG)
## HỆ THỐNG ĐẶT LỊCH KHÁM BỆNH TRỰC TUYẾN (HEALTHCARE BOOKING SYSTEM)

Tài liệu này đặc tả chi tiết 18 chức năng của 3 tác nhân chính (**Bệnh Nhân, Bác Sĩ, Admin**) tương tác với hệ thống dưới dạng bảng biểu chuẩn hóa.

---

## 1. PHÂN HỆ BỆNH NHÂN (PATIENT MODULE)

### 1.1 Tìm kiếm thông tin Bác sĩ / Chuyên khoa / Phòng khám
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Cho phép bệnh nhân tìm kiếm nhanh bác sĩ, chuyên khoa hoặc phòng khám y tế tại ô tìm kiếm trên trang chủ. |
| **Điều kiện trước** | Người dùng truy cập trang chủ hệ thống. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Người dùng nhập từ khóa tìm kiếm (Ví dụ: tên bác sĩ, tên chuyên khoa, tên phòng khám) vào thanh tìm kiếm thông minh.<br>2. Người dùng nhấn chọn một kết quả tìm kiếm gợi ý hoặc nhấn Enter.<br><br>**System response:**<br>1. Hệ thống thực hiện tìm kiếm mờ (fuzzy search) trong CSDL.<br>2. Hệ thống hiển thị danh sách kết quả gợi ý ngay dưới ô tìm kiếm (Live Search).<br>3. Hệ thống điều hướng người dùng tới trang thông tin chi tiết tương ứng với kết quả được chọn. |
| **Dòng sự kiện rẽ nhánh** | *   **Không có kết quả:** Hệ thống hiển thị thông điệp "Không tìm thấy kết quả phù hợp" và không chuyển trang. |
| **Yêu cầu đặc biệt** | Tốc độ hiển thị kết quả tìm kiếm gợi ý phải phản hồi dưới 500ms khi người dùng gõ phím. |
| **Điều kiện sau** | Người dùng được dẫn tới trang chi tiết của thực thể tương ứng. |

---

### 1.2 Xem thông tin chi tiết Bác sĩ / Chuyên khoa / Phòng khám
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Cho phép bệnh nhân xem thông tin chi tiết, tiểu sử, mô tả chuyên sâu và bài viết giới thiệu của Bác sĩ, Chuyên khoa hoặc Phòng khám y tế. |
| **Điều kiện trước** | Người dùng chọn một Bác sĩ/Chuyên khoa/Phòng khám cụ thể từ trang chủ hoặc kết quả tìm kiếm. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Người dùng nhấp chuột vào đối tượng cần xem.<br>2. Người dùng cuộn trang để xem bài viết giới thiệu, giá khám, địa chỉ và chọn ngày khám nếu là trang Bác sĩ.<br><br>**System response:**<br>1. Hệ thống gọi API lấy chi tiết dữ liệu (bao gồm nội dung Markdown, thông tin dịch vụ, danh sách bác sĩ thuộc khoa/phòng khám).<br>2. Hệ thống chuyển đổi nội dung Markdown sang HTML và hiển thị lên giao diện.<br>3. Hệ thống hiển thị danh sách lịch khám khả dụng trong ngày hiện tại cho người dùng. |
| **Dòng sự kiện rẽ nhánh** | *   **Lỗi tải dữ liệu hoặc ID không tồn tại:** Hệ thống chuyển hướng người dùng về trang chủ hoặc trang báo lỗi 404. |
| **Yêu cầu đặc biệt** | Trang chi tiết bác sĩ phải hiển thị rõ các mức chi phí khám, hình thức thanh toán được chấp nhận từ bảng từ điển `Allcode`. |
| **Điều kiện sau** | Người dùng có đủ thông tin để quyết định đặt lịch khám. |

---

### 1.3 Đặt lịch khám bệnh trực tuyến (Patient Book Appointment)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Bệnh nhân đặt một ca khám bằng cách lựa chọn khung giờ của bác sĩ và điền thông tin cá nhân cùng lý do khám. |
| **Điều kiện trước** | Bác sĩ đã được thiết lập lịch làm việc (Schedule) và còn các ca khám trống. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Người dùng chọn ngày khám và khung giờ còn trống.<br>2. Người dùng điền: Họ tên, SĐT, Email nhận thư, Địa chỉ, Giới tính, Lý do khám bệnh và nhấn "Xác nhận đặt lịch".<br><br>**System response:**<br>1. Hệ thống mở biểu mẫu Booking Modal.<br>2. Hệ thống kiểm tra dữ liệu hợp lệ và kiểm tra trùng lịch.<br>3. Hệ thống lưu lịch hẹn vào CSDL ở trạng thái `S1` (Chờ xác nhận), đồng thời kích hoạt Mail Server gửi email chứa mã Token xác nhận và hiển thị thông báo thành công. |
| **Dòng sự kiện rẽ nhánh** | *   **Trùng lịch đặt trùng thời điểm:** Báo lỗi và yêu cầu chọn giờ khác.<br>*   **Dữ liệu sai định dạng:** Báo lỗi tại trường nhập liệu.<br>*   **Bệnh nhân mới:** Tự động tạo tài khoản bệnh nhân nếu email chưa tồn tại trong hệ thống. |
| **Yêu cầu đặc biệt** | Một khung giờ khám của bác sĩ chỉ cho phép duy nhất một bệnh nhân đặt chỗ thành công. |
| **Điều kiện sau** | Lịch khám ở trạng thái `S1`, email chứa link xác nhận đã được gửi đi. |

---

### 1.4 Xác nhận lịch đặt hẹn qua Email (Verify Booking)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Bệnh nhân click chọn liên kết trong email gửi về để xác nhận chính thức lịch đặt khám bệnh. |
| **Điều kiện trước** | Đã tạo lịch hẹn và nhận được email xác nhận ở trạng thái `S1`. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Bệnh nhân mở hòm thư cá nhân và click link xác nhận.<br><br>**System response:**<br>1. Hệ thống điều hướng bệnh nhân tới trang `/verify-booking` kèm token bảo mật.<br>2. Hệ thống kiểm tra token trong CSDL. Nếu đúng và lịch hẹn ở trạng thái `S1`, hệ thống cập nhật trạng thái lịch hẹn sang `S2` (Đã xác nhận).<br>3. Hệ thống hiển thị thông báo "Xác nhận lịch khám thành công!". |
| **Dòng sự kiện rẽ nhánh** | *   **Token không hợp lệ hoặc đã dùng/hết hạn:** Hệ thống hiển thị thông báo lỗi "Lịch hẹn không tồn tại hoặc đã được kích hoạt". |
| **Yêu cầu đặc biệt** | Mỗi Token chỉ được dùng để xác nhận duy nhất 1 lần. |
| **Điều kiện sau** | Trạng thái lịch khám chuyển thành `S2` (Đã xác nhận), lịch chính thức xuất hiện trong danh sách làm việc của Bác sĩ. |

---

### 1.5 Tra cứu lịch sử cuộc hẹn (Booking History)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Cho phép bệnh nhân nhập email cá nhân để kiểm tra danh sách và tình trạng các cuộc hẹn khám bệnh đã đặt. |
| **Điều kiện trước** | Người dùng truy cập trang lịch sử cuộc hẹn (`/appointments`). |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Bệnh nhân nhập email cá nhân vào ô tra cứu và nhấn nút "Tra cứu".<br><br>**System response:**<br>1. Hệ thống gửi email về API để truy vấn danh sách lịch hẹn.<br>2. Hệ thống trả về mảng danh sách lịch hẹn liên kết với email đó.<br>3. Hệ thống hiển thị danh sách phân chia theo các Tab: Tất cả, Sắp tới, Đã khám, Đã hủy kèm thông tin chi tiết bác sĩ, giờ khám. |
| **Dòng sự kiện rẽ nhánh** | *   **Không tìm thấy email liên quan:** Hệ thống báo trống và thông báo "Không tìm thấy lịch đặt nào liên kết với email này". |
| **Yêu cầu đặc biệt** | Hệ thống bảo mật thông tin lịch hẹn, chỉ cho phép truy vấn chính xác theo email đã điền trong đơn đặt lịch. |
| **Điều kiện sau** | Bệnh nhân xem được danh sách và trạng thái các ca khám của mình. |

---

### 1.6 Bệnh nhân tự hủy lịch hẹn (Patient Cancel Booking)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Cho phép bệnh nhân tự động hủy lịch hẹn khám của mình đối với những ca khám sắp diễn ra. |
| **Điều kiện trước** | Bệnh nhân đã tra cứu danh sách lịch hẹn thành công và có lịch hẹn sắp tới ở trạng thái `S1` hoặc `S2`. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Bệnh nhân nhấn chọn nút "Hủy lịch" tại lịch khám tương ứng.<br>2. Bệnh nhân nhấn "Xác nhận hủy" trên hộp thoại cảnh báo.<br><br>**System response:**<br>1. Hệ thống gọi API hủy lịch hẹn với các thông số nhận dạng cuộc hẹn.<br>2. Hệ thống cập nhật trạng thái lịch hẹn trong CSDL sang `S4` (Đã hủy).<br>3. Hệ thống tải lại danh sách hiển thị và báo hủy lịch thành công. |
| **Dòng sự kiện rẽ nhánh** | *   **Lịch hẹn đã diễn ra hoặc đã hoàn thành (S3):** Nút "Hủy lịch" bị ẩn hoặc báo lỗi không được phép hủy. |
| **Yêu cầu đặc biệt** | Không cho phép bệnh nhân hủy lịch khám nếu thời điểm khám thực tế đã diễn ra hoặc lịch đã hoàn thành. |
| **Điều kiện sau** | Trạng thái lịch khám trong database chuyển thành `S4` (Đã hủy). |

---

## 2. PHÂN HỆ BÁC SĨ (DOCTOR MODULE)

### 2.1 Đăng nhập / Đăng xuất Bác sĩ
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Bác sĩ thực hiện đăng nhập vào hệ thống quản lý ca khám cá nhân và đăng xuất khi kết thúc ca trực. |
| **Điều kiện trước** | Bác sĩ truy cập trang `/login` và tài khoản đã được Admin cấp trước đó. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Bác sĩ điền Email, Mật khẩu và nhấn "Đăng nhập".<br>2. Khi muốn kết thúc, bác sĩ nhấp chọn nút "Đăng xuất" (Logout).<br><br>**System response:**<br>1. Hệ thống mã hóa thông tin gửi lên server NodeJS để đối chiếu.<br>2. Nếu khớp thông tin và đúng vai trò `R2` (Doctor), hệ thống tạo JWT token, trả về thông tin đăng nhập và điều hướng bác sĩ đến trang Quản lý bệnh nhân.<br>3. Khi đăng xuất, hệ thống hủy JWT token ở Client, xóa Redux state và chuyển về màn hình đăng nhập. |
| **Dòng sự kiện rẽ nhánh** | *   **Sai thông tin đăng nhập:** Hệ thống báo lỗi "Email không tồn tại" hoặc "Mật khẩu không chính xác". |
| **Yêu cầu đặc biệt** | Mật khẩu bác sĩ phải được mã hóa dạng bcrypt khi lưu trữ dưới CSDL. |
| **Điều kiện sau** | Phiên đăng nhập được duy trì bằng token trên Client; phân quyền truy cập các API của bác sĩ được kích hoạt. |

---

### 2.2 Xem lịch khám & Danh sách bệnh nhân (Doctor View Patient List)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Bác sĩ theo dõi kế hoạch khám bệnh theo ngày bằng cách hiển thị các ca khám và thông tin chi tiết bệnh nhân chờ khám. |
| **Điều kiện trước** | Bác sĩ đăng nhập thành công vào trang `/doctor/manage-patient`. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Bác sĩ chọn ngày cụ thể từ công cụ chọn ngày.<br><br>**System response:**<br>1. Hệ thống gửi API truy vấn danh sách lịch hẹn trạng thái `S2` (Đã xác nhận) của bác sĩ đó theo ngày được chọn.<br>2. Hệ thống hiển thị danh sách bệnh nhân chi tiết (Họ tên, SĐT, giới tính, lý do khám, khung giờ) dạng bảng làm việc. |
| **Dòng sự kiện rẽ nhánh** | *   **Ngày không có lịch khám:** Hệ thống hiển thị "Chưa có bệnh nhân đặt lịch trong ngày này". |
| **Yêu cầu đặc biệt** | Chỉ hiển thị các bệnh nhân đã hoàn tất xác nhận lịch qua email (trạng thái `S2`). |
| **Điều kiện sau** | Bác sĩ có thông tin chi tiết bệnh nhân để tiến hành khám trực tiếp. |

---

### 2.3 Xác nhận khám xong & Gửi hóa đơn/đơn thuốc (Doctor Confirm & Send Remedy)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Bác sĩ xác nhận hoàn thành buổi khám bệnh, cập nhật kết luận và đính kèm đơn thuốc/hóa đơn gửi bệnh nhân. |
| **Điều kiện trước** | Bệnh nhân đã được khám xong trực tiếp. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Bác sĩ click nút "Xác nhận khám xong" tại dòng thông tin bệnh nhân tương ứng.<br>2. Bác sĩ nhập nội dung dặn dò, tải lên ảnh đơn thuốc chụp từ máy tính và nhấn "Gửi".<br><br>**System response:**<br>1. Hệ thống hiển thị hộp thoại Remedy Modal chứa thông tin email điền tự động.<br>2. Hệ thống chuyển đổi tệp ảnh sang chuỗi Base64 để lưu vào CSDL.<br>3. Hệ thống cập nhật lịch hẹn sang trạng thái `S3` (Đã khám), tạo bản ghi lịch sử bệnh án bảng `History`.<br>4. Hệ thống gọi Mail Server gửi email kết quả kèm tệp ảnh đơn thuốc cho bệnh nhân và tải lại danh sách. |
| **Dòng sự kiện rẽ nhánh** | *   **Chưa tải lên tệp ảnh:** Hệ thống báo lỗi và giữ nguyên form.<br>*   **Lỗi gửi email:** Hệ thống báo lưu thành công nhưng cảnh báo gửi email thất bại. |
| **Yêu cầu đặc biệt** | Tệp đơn thuốc gửi đến email phải được đính kèm đúng định dạng hình ảnh/PDF rõ nét. |
| **Điều kiện sau** | Lịch khám chuyển sang trạng thái `S3`, bệnh nhân nhận được email chứa đơn thuốc. |

---

### 2.4 Bác sĩ hủy lịch hẹn bệnh nhân (Doctor Cancel Booking)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Cho phép bác sĩ chủ động hủy ca khám của bệnh nhân trong trường hợp khẩn cấp hoặc lịch bận đột xuất. |
| **Điều kiện trước** | Bác sĩ đăng nhập thành công và xem danh sách lịch hẹn chờ khám (`S2`). |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Bác sĩ bấm nút "Hủy lịch" tại ca khám của bệnh nhân cần hủy.<br>2. Bác sĩ nhập lý do hủy lịch vào hộp thoại yêu cầu và nhấn "Xác nhận hủy".<br><br>**System response:**<br>1. Hệ thống hiển thị hộp thoại CancelBookingModal.<br>2. Hệ thống cập nhật trạng thái lịch hẹn sang `S4` (Đã hủy) và ghi lý do hủy vào CSDL.<br>3. Hệ thống tự động gửi email thông báo hủy ca khám kèm lý do bác sĩ đưa ra gửi tới hòm thư bệnh nhân.<br>4. Hệ thống tải lại danh sách và thông báo hủy lịch thành công. |
| **Dòng sự kiện rẽ nhánh** | *   **Hủy không có lý do:** Hệ thống báo lỗi yêu cầu nhập lý do hủy trước khi tiến hành xác nhận. |
| **Yêu cầu đặc biệt** | Email thông báo hủy phải ghi rõ họ tên bác sĩ và lý do chi tiết để đảm bảo trải nghiệm khách hàng. |
| **Điều kiện sau** | Trạng thái lịch khám chuyển thành `S4`, bệnh nhân nhận được thư thông báo hủy lịch. |

---

### 2.5 Cập nhật hồ sơ thông tin cá nhân Bác sĩ (Doctor Update Profile)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Bác sĩ tự chỉnh sửa thông tin cá nhân cơ bản như họ tên, số điện thoại, địa chỉ hoặc cập nhật mật khẩu đăng nhập. |
| **Điều kiện trước** | Bác sĩ đăng nhập thành công và truy cập trang cập nhật hồ sơ cá nhân. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Bác sĩ chỉnh sửa thông tin cá nhân cần thay đổi và nhấn "Lưu thông tin".<br><br>**System response:**<br>1. Hệ thống kiểm tra dữ liệu hợp lệ.<br>2. Hệ thống thực hiện cập nhật các thuộc tính của bác sĩ trong bảng `Users`.<br>3. Hệ thống trả về thông báo cập nhật hồ sơ thành công và làm mới giao diện hiển thị. |
| **Dòng sự kiện rẽ nhánh** | *   **SĐT/Email trùng lặp hoặc không hợp lệ:** Hệ thống hiển thị thông báo lỗi chi tiết. |
| **Yêu cầu đặc biệt** | Bác sĩ không được tự thay đổi các thông tin học hàm, chuyên khoa, phòng khám liên kết (thông tin này do Admin kiểm duyệt và cấu hình). |
| **Điều kiện sau** | Thông tin cá nhân mới được cập nhật trong bảng `Users`. |

---

## 3. PHÂN HỆ QUẢN TRỊ VIÊN (ADMIN MODULE)

### 3.1 Đăng nhập / Đăng xuất Admin
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Đăng nhập để truy cập vào hệ thống quản trị nội bộ `/system` dành riêng cho Admin và đăng xuất khi hoàn thành công việc. |
| **Điều kiện trước** | Admin truy cập trang `/login`. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Admin nhập tài khoản Email, Mật khẩu quản trị và nhấn "Đăng nhập".<br>2. Khi muốn kết thúc, Admin nhấn chọn nút "Đăng xuất" trên thanh công cụ quản trị.<br><br>**System response:**<br>1. Hệ thống mã hóa thông tin, đối chiếu kiểm tra vai trò `R1` (Admin) của tài khoản trong CSDL.<br>2. Hệ thống tạo JWT token quản trị và chuyển hướng Admin vào trang Dashboard `/system`.<br>3. Khi đăng xuất, hệ thống hủy JWT token, xóa dữ liệu phiên làm việc ở Client và chuyển về màn hình đăng nhập. |
| **Dòng sự kiện rẽ nhánh** | *   **Không đúng vai trò Admin:** Hệ thống từ chối truy cập và thông báo tài khoản không có quyền quản trị. |
| **Yêu cầu đặc biệt** | Sử dụng Middleware xác thực token quản trị trên mọi API thuộc phân hệ `/system`. |
| **Điều kiện sau** | Admin được cấp quyền thực hiện các chức năng cấu hình hệ thống. |

---

### 3.2 Quản lý người dùng (CRUD Users)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Quản lý toàn bộ danh sách tài khoản người dùng trong hệ thống (Tạo mới, Xem, Sửa thông tin, Xóa tài khoản). |
| **Điều kiện trước** | Admin đăng nhập thành công và truy cập trang quản trị `/system/manage-users`. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Admin xem danh sách người dùng hiển thị trên bảng.<br>2. Để tạo mới: Admin nhập đầy đủ thông tin tài khoản, mật khẩu, họ tên, vai trò (Admin/Doctor/Patient), chức danh, giới tính, tải lên ảnh đại diện và click "Lưu".<br>3. Để sửa: Admin click nút "Sửa" trên hàng, thay đổi thông tin và click "Cập nhật".<br>4. Để xóa: Admin click nút "Xóa" trên hàng tương ứng và xác nhận.<br><br>**System response:**<br>1. Hệ thống tự động gọi API lấy danh sách toàn bộ người dùng đổ lên bảng dữ liệu.<br>2. Khi Thêm mới/Sửa: Hệ thống kiểm tra tính hợp lệ dữ liệu, mã hóa mật khẩu, lưu vào bảng `Users` và thông báo toast thành công.<br>3. Khi Xóa: Hệ thống thực hiện xóa bản ghi khỏi bảng `Users`, thông báo xóa thành công và tải lại bảng. |
| **Dòng sự kiện rẽ nhánh** | *   **Email đã tồn tại khi tạo mới:** Hệ thống hiển thị thông báo lỗi "Email này đã được sử dụng!". |
| **Yêu cầu đặc biệt** | Ảnh đại diện của người dùng được tải lên dưới định dạng ảnh base64 hoặc lưu trữ tập tin. |
| **Điều kiện sau** | Cơ sở dữ liệu bảng `Users` được cập nhật đồng bộ. |

---

### 3.3 Cấu hình thông tin chi tiết bác sĩ (Admin Manage Doctor Info)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Thiết lập và cập nhật các thông tin dịch vụ y tế chi tiết và bài viết giới thiệu của từng Bác sĩ. |
| **Điều kiện trước** | Admin đăng nhập thành công và truy cập `/system/manage-doctor`. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Admin chọn Bác sĩ cần thiết lập thông tin nghiệp vụ.<br>2. Admin điền giá khám, phương thức thanh toán, tỉnh thành làm việc, địa chỉ phòng khám, tên phòng khám, ghi chú thêm.<br>3. Admin chọn Chuyên khoa/Phòng khám liên kết và viết bài giới thiệu chi tiết (sử dụng Editor Markdown) rồi nhấn "Lưu".<br><br>**System response:**<br>1. Hệ thống kiểm tra dữ liệu. Nếu bác sĩ đã có thông tin chi tiết sẽ chạy luồng cập nhật, nếu chưa có sẽ chạy luồng tạo mới.<br>2. Hệ thống lưu/cập nhật thông tin dịch vụ vào bảng `Doctor_Infor`, lưu bài giới thiệu vào bảng `MarkDown` và cập nhật quan hệ tại `Doctor_Clinic_Specialty`. Hệ thống hiển thị thông báo lưu thành công. |
| **Dòng sự kiện rẽ nhánh** | *   **Bác sĩ chưa có bài giới thiệu:** Màn hình Markdown Editor hiển thị trống.<br>*   **Bác sĩ đã có bài giới thiệu:** Hệ thống tải nội dung cũ hiển thị lên Editor để chỉnh sửa. |
| **Yêu cầu đặc biệt** | Nội dung giới thiệu hỗ trợ chèn hình ảnh và định dạng văn bản nâng cao thông qua Markdown/HTML. |
| **Điều kiện sau** | Thông tin nghiệp vụ bác sĩ hiển thị đầy đủ ngoài trang chủ và trang đặt lịch của Bệnh nhân. |

---

### 3.4 Tạo lịch làm việc cho Bác sĩ (Admin Manage Schedule)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Cho phép Admin đăng ký các ca làm việc (khung giờ khám) cho một bác sĩ theo ngày cụ thể một cách nhanh chóng. |
| **Điều kiện trước** | Admin đăng nhập thành công và truy cập trang `/system/manage-schedule`. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Admin chọn Bác sĩ từ danh sách dropdown.<br>2. Admin chọn ngày làm việc trên DatePicker.<br>3. Admin chọn một hoặc nhiều khung giờ làm việc và bấm "Lưu thông tin".<br><br>**System response:**<br>1. Hệ thống kiểm tra và lọc các ca làm việc trùng lặp của bác sĩ trong ngày được chọn trong CSDL.<br>2. Hệ thống gọi API Bulk Create lưu hàng loạt bản ghi lịch làm việc mới vào bảng `Schedule`. Hệ thống báo lưu lịch khám thành công. |
| **Dòng sự kiện rẽ nhánh** | *   **Thiếu thông tin bác sĩ hoặc ngày:** Hệ thống cảnh báo đỏ và ngăn cản quá trình lưu thông tin. |
| **Yêu cầu đặc biệt** | Khung giờ khám được tải động từ bảng từ điển `Allcode` (`type = TIME`). |
| **Điều kiện sau** | Khung giờ làm việc của bác sĩ hiển thị trên trang chi tiết bác sĩ để bệnh nhân chọn giờ đặt lịch. |

---

### 3.5 Quản lý Chuyên khoa (CRUD Specialty)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Admin tạo mới, chỉnh sửa thông tin hoặc xóa các chuyên khoa y tế trên hệ thống. |
| **Điều kiện trước** | Admin đăng nhập thành công và truy cập `/system/manage-specialty`. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Admin nhập Tên chuyên khoa.<br>2. Admin tải lên ảnh đại diện chuyên khoa.<br>3. Admin soạn thảo bài viết mô tả chuyên sâu bằng Markdown và nhấn "Lưu".<br><br>**System response:**<br>1. Hệ thống kiểm tra tính đầy đủ của tham số dữ liệu.<br>2. Hệ thống lưu/cập nhật thông tin chuyên khoa vào bảng `Specialty` và nội dung Markdown giới thiệu.<br>3. Hệ thống trả về kết quả thành công và làm mới danh sách chuyên khoa hiển thị. |
| **Dòng sự kiện rẽ nhánh** | *   **Thiếu tên chuyên khoa hoặc ảnh đại diện:** Hệ thống báo lỗi và ngăn chặn quá trình lưu dữ liệu. |
| **Yêu cầu đặc biệt** | Ảnh chuyên khoa phải lưu trữ dạng Base64 độ phân giải cao để phục vụ hiển thị Client. |
| **Điều kiện sau** | Chuyên khoa mới/sửa đổi hiển thị trên danh sách chuyên khoa ngoài trang chủ. |

---

### 3.6 Cấu hình thông tin phòng khám (Admin Configure Clinic)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Thiết lập và cập nhật thông tin phòng khám bao gồm tên cơ sở, địa chỉ, ảnh đại diện, bài giới thiệu dịch vụ. |
| **Điều kiện trước** | Admin đăng nhập và truy cập trang quản lý phòng khám `/system/manage-clinic`. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Admin nhập tên cơ sở y tế và địa chỉ chi tiết.<br>2. Admin tải lên ảnh đại diện phòng khám.<br>3. Admin viết bài giới thiệu chi tiết bằng Markdown và nhấn "Lưu phòng khám".<br><br>**System response:**<br>1. Hệ thống kiểm tra. Nếu chưa có thông tin phòng khám sẽ tiến hành tạo mới, nếu đã có sẽ tiến hành cập nhật bản ghi hiện tại.<br>2. Hệ thống lưu thành công dữ liệu vào bảng `Clinics` và hiển thị thông báo Toast thành công. |
| **Dòng sự kiện rẽ nhánh** | *   **Thiếu dữ liệu trường bắt buộc:** Hệ thống hiển thị thông báo lỗi yêu cầu nhập đủ dữ liệu. |
| **Yêu cầu đặc biệt** | Bài viết mô tả hỗ trợ nhúng cấu trúc HTML để định dạng bảng giá hoặc sơ đồ chỉ dẫn. |
| **Điều kiện sau** | Thông tin cơ sở y tế hiển thị chính xác ngoài trang Client cho người dùng tham khảo. |

---

### 3.7 Quản lý lịch đặt khám toàn hệ thống (Admin Manage Booking)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Giám sát tất cả các ca đặt lịch khám bệnh trên toàn hệ thống và thực hiện cập nhật trạng thái lịch hẹn khi cần thiết. |
| **Điều kiện trước** | Admin đăng nhập thành công và truy cập `/system/manage-booking`. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Admin xem danh sách lịch hẹn toàn hệ thống và thực hiện lọc theo ngày hoặc trạng thái.<br>2. Admin nhấp chọn thay đổi trạng thái của ca khám: click "Xác nhận" (từ `S1` sang `S2`) hoặc "Hủy lịch" (sang `S4`).<br><br>**System response:**<br>1. Hệ thống hiển thị danh sách các lịch đặt khám chi tiết cùng với bảng thống kê tổng số lượng lịch đặt theo từng loại trạng thái.<br>2. Hệ thống tiến hành cập nhật CSDL, thay đổi trường `statusId` của bản ghi, đồng thời gửi email thông báo trạng thái mới và tải lại danh sách. |
| **Dòng sự kiện rẽ nhánh** | *   **Lọc không có kết quả:** Hệ thống hiển thị bảng trống kèm thông báo "Không có lịch hẹn nào phù hợp". |
| **Yêu cầu đặc biệt** | Đảm bảo tính nhất quán dữ liệu khi Admin cập nhật trạng thái thì giao diện bên Bác sĩ cũng phải đồng bộ. |
| **Điều kiện sau** | Trạng thái cuộc hẹn được cập nhật chuẩn xác trong database, gửi email tự động tương ứng tới hòm thư bệnh nhân. |

---

### 3.8 Quản lý danh mục từ điển hệ thống (Admin Manage Allcodes)
| Thuộc tính | Nội dung mô tả chi tiết |
| :--- | :--- |
| **Mô tả** | Cho phép Admin xem, bổ sung hoặc sửa đổi các mã danh mục từ điển dùng chung trong hệ thống (như thêm khoảng giá khám mới, thêm khung giờ mới, thêm chức danh/học hàm bác sĩ). |
| **Điều kiện trước** | Admin đăng nhập thành công vào `/system`. |
| **Dòng sự kiện chính** | <br>**Actor input:**<br>1. Admin truy cập trang quản lý mã hệ thống.<br>2. Admin nhập mã khóa (`keyMap`), chọn phân loại (`type`), nhập giá trị hiển thị tiếng Việt (`valueVi`) và tiếng Anh (`valueEn`), rồi nhấn "Lưu".<br><br>**System response:**<br>1. Hệ thống kiểm tra mã khóa `keyMap` xem đã tồn tại chưa.<br>2. Nếu chưa tồn tại, hệ thống lưu bản ghi mới vào bảng `Allcode` và hiển thị thông báo lưu thành công.<br>3. Hệ thống cập nhật lại các danh mục chọn lựa tương ứng trên giao diện (giá khám, khung giờ khám...). |
| **Dòng sự kiện rẽ nhánh** | *   **Mã khóa keyMap đã tồn tại:** Hệ thống báo lỗi trùng khóa chính và yêu cầu thay đổi mã khóa khác. |
| **Yêu cầu đặc biệt** | Bảng Allcodes đóng vai trò nền tảng cấu hình, hạn chế sửa đổi trực tiếp các khóa đã có bản ghi ngoại khóa tham chiếu để tránh lỗi toàn vẹn dữ liệu. |
| **Điều kiện sau** | Dữ liệu danh mục mới khả dụng cho việc hiển thị đa ngôn ngữ trên toàn bộ hệ thống. |
