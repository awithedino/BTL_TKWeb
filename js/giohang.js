var cart = []; // Global cart variable to hold products
window.onload = function () {
    khoiTao();
    addProductToTable();

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
            </tr>
        `;
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
            </tr>
        `;
        totalPrice += totalItemPrice;
    });

    s += `
            <tr style="font-weight:bold; text-align:center">
                <td colspan="4">TỔNG TIỀN: </td>
                <td class="alignRight">${numToString(totalPrice)} ₫</td>
                <td class="thanhtoan" onclick="thanhToan()"> Thanh Toán </td>
                <td class="xoaHet" onclick="xoaHet()"> Xóa hết </td>
            </tr>
        </tbody>
    `;

    table.innerHTML = s;
}


// Function to remove a product from the cart
function xoaSanPhamTrongGioHang(index) {
    // Lấy giỏ hàng từ localStorage
    let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

    // Xóa sản phẩm ở vị trí 'index' khỏi mảng guestCart
    if (index >= 0 && index < guestCart.length) {
        guestCart.splice(index, 1);

        // Cập nhật lại guestCart trong localStorage
        localStorage.setItem("guestCart", JSON.stringify(guestCart));

        // Hiển thị thông báo sản phẩm đã được xóa
        addAlertBox("Sản phẩm đã được xóa khỏi giỏ hàng", "#FF6347", "#fff", 3000);

        // Cập nhật lại giao diện bảng giỏ hàng
        addProductToTable();

        // Cập nhật số lượng trên biểu tượng giỏ hàng
        capNhat_ThongTin_CurrentUser();
    } else {
        addAlertBox("Không thể xóa sản phẩm", "#FF6347", "#fff", 3000);
    }
}

// Function to process the payment
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

// Function to clear the cart
function xoaHet() {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    if (guestCart.length) {
        if (window.confirm('Bạn có chắc chắn muốn xóa hết sản phẩm trong giỏ !!')) {
            localStorage.removeItem("guestCart"); // Xóa hoàn toàn khỏi localStorage

            addAlertBox("Đã xóa toàn bộ sản phẩm trong giỏ hàng", "#FF6347", "#fff", 3000);

            addProductToTable();
            capNhat_ThongTin_CurrentUser();
        }
    } else {
        addAlertBox("Giỏ hàng đã trống", "#FF6347", "#fff", 3000);
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

