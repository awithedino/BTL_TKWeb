function khoiTao() {
    list_products = getListProducts() || list_products;
    capNhat_ThongTin_CurrentUser();
    addEventCloseAlertButton();
}

function setListProducts(newList) {
    window.localStorage.setItem('ListProducts', JSON.stringify(newList));
}

function getListProducts() {
    return JSON.parse(window.localStorage.getItem('ListProducts'));
}

function timKiemTheoTen(list, ten, soluong) {
    var tempList = copyObject(list);
    var result = [];
    ten = ten.split(' ');

    for (var sp of tempList) {
        var correct = true;
        for (var t of ten) {
            if (sp.name.toUpperCase().indexOf(t.toUpperCase()) < 0) {
                correct = false;
                break;
            }
        }
        if (correct) {
            result.push(sp);
        }
    }

    return result;
}

function timKiemTheoMa(list, ma) {
    for (var l of list) {
        if (l.masp == ma) return l;
    }
}

function copyObject(o) {
    return JSON.parse(JSON.stringify(o));
}

function addAlertBox(text, bgcolor, textcolor, time) {
    var al = document.getElementById('alert');
    al.childNodes[0].nodeValue = text;
    al.style.backgroundColor = bgcolor;
    al.style.opacity = 1;
    al.style.zIndex = 200;

    if (textcolor) al.style.color = textcolor;
    if (time)
        setTimeout(function () {
            al.style.opacity = 0;
            al.style.zIndex = 0;
        }, time);
}

function addEventCloseAlertButton() {
    document.getElementById('closebtn')
        .addEventListener('mouseover', (event) => {
            event.target.parentElement.style.opacity = 0;
            event.target.parentElement.style.zIndex = 0;
        });
}

function themVaoGioHang(masp, productName) {
    let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    
    let product = guestCart.find(p => p.ma === masp);

    if (product) {
        product.soluong++;
    } else {
        guestCart.push({ ma: masp, soluong: 1, date: new Date() });
    }

    localStorage.setItem("guestCart", JSON.stringify(guestCart));
    addAlertBox(`Đã thêm ${productName} vào giỏ hàng`, '#4CAF50', '#fff', 3000);
    
    capNhat_ThongTin_CurrentUser();
}

function getListUser() {
    var data = JSON.parse(window.localStorage.getItem('ListUser')) || [];
    var l = [];
    for (var d of data) {
        l.push(d);
    }
    return l;
}

function setListUser(l) {
    window.localStorage.setItem('ListUser', JSON.stringify(l));
}

function showTaiKhoan(show) {
    var value = (show ? "scale(1)" : "scale(0)");
    var div = document.getElementsByClassName('containTaikhoan')[0];
    div.style.transform = value;
}

function capNhat_ThongTin_CurrentUser() {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    const itemCount = guestCart.reduce((total, item) => total + item.soluong, 0);
    document.getElementsByClassName('cart-number')[0].textContent = itemCount;
}

function getTongSoLuongSanPhamTrongGioHang() {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    return guestCart.reduce((total, item) => total + item.soluong, 0);
}

function numToString(num, char) {
    return num.toLocaleString().split(',').join(char || '.');
}

function stringToNum(str, char) {
    return Number(str.split(char || '.').join(''));
}

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            if (currentFocus > -1) {
                if (x) {
                    x[currentFocus].click();
                    e.preventDefault();
                }
            }
        }
    });

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function addTags(nameTag, link) {
    var new_tag = `<a href=` + link + `>` + nameTag + `</a>`;
    var khung_tags = document.getElementsByClassName('tags')[0];
    khung_tags.innerHTML += new_tag;
}

function addProduct(p, ele, returnString) {
    promo = new Promo(p.promo.name, p.promo.value);
    product = new Product(p.masp, p.name, p.img, p.price, p.star, p.rateCount, promo);
    return addToWeb(product, ele, returnString);
}

function addHeader() {
    document.write(`        
	<div class="header group">
        <div class="logo">
            <a href="index.html">
                <img src="img/logo.png" alt="Trang chủ Smartphone Store" title="Trang chủ Smartphone Store">
            </a>
        </div>
        <div class="content">
            <div class="search-header" style="position: relative; left: 162px; top: 1px;">
                <form class="input-search" method="get" action="index.html">
                    <div class="autocomplete">
                        <input id="search-box" name="search" autocomplete="off" type="text" placeholder="Nhập từ khóa tìm kiếm...">
                        <button type="submit">
                            <i class="fa fa-search"></i>
                            Tìm kiếm
                        </button>
                    </div>
                </form>
                <div class="tags">
                    <strong>Từ khóa: </strong>
                </div>
            </div>
            <div class="tools-member">
                <div class="member">
                    <a>
                        <i class="fa fa-user"></i>
                        Tài khoản
                    </a>
                </div>
                <div class="cart">
                    <a href="giohang.html">
                        <i class="fa fa-shopping-cart"></i>
                        <span>Giỏ hàng</span>
                        <span class="cart-number"></span>
                    </a>
                </div>
            </div>
        </div>
    </div>`);
}

function addFooter() {
    document.write(`
    <div id="alert">
        <span id="closebtn">&otimes;</span>
    </div>
    <div class="copy-right">
        <p><a href="index.html">4 TL Store</a> - All rights reserved © 2024 - Designed by Group 4 TL
    </div>`);
}

function addPlc() {
    document.write(`
    <div class="plc">
        <section>
            <ul class="flexContain">
                <li>Giao hàng toàn quốc</li>
                <li>Thanh toán linh hoạt: tiền mặt, visa / master, trả góp</li>
                <li>Trải nghiệm sản phẩm tại nhà</li>
                <li>Lỗi đổi tại nhà trong 7 ngày đối với máy mới</li>
                <li>Hỗ trợ suốt thời gian sử dụng.
                    <br>Hotline:
                    <a href="tel:0123456789" style="color: #288ad6;">0123456789</a>
                </li>
            </ul>
        </section>
    </div>`);
}

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function gotoTop() {
    if (window.jQuery) {
        jQuery('html,body').animate({
            scrollTop: 0
        }, 100);
    } else {
        document.getElementsByClassName('top-nav')[0].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
