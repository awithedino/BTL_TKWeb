// Khởi tạo cart từ localStorage
let cart = JSON.parse(localStorage.getItem("guestCart")) || [];

// Hàm để lưu cart vào localStorage
function setCart(newCart) {
    localStorage.setItem("guestCart", JSON.stringify(newCart));
    cart = newCart; // Cập nhật biến cart toàn cục
}

// Load dữ liệu và cập nhật bảng khi trang được tải
window.onload = function () {
    khoiTao();
    addProductToTable();

    autocomplete(document.getElementById('search-box'), list_products);

    var tags = ["Samsung", "iPhone", "Huawei", "Oppo"];
    for (var t of tags) addTags(t, "index.html?search=" + t);

    addProductToTable();
}

// Thêm sản phẩm vào bảng
function addProductToTable() {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    const table = document.getElementsByClassName('listSanPham')[0];

    let s = `
        <tbody>
            <tr>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Thời gian</th>
                <th>Xóa</th>
            </tr>`;

    if (guestCart.length === 0) {
        s += `
            <tr>
                <td colspan="7"> 
                    <h1 style="color:green; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
                        Giỏ hàng trống !!
                    </h1> 
                </td>
            </tr>`;
        table.innerHTML = s;
        return;
    }

    let totalPrice = 0;
    guestCart.forEach((item, index) => {
        const product = timKiemTheoMa(list_products, item.ma);
        const price = product.promo.name === 'giareonline' ? product.promo.value : product.price;
        const totalItemPrice = stringToNum(price) * item.soluong;
        const dateAdded = new Date(item.date).toLocaleString();

        s += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td class="alignRight">${price} ₫</td>
                <td class="soluong">${item.soluong}</td>
                <td class="alignRight">${numToString(totalItemPrice)} ₫</td>
                <td style="text-align: center">${dateAdded}</td>
                <td class="noPadding"> <i class="fa fa-trash" onclick="xoaSanPhamTrongGioHang(${index})"></i> </td>
            </tr>`;
        totalPrice += totalItemPrice;
    });

    s += `
        <tr style="font-weight:bold; text-align:center">
            <td colspan="4">TỔNG TIỀN: </td>
            <td class="alignRight">${numToString(totalPrice)} ₫</td>
            <td class="thanhtoan" onclick="thanhToan()"> Thanh Toán </td>
            <td class="xoaHet" onclick="xoaHet()"> Xóa hết </td>
        </tr>
    </tbody>`;

    table.innerHTML = s;
}

// Xóa sản phẩm trong giỏ hàng
function xoaSanPhamTrongGioHang(index) {
    let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

    if (index >= 0 && index < guestCart.length) {
        guestCart.splice(index, 1);
        setCart(guestCart); // Cập nhật lại cart trong localStorage
        addAlertBox("Sản phẩm đã được xóa khỏi giỏ hàng", "#FF6347", "#fff", 3000);
        addProductToTable();
        capNhat_ThongTin_CurrentUser();
    } else {
        addAlertBox("Không thể xóa sản phẩm", "#FF6347", "#fff", 3000);
    }
}

// Thanh toán giỏ hàng
function thanhToan() {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    if (!guestCart.length) {
        addAlertBox('Không có mặt hàng nào cần thanh toán !!', '#ffb400', '#fff', 2000);
        return;
    }
    if (window.confirm('Thanh toán giỏ hàng ?')) {
        localStorage.removeItem("guestCart"); // Xóa giỏ hàng sau khi thanh toán
        addAlertBox('Các sản phẩm đã được gửi vào đơn hàng và chờ xử lý.', '#17c671', '#fff', 4000);
        
        addProductToTable();
        capNhat_ThongTin_CurrentUser();
    }
}

// Xóa hết giỏ hàng
function xoaHet() {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    if (guestCart.length) {
        if (window.confirm('Bạn có chắc chắn muốn xóa hết sản phẩm trong giỏ !!')) {
            localStorage.removeItem("guestCart");
            addAlertBox("Đã xóa toàn bộ sản phẩm trong giỏ hàng", "#FF6347", "#fff", 3000);
            addProductToTable();
            capNhat_ThongTin_CurrentUser();
        }
    } else {
        addAlertBox("Giỏ hàng đã trống", "#FF6347", "#fff", 3000);
    }
}

// Cập nhật số lượng sản phẩm
function capNhatSoLuongFromInput(inp, masp) {
    const soLuongMoi = Number(inp.value) > 0 ? Number(inp.value) : 1;

    for (let p of cart) {
        if (p.ma == masp) {
            p.soluong = soLuongMoi;
        }
    }
    setCart(cart);
    capNhatMoiThu();
}

// Tăng và giảm số lượng sản phẩm
function tangSoLuong(masp) {
    for (let p of cart) {
        if (p.ma == masp) {
            p.soluong++;
        }
    }
    setCart(cart);
    capNhatMoiThu();
}

function giamSoLuong(masp) {
    for (let p of cart) {
        if (p.ma == masp && p.soluong > 1) {
            p.soluong--;
        }
    }
    setCart(cart);
    capNhatMoiThu();
}

// Cập nhật toàn bộ giao diện
function capNhatMoiThu() { 
    animateCartNumber();
    addProductToTable();
    capNhat_ThongTin_CurrentUser();
}
