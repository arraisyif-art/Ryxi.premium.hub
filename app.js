const planSelect = document.querySelector("#plan");
const paymentSelect = document.querySelector("#payment");
const summaryText = document.querySelector("#summary-text");
const signupForm = document.querySelector("#signup-form");
const loginForm = document.querySelector("#login-form");
const paymentForm = document.querySelector("#payment-form");
const agree = document.querySelector("#agree");
const agreeError = document.querySelector("#agree-error");
const message = document.querySelector("#form-message");
const signupMessage = document.querySelector("#signup-message");
const loginMessage = document.querySelector("#login-message");
const authPanel = document.querySelector(".auth-panel");
const paymentSection = document.querySelector("#payment-section");
const invoiceModal = document.querySelector("#invoice-modal");
const invoiceList = document.querySelector("#invoice-list");
const closeInvoice = document.querySelector("#close-invoice");
const closeInvoice2 = document.querySelector("#close-invoice-2");
const goCheckout = document.querySelector("#go-checkout");
const sendWhatsapp = document.querySelector("#send-whatsapp");
const accountText = document.querySelector("#account-text");

const ADMIN_WA = "6282246656931";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const plans = {
  "CapCut Pro": 49000,
  "Netflix": 59000,
  "Canva Pro": 55000,
  "ChatGPT Premium": 79000,
};

const updateSummary = (planName) => {
  if (!planName || !plans[planName]) {
    summaryText.textContent = "Belum ada paket dipilih.";
    return;
  }

  summaryText.textContent = `${planName} - ${currency.format(plans[planName])} / bulan`;
};

const updateAccountSummary = (data) => {
  if (!accountText) return;
  if (!data) {
    accountText.textContent = "Belum ada data akun.";
    return;
  }
  accountText.textContent = `${data.nama || "Pengguna"} • ${data.email || "-"} • ${data.telepon || "-"}`;
};

const openInvoice = (data) => {
  if (!invoiceModal || !invoiceList) return;
  invoiceList.innerHTML = "";
  const rows = [
    ["Nama", data.nama],
    ["Email", data.email],
    ["No. Telepon", data.telepon],
    ["Layanan", data.plan],
    ["Harga", `${currency.format(data.price)} / bulan`],
    ["Metode Bayar", data.payment],
    ["Mode", data.mode === "login" ? "Login" : "Sign Up"],
  ];
  rows.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "invoice-item";
    item.innerHTML = `<span>${label}</span><span>${value}</span>`;
    invoiceList.appendChild(item);
  });
  invoiceModal.classList.add("open");
  invoiceModal.setAttribute("aria-hidden", "false");
};

const closeInvoiceModal = () => {
  if (!invoiceModal) return;
  invoiceModal.classList.remove("open");
  invoiceModal.setAttribute("aria-hidden", "true");
};

const buildWhatsappText = (data) => {
  return [
    "Halo, saya ingin berlangganan:",
    `Nama: ${data.nama}`,
    `Email: ${data.email}`,
    `Telepon: ${data.telepon}`,
    `Layanan: ${data.plan}`,
    `Harga: ${currency.format(data.price)} / bulan`,
    `Metode bayar: ${data.payment}`,
  ].join("\n");
};

const setError = (field, text) => {
  const group = document.querySelector(`[data-field="${field}"]`);
  if (!group) return;
  const error = group.querySelector(".error");
  if (error) error.textContent = text;
};

const clearErrors = () => {
  document.querySelectorAll(".error").forEach((node) => {
    node.textContent = "";
  });
  if (agreeError) agreeError.textContent = "";
  if (message) message.textContent = "";
  if (signupMessage) signupMessage.textContent = "";
  if (loginMessage) loginMessage.textContent = "";
};

document.querySelectorAll(".choose").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const card = event.target.closest(".service");
    if (!card) return;
    const plan = card.dataset.plan;
    planSelect.value = plan;
    updateSummary(plan);

    const rawAccount = localStorage.getItem("premiumAccount");
    if (!rawAccount) {
      if (message) message.textContent = "Silakan login atau sign up dulu sebelum lanjut pembayaran.";
      if (authPanel) authPanel.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (paymentSection) paymentSection.scrollIntoView({ behavior: "smooth" });
  });
});

