const mockCoupons = [
  {
    id: "cpn-001",
    brand: "TOHO CINEMAS",
    title: "映画鑑賞 500円OFF",
    description: "土日利用も対象。2名まで同時利用できます。",
    expiresAt: "2026/09/30",
    category: "エンタメ",
    code: "4938 2100 5001",
    note: "入場時にスタッフへご提示ください",
  },
  {
    id: "cpn-002",
    brand: "APA HOTEL",
    title: "宿泊料金 12%OFF",
    description: "全国の対象ホテルで使える会員限定クーポンです。",
    expiresAt: "2026/10/15",
    category: "旅行",
    code: "7712 6015 8824",
    note: "予約時にクーポンコードをご入力ください",
  },
  {
    id: "cpn-003",
    brand: "Uber Eats",
    title: "初回 1,200円OFF",
    description: "対象エリア限定。税込2,000円以上の注文で利用可能です。",
    expiresAt: "2026/08/31",
    category: "グルメ",
    code: "1200 8844 3201",
    note: "注文確認画面で自動適用されます",
  },
  {
    id: "cpn-004",
    brand: "カラオケ館",
    title: "室料 30%OFF",
    description: "平日夜の利用におすすめの福利厚生クーポンです。",
    expiresAt: "2026/11/30",
    category: "レジャー",
    code: "3040 7731 1108",
    note: "受付時にバーコードをご提示ください",
  },
];

const els = {
  authPage: document.getElementById("auth-page"),
  couponPage: document.getElementById("coupon-page"),
  loadingPanel: document.getElementById("loading-panel"),
  loadingMessage: document.getElementById("loading-message"),
  profilePanel: document.getElementById("profile-panel"),
  displayName: document.getElementById("display-name"),
  displayMeta: document.getElementById("display-meta"),
  lineStatus: document.getElementById("line-status"),
  memberStatus: document.getElementById("member-status"),
  lineLoginPanel: document.getElementById("line-login-panel"),
  lineLoginButton: document.getElementById("line-login-button"),
  couponGrid: document.getElementById("coupon-grid"),
  couponCount: document.getElementById("coupon-count"),
  resetDemoBtn: document.getElementById("reset-demo-btn"),
};

const state = {
  isLineLoggedIn: false,
  displayName: "LINEユーザー",
};

function showPage(page) {
  const isAuthPage = page === "auth";
  els.authPage.classList.toggle("hidden", !isAuthPage);
  els.couponPage.classList.toggle("hidden", isAuthPage);
}

function setLoading(message) {
  els.loadingMessage.textContent = message;
  els.loadingPanel.classList.remove("hidden");
}

function hideLoading() {
  els.loadingPanel.classList.add("hidden");
}

function setStatus(target, text, mode) {
  target.textContent = text;
  target.classList.remove("is-ready", "is-warn");
  if (mode) {
    target.classList.add(mode);
  }
}

function getBarcodeMarkup(seed) {
  const safeSeed = escapeHtml(seed);
  return `
    <div class="coupon-barcode" aria-hidden="true">
      <span class="coupon-barcode__bars"></span>
    </div>
    <p class="coupon-barcode__code">${safeSeed}</p>
  `;
}

function renderCoupons(coupons) {
  if (!coupons.length) {
    els.couponGrid.innerHTML =
      '<div class="panel empty-state">現在ご利用可能なクーポンはありません。</div>';
    els.couponCount.textContent = "0件";
    return;
  }

  els.couponCount.textContent = `${coupons.length}件`;
  els.couponGrid.innerHTML = coupons
    .map(
      (coupon) => `
        <article class="coupon-card">
          <div class="coupon-card__top">
            <p class="coupon-card__brand">${escapeHtml(coupon.brand)}</p>
            <h3 class="coupon-card__title">${escapeHtml(coupon.title)}</h3>
            <span class="coupon-badge">${escapeHtml(coupon.category)}</span>
          </div>
          <div class="coupon-card__body">
            <div class="coupon-card__meta">
              <span>有効期限: ${escapeHtml(coupon.expiresAt)}</span>
              <span>ID: ${escapeHtml(coupon.id)}</span>
            </div>
            <p>${escapeHtml(coupon.description)}</p>
            <div class="coupon-card__ticket">
              <div class="coupon-card__barcode-wrap">
                ${getBarcodeMarkup(coupon.code || coupon.id)}
              </div>
              <div class="coupon-card__footer">
                <p class="coupon-card__note">${escapeHtml(coupon.note || "ご利用時にご提示ください")}</p>
                <button class="coupon-card__action" type="button">クーポンを利用する</button>
              </div>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showProfile() {
  els.displayName.textContent = state.displayName;
  els.displayMeta.textContent = "LINEログイン確認済み";
  els.profilePanel.classList.remove("hidden");
}

function showLoginScreen() {
  showPage("auth");
  hideLoading();
  els.lineLoginPanel.classList.remove("hidden");
  setStatus(els.lineStatus, "LINE未ログイン", "is-warn");
  setStatus(els.memberStatus, "クーポン未表示", "is-warn");
}

function showCoupons() {
  showPage("coupon");
  hideLoading();
  els.lineLoginPanel.classList.add("hidden");
  showProfile();
  renderCoupons(mockCoupons);
  setStatus(els.lineStatus, "LINEログイン済み", "is-ready");
  setStatus(els.memberStatus, "クーポン表示中", "is-ready");
}

function simulateLineLogin() {
  els.lineLoginPanel.classList.add("hidden");
  setLoading("LINEログインを確認しています…");

  window.setTimeout(() => {
    state.isLineLoggedIn = true;
    showCoupons();
  }, 450);
}

els.lineLoginButton.addEventListener("click", () => {
  simulateLineLogin();
});

els.resetDemoBtn.addEventListener("click", () => {
  state.isLineLoggedIn = false;
  showLoginScreen();
});

showLoginScreen();
