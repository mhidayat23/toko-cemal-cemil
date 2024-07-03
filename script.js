// Selector
const cartIcon = document.querySelector(".cart");
const cartPopup = document.querySelector(".cart-popup");
const closeCartButton = document.querySelector(".close-cart-btn");
const cartItemsList = document.querySelector(".cart-items-list");
const totalPriceElement = document.querySelector(".total-price");
const checkoutButton = document.getElementById("btnCheckout");

// Data cart
let cart = [];

// Event listener untuk membuka pop-up saat tombol Cart diklik
cartIcon.addEventListener("click", function () {
  toggleCartPopup();
  displayCartItems(); // Tampilkan isi cart saat pop-up dibuka
  updateCheckoutButtonStatus(); // Perbarui status tombol Checkout
});

// Event listener untuk menutup pop-up saat tombol Close diklik
closeCartButton.addEventListener("click", function () {
  toggleCartPopup();
});

// Event listener untuk tombol '+' dan '-'
cartItemsList.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-add-item")) {
    let productName = event.target
      .closest(".cart-item")
      .querySelector(".cart-item-name").innerText;
    increaseQuantity(productName); // Panggil fungsi untuk menambah jumlah item
  } else if (event.target.classList.contains("btn-remove-item")) {
    let productName = event.target
      .closest(".cart-item")
      .querySelector(".cart-item-name").innerText;
    decreaseQuantity(productName); // Panggil fungsi untuk mengurangi jumlah item
  }
});

// Fungsi untuk menambah item ke dalam cart
function addToCart(productName, productPrice, productImage) {
  let product = {
    name: productName,
    price: productPrice,
    image: productImage, // Menyimpan informasi gambar produk
    quantity: 1, // Menambahkan properti quantity untuk jumlah item
  };

  // Cek apakah produk sudah ada di cart
  let existingProductIndex = cart.findIndex(
    (item) => item.name === productName
  );
  if (existingProductIndex !== -1) {
    // Jika produk sudah ada, tambahkan jumlahnya
    cart[existingProductIndex].quantity++;
  } else {
    // Jika produk belum ada, tambahkan produk baru ke cart
    cart.push(product);
  }
  updateCartIcon(); // Update icon cart di navbar
  displayCartItems(); // Tampilkan isi cart saat pop-up dibuka
  updateCheckoutButtonStatus(); // Perbarui status tombol Checkout
}

// Fungsi untuk mengurangi jumlah item di dalam cart
function decreaseQuantity(productName) {
  let existingProduct = cart.find((item) => item.name === productName);
  if (existingProduct && existingProduct.quantity > 1) {
    // Kurangi jumlah jika lebih dari 1
    existingProduct.quantity--;
    displayCartItems(); // Perbarui tampilan keranjang
    updateCartIcon(); // Update ikon cart di navbar
    updateCheckoutButtonStatus(); // Perbarui status tombol Checkout
  } else if (existingProduct && existingProduct.quantity === 1) {
    // Hapus item jika jumlahnya 1
    removeItem(productName);
    updateCheckoutButtonStatus(); // Perbarui status tombol Checkout
  }
}

// Fungsi untuk menambah jumlah item di dalam cart
function increaseQuantity(productName) {
  let existingProduct = cart.find((item) => item.name === productName);
  if (existingProduct) {
    // Tambahkan jumlah
    existingProduct.quantity++;
    displayCartItems(); // Perbarui tampilan keranjang
    updateCartIcon(); // Update ikon cart di navbar
    updateCheckoutButtonStatus(); // Perbarui status tombol Checkout
  }
}

// Fungsi untuk menghapus item dari cart
function removeItem(productName) {
  cart = cart.filter((item) => item.name !== productName);
  displayCartItems(); // Tampilkan kembali isi cart setelah dihapus
  updateCartIcon(); // Update ikon cart di navbar
}

// Event listener untuk tombol 'Add to Cart'
const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    let productName = this.dataset.name;
    let productPrice = parseFloat(this.dataset.price);
    let productImage = this.closest(".box").querySelector("img").src; // Ambil gambar dari elemen terdekat

    addToCart(productName, productPrice, productImage);
  });
});

