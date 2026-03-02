const planSelect = document.querySelector("#plan");
const paymentSelect = document.querySelector("#payment");
const summaryText = document.querySelector("#summary-text");
const accountForm = document.querySelector("#account-form");
const paymentForm = document.querySelector("#payment-form");
const agree = document.querySelector("#agree");
const agreeError = document.querySelector("#agree-error");
const message = document.querySelector("#form-message");
const accountMessage = document.querySelector("#account-message");
const invoiceModal = document.querySelector("#invoice-modal");
const invoiceList = document.querySelector("#invoice-list");
const closeInvoice = document.querySelector("#close-invoice");
const closeInvoice2 = document.querySelector("#close-invoice-2");
const goCheckout = document.querySelector("#go-checkout");
const sendWhatsapp = document.querySelector("#send-whatsapp");
const accountText = document.querySelector("#account-text");
const stepAccount = document.querySelector("#step-account");
const stepProducts = document.querySelector("#step-products");
const stepPayment = document.querySelector("#step-payment");
const loading = document.querySelector("#loading");
const loadingText = document.querySelector("#loading-text");

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

const showStep = (target) => {
  [stepAccount, stepProducts, stepPayment].forEach((section) => {
    if (!section) return;
    section.classList.toggle("active", section === target);
  });
  if (target) target.scrollIntoView({ behavior: "smooth" });
};

const showLoading = (text = "Memuat...") => {
  if (!loading) return;
  if (loadingText) loadingText.textContent = text;
  loading.classList.add("show");
  loading.setAttribute("aria-hidden", "false");
};

const hideLoading = () => {
  if (!loading) return;
  loading.classList.remove("show");
  loading.setAttribute("aria-hidden", "true");
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
  if (accountMessage) accountMessage.textContent = "";
};

document.querySelectorAll(".choose").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const card = event.target.closest(".service");
    if (!card) return;
    const plan = card.dataset.plan;
    planSelect.value = plan;
    updateSummary(plan);

    showLoading("Menyiapkan pembayaran...");
    setTimeout(() => {
      hideLoading();
      showStep(stepPayment);
    }, 800);
  });
});

planSelect.addEventListener("change", (event) => {
  updateSummary(event.target.value);
});

if (accountForm) {
  accountForm.addEventListener("submit", (event) => {
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
      if (accountMessage) accountMessage.textContent = "Periksa kembali data diri.";
      return;
    }

    const account = {
      nama: nama.value.trim(),
      email: email.value.trim(),
      telepon: telepon.value.trim(),
    };
    localStorage.setItem("premiumAccount", JSON.stringify(account));
    updateAccountSummary(account);
    if (accountMessage) accountMessage.textContent = "Data tersimpan. Lanjut memilih layanan.";

    showLoading("Mengarahkan ke daftar layanan...");
    setTimeout(() => {
      hideLoading();
      showStep(stepProducts);
    }, 800);
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
      if (message) message.textContent = "Isi data diri dulu sebelum pembayaran.";
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
showStep(stepAccount);

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
