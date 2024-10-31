var cart = []; // Global cart variable to hold products
window.onload = function () {
    khoiTao();

    // Autocomplete for search box
    autocomplete(document.getElementById('search-box'), list_products);

    // Adding tags (keywords) to search box
    var tags = ["Samsung", "iPhone", "Huawei", "Oppo"];
    for (var t of tags) addTags(t, "index.html?search=" + t);

    // Load the cart on page load
    addProductToTable();
}

// Function to add products to the displayed table
function addProductToTable() {
    var table = document.getElementsByClassName('listSanPham')[0];

    var s = `
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

    if (cart.length == 0) {
        s += `
            <tr>
                <td colspan="7"> 
                    <h1 style="color:green; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
                        Giỏ hàng trống !!
                    </h1> 
                </td>
            </tr>
        `;
        table.innerHTML = s;
        return;
    }

    var totalPrice = 0;
    for (var i = 0; i < cart.length; i++) {
        var masp = cart[i].ma;
        var soluongSp = cart[i].soluong;
        var p = timKiemTheoMa(list_products, masp);
        var price = (p.promo.name == 'giareonline' ? p.promo.value : p.price);
        var thoigian = new Date(cart[i].date).toLocaleString();
        var thanhtien = stringToNum(price) * soluongSp;

        s += `
            <tr>
                <td>` + (i + 1) + `</td>
                <td class="noPadding imgHide">
                    <a target="_blank" href="chitietsanpham.html?` + p.name.split(' ').join('-') + `" title="Xem chi tiết">
                        ` + p.name + `
                        <img src="` + p.img + `">
                    </a>
                </td>
                <td class="alignRight">` + price + ` ₫</td>
                <td class="soluong">
                    <button onclick="giamSoLuong('` + masp + `')"><i class="fa fa-minus"></i></button>
                    <input size="1" onchange="capNhatSoLuongFromInput(this, '` + masp + `')" value=` + soluongSp + `>
                    <button onclick="tangSoLuong('` + masp + `')"><i class="fa fa-plus"></i></button>
                </td>
                <td class="alignRight">` + numToString(thanhtien) + ` ₫</td>
                <td style="text-align: center">` + thoigian + `</td>
                <td class="noPadding"> <i class="fa fa-trash" onclick="xoaSanPhamTrongGioHang(` + i + `)"></i> </td>
            </tr>
        `;
        totalPrice += thanhtien;
    }

    s += `
            <tr style="font-weight:bold; text-align:center">
                <td colspan="4">TỔNG TIỀN: </td>
                <td class="alignRight">` + numToString(totalPrice) + ` ₫</td>
                <td class="thanhtoan" onclick="thanhToan()"> Thanh Toán </td>
                <td class="xoaHet" onclick="xoaHet()"> Xóa hết </td>
            </tr>
        </tbody>
    `;

    table.innerHTML = s;
}

// Function to remove a product from the cart
function xoaSanPhamTrongGioHang(i) {
    if (window.confirm('Xác nhận hủy mua')) {
        cart.splice(i, 1);
        capNhatMoiThu();
    }
}

// Function to process the payment
function thanhToan() {
    if (!cart.length) {
        addAlertBox('Không có mặt hàng nào cần thanh toán !!', '#ffb400', '#fff', 2000);
        return;
    }
    if (window.confirm('Thanh toán giỏ hàng ?')) {
        // Handle payment processing without user data
        cart = []; // Clear the cart after payment
        addAlertBox('Các sản phẩm đã được gửi vào đơn hàng và chờ xử lý.', '#17c671', '#fff', 4000);
        capNhatMoiThu(); // Refresh the cart display
    }
}

// Function to clear the cart
function xoaHet() {
    if (cart.length) {
        if (window.confirm('Bạn có chắc chắn muốn xóa hết sản phẩm trong giỏ !!')) {
            cart = [];
            capNhatMoiThu();
        }
    }
}

// Update quantity from input
function capNhatSoLuongFromInput(inp, masp) {
    var soLuongMoi = Number(inp.value);
    if (!soLuongMoi || soLuongMoi <= 0) soLuongMoi = 1;

    for (var p of cart) {
        if (p.ma == masp) {
            p.soluong = soLuongMoi;
        }
    }

    capNhatMoiThu();
}

// Increase quantity
function tangSoLuong(masp) {
    for (var p of cart) {
        if (p.ma == masp) {
            p.soluong++;
        }
    }

    capNhatMoiThu();
}

// Decrease quantity
function giamSoLuong(masp) {
    for (var p of cart) {
        if (p.ma == masp) {
            if (p.soluong > 1) {
                p.soluong--;
            } else {
                return;
            }
        }
    }

    capNhatMoiThu();
}

// Update everything
function capNhatMoiThu() { 
    animateCartNumber();

    // Update the product list in local storage or wherever it needs to be stored
    setCart(cart); // Ensure setCart is defined to manage cart storage

    // Update the product list in the table
    addProductToTable();

    // Update on header if needed
    capNhat_ThongTin_CurrentUser();
}