planSelect.addEventListener("change", (event) => {
  updateSummary(event.target.value);
});

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    let valid = true;
    const nama = document.querySelector("#su-nama");
    const email = document.querySelector("#su-email");
    const telepon = document.querySelector("#su-telepon");
    const password = document.querySelector("#su-password");
    const confirm = document.querySelector("#su-confirm");

    if (nama.value.trim().length < 3) {
      setError("su-nama", "Nama minimal 3 karakter.");
      valid = false;
    }

    if (!email.value.includes("@")) {
      setError("su-email", "Email tidak valid.");
      valid = false;
    }

    if (telepon.value.trim().length < 9) {
      setError("su-telepon", "No. telepon minimal 9 digit.");
      valid = false;
    }

    if (password.value.trim().length < 6) {
      setError("su-password", "Password minimal 6 karakter.");
      valid = false;
    }

    if (confirm.value !== password.value) {
      setError("su-confirm", "Konfirmasi password tidak cocok.");
      valid = false;
    }

    if (!valid) {
      if (signupMessage) signupMessage.textContent = "Periksa kembali data sign up.";
      return;
    }

    const account = {
      nama: nama.value.trim(),
      email: email.value.trim(),
      telepon: telepon.value.trim(),
      mode: "signup",
    };
    localStorage.setItem("premiumAccount", JSON.stringify(account));
    updateAccountSummary(account);
    if (signupMessage) signupMessage.textContent = "Data akun tersimpan.";
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    const email = document.querySelector("#login-email");
    const password = document.querySelector("#login-password");
    let valid = true;

    if (!email.value.includes("@")) {
      setError("login-email", "Email tidak valid.");
      valid = false;
    }

    if (password.value.trim().length < 6) {
      setError("login-password", "Password minimal 6 karakter.");
      valid = false;
    }

    if (!valid) {
      if (loginMessage) loginMessage.textContent = "Periksa kembali data login.";
      return;
    }

    const account = {
      nama: "Pengguna",
      email: email.value.trim(),
      telepon: "-",
      mode: "login",
    };
    localStorage.setItem("premiumAccount", JSON.stringify(account));
    updateAccountSummary(account);
    if (loginMessage) loginMessage.textContent = "Login tersimpan.";
  });
}

if (paymentForm) {
  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    let valid = true;
    const rawAccount = localStorage.getItem("premiumAccount");
    const account = rawAccount ? JSON.parse(rawAccount) : null;

    if (!account) {
      if (message) message.textContent = "Isi data Sign Up atau Login dulu.";
      if (authPanel) authPanel.scrollIntoView({ behavior: "smooth" });
      valid = false;
    }

    if (!paymentSelect.value) {
      setError("payment", "Pilih metode pembayaran.");
      valid = false;
    }

    if (!planSelect.value) {
      setError("plan", "Pilih layanan terlebih dahulu.");
      valid = false;
    }

    if (agree && !agree.checked) {
      agreeError.textContent = "Kamu harus menyetujui syarat & ketentuan.";
      valid = false;
    }

    if (!valid) {
      if (message) message.textContent = "Periksa kembali data pembayaran.";
      return;
    }

    const order = {
      nama: account.nama,
      email: account.email,
      telepon: account.telepon,
      plan: planSelect.value,
      price: plans[planSelect.value],
      payment: paymentSelect.value,
      mode: account.mode,
    };

    localStorage.setItem("premiumOrder", JSON.stringify(order));
    updateSummary(order.plan);
    openInvoice(order);
    if (message) message.textContent = "Data berhasil diproses. Silakan lanjutkan ke checkout.";
  });
}

updateSummary("");
const savedAccount = localStorage.getItem("premiumAccount");
updateAccountSummary(savedAccount ? JSON.parse(savedAccount) : null);

if (closeInvoice) closeInvoice.addEventListener("click", closeInvoiceModal);
if (closeInvoice2) closeInvoice2.addEventListener("click", closeInvoiceModal);
if (invoiceModal) {
  invoiceModal.addEventListener("click", (event) => {
    if (event.target === invoiceModal) closeInvoiceModal();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeInvoiceModal();
});

if (goCheckout) {
  goCheckout.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
}

if (sendWhatsapp) {
  sendWhatsapp.addEventListener("click", () => {
    const raw = localStorage.getItem("premiumOrder");
    if (!raw) return;
    const order = JSON.parse(raw);
    const text = encodeURIComponent(buildWhatsappText(order));
    const url = `https://wa.me/${ADMIN_WA}?text=${text}`;
    window.open(url, "_blank");
  });
}
