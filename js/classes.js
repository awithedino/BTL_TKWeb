function User(username, pass, ho, ten, email, products, donhang) {
    this.ho = ho || '';
    this.ten = ten || '';
    this.email = email || '';
    this.username = username;
    this.pass = pass;
    this.products = products || []; // Maintain product list
    this.donhang = donhang || []; // Maintain order history
}

function equalUser(u1, u2) {
    return (u1.username === u2.username && u1.pass === u2.pass);
}

function Promo(name, value) { // khuyen mai
    this.name = name; // giamGia, traGop, giaReOnline
    this.value = value;

    this.toWeb = function () {
        if (!this.name) return "";
        var contentLabel = "";
        switch (this.name) {
            case "giamgia":
                contentLabel = `<i class="fa fa-bolt"></i> Giảm ` + this.value + `&#8363;`;
                break;
            case "tragop":
                contentLabel = `Trả góp ` + this.value + `%`;
                break;
            case "giareonline":
                contentLabel = `Giá rẻ online`;
                break;
            case "moiramat":
                contentLabel = "Mới ra mắt";
                break;
        }

        var label =
            `<label class=` + this.name + `>
            ` + contentLabel + `
        </label>`;

        return label;
    }
}

function Product(masp, name, img, price, star, rateCount, promo) {
    this.masp = masp; // Unique product identifier
    this.img = img; // Image URL
    this.name = name; // Product name
    this.price = price; // Product price
    this.star = star; // Rating in stars
    this.rateCount = rateCount; // Number of ratings
    this.promo = promo; // Promo object
}

function addToWeb(p, ele, returnString) {
    // Ensure the product is valid and exists
    if (!p) return;

    // Chuyển star sang dạng tag html
    var rating = "";
    if (p.rateCount > 0) {
        for (var i = 1; i <= 5; i++) {
            if (i <= p.star) {
                rating += `<i class="fa fa-star"></i>`;
            } else {
                rating += `<i class="fa fa-star-o"></i>`;
            }
        }
        rating += `<span>` + p.rateCount + ` đánh giá</span>`;
    }

    // Chuyển giá tiền sang dạng tag html
    var price = `<strong>` + p.price + `&#8363;</strong>`;
    if (p.promo && p.promo.name === "giareonline") {
        // khuyến mãi 'Giá rẻ online' sẽ có giá thành mới
        price = `<strong>` + p.promo.value + `&#8363;</strong>
                <span>` + p.price + `&#8363;</span>`;
    }

    // Tạo link tới chi tiết sản phẩm, chuyển tất cả ' ' thành '-'
    var chitietSp = 'chitietsanpham.html?' + p.name.split(' ').join('-');

    // Cho mọi thứ vào tag <li>... </li>
    var newLi =
    `<li class="sanPham">
        <a href="` + chitietSp + `">
            <img src=` + p.img + ` alt="">
            <h3>` + p.name + `</h3>
            <div class="price">
                ` + price + `
            </div>
            <div class="ratingresult">
                ` + rating + `
            </div>
            ` + (p.promo && p.promo.toWeb()) + `
            <div class="tooltip">
                <button class="themvaogio" onclick="themVaoGioHang('` + p.masp + `', '` + p.name + `'); return false;">
                    <span class="tooltiptext" style="font-size: 15px;">Thêm vào giỏ</span>
                    +
                </button>
            </div>
        </a>
    </li>`;

    if (returnString) return newLi;

    // Thêm tag <li> vừa tạo vào <ul> homeproduct (mặc định) , hoặc tag ele truyền vào
    var products = ele || document.getElementById('products');
    products.innerHTML += newLi; // Ensure products are appended correctly
}

// Ensure to initialize your products when the page loads
window.onload = function() {
    // Initialize your product list and add to display
    for (var product of list_products) { // Assuming list_products is defined
        addToWeb(product, document.getElementById('products')); // Display in the product section
    }
};