// Fungsi untuk memperbarui status tombol Checkout
function updateCheckoutButtonStatus() {
  var cartItems = document.querySelectorAll(".cart-item");

  // Jika ada item di keranjang, aktifkan tombol Checkout dan tambahkan event listener
  if (cartItems.length > 0) {
    checkoutButton.removeAttribute("disabled");
    checkoutButton.addEventListener("click", checkoutHandler);
  } else {
    // Jika keranjang kosong, nonaktifkan tombol Checkout dan hapus event listener
    checkoutButton.setAttribute("disabled", true);
    checkoutButton.removeEventListener("click", checkoutHandler);
  }
}

// Fungsi untuk menampilkan atau menyembunyikan pop-up
function toggleCartPopup() {
  cartPopup.classList.toggle("open");
}

// Fungsi untuk menampilkan isi cart pada popup
function displayCartItems() {
  // Kosongkan isi cart sebelumnya
  cartItemsList.innerHTML = "";

  // Tampilkan setiap item di cart
  cart.forEach((item) => {
    let cartItem = document.createElement("li");
    cartItem.classList.add("cart-item");

    // Isi detail item
    let itemDetails = document.createElement("div");
    itemDetails.classList.add("cart-item-details");

    // Tambahkan gambar
    let itemImage = document.createElement("img");
    itemImage.src = item.image;
    itemImage.alt = "Product Image";
    itemImage.classList.add("cart-item-image");
    itemDetails.appendChild(itemImage);

    // Tambahkan informasi nama dan aksi item
    let itemInfo = document.createElement("div");
    itemInfo.classList.add("cart-item-info");

    let itemName = document.createElement("h4");
    itemName.classList.add("cart-item-name");
    itemName.innerText = item.name;
    itemInfo.appendChild(itemName);

    let itemActions = document.createElement("div");
    itemActions.classList.add("cart-item-actions");

    let removeButton = document.createElement("button");
    removeButton.classList.add("btn-remove-item");
    removeButton.textContent = "-";
    itemActions.appendChild(removeButton);

    let quantitySpan = document.createElement("span");
    quantitySpan.classList.add("cart-item-quantity");
    quantitySpan.textContent = item.quantity; // Menampilkan jumlah item
    itemActions.appendChild(quantitySpan);

    let addButton = document.createElement("button");
    addButton.classList.add("btn-add-item");
    addButton.textContent = "+";
    itemActions.appendChild(addButton);

    itemInfo.appendChild(itemActions);
    itemDetails.appendChild(itemInfo);
    cartItem.appendChild(itemDetails);

    // Tambahkan harga produk
    let itemPrice = document.createElement("span");
    itemPrice.classList.add("cart-item-price");
    itemPrice.textContent = `Rp ${(item.price * item.quantity).toFixed(2)}`;
    cartItem.appendChild(itemPrice);

    cartItemsList.appendChild(cartItem);
  });

  // Update total harga
  updateTotalPrice();
}

// Fungsi untuk memperbarui total harga
function updateTotalPrice() {
  let totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  totalPriceElement.textContent = `Rp ${totalPrice.toFixed(2)}`;
}

// Fungsi untuk mengupdate ikon cart di navbar
function updateCartIcon() {
  const cartCountElement = document.querySelector(".cart-count");
  cartCountElement.textContent = cart
    .reduce((total, item) => total + item.quantity, 0)
    .toString();
}
function checkoutHandler() {
  if (cart.length === 0) {
    // Jika keranjang kosong, buat pesan untuk WhatsApp
    var message = "Halo, saya ingin memesan melalui WhatsApp.";
    var phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp tujuan
    var whatsappLink =
      "https://api.whatsapp.com/send?phone=" +
      phoneNumber +
      "&text=" +
      encodeURIComponent(message);

    // Buka WhatsApp dengan pesan yang sudah dibuat
    window.open(whatsappLink);
  } else {
    // Jika ada item di keranjang, buat pesan untuk WhatsApp dengan detail pesanan
    var orderMessage = "Halo, saya ingin memesan:\n\n";
    cart.forEach(function (item) {
      orderMessage +=
        item.name +
        " - Rp." +
        item.price.toFixed(2) +
        " x " +
        item.quantity +
        "\n";
    });
    orderMessage += "\nTotal: Rp." + getTotalPrice().toFixed(2);

    var phoneNumber = "62881026182708"; // Ganti dengan nomor WhatsApp tujuan
    var whatsappLink =
      "https://api.whatsapp.com/send?phone=" +
      phoneNumber +
      "&text=" +
      encodeURIComponent(orderMessage);

    // Buka WhatsApp dengan pesan yang sudah dibuat
    window.open(whatsappLink);
  }
}

// Fungsi untuk menghitung total harga pesanan
function getTotalPrice() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
