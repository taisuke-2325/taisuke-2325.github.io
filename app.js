const mockCoupons = [
  {
    id: "cpn-001",
    brand: "TOHO CINEMAS",
    title: "映画鑑賞 500円OFF",
    description: "土日利用も対象。2名まで同時利用できます。",
    expiresAt: "2026/09/30",
    category: "エンタメ",
  },
  {
    id: "cpn-002",
    brand: "APA HOTEL",
    title: "宿泊料金 12%OFF",
    description: "全国の対象ホテルで使える会員限定クーポンです。",
    expiresAt: "2026/10/15",
    category: "旅行",
  },
  {
    id: "cpn-003",
    brand: "Uber Eats",
    title: "初回 1,200円OFF",
    description: "対象エリア限定。税込2,000円以上の注文で利用可能です。",
    expiresAt: "2026/08/31",
    category: "グルメ",
  },
  {
    id: "cpn-004",
    brand: "カラオケ館",
    title: "室料 30%OFF",
    description: "平日夜の利用におすすめの福利厚生クーポンです。",
    expiresAt: "2026/11/30",
    category: "レジャー",
  },
];

const els = {
  loadingPanel: document.getElementById("loading-panel"),
  loadingMessage: document.getElementById("loading-message"),
  profilePanel: document.getElementById("profile-panel"),
  displayName: document.getElementById("display-name"),
  displayMeta: document.getElementById("display-meta"),
  lineStatus: document.getElementById("line-status"),
  memberStatus: document.getElementById("member-status"),
  memberLoginPanel: document.getElementById("member-login-panel"),
  memberLoginForm: document.getElementById("member-login-form"),
  couponSection: document.getElementById("coupon-section"),
  couponGrid: document.getElementById("coupon-grid"),
  couponCount: document.getElementById("coupon-count"),
  resetDemoBtn: document.getElementById("reset-demo-btn"),
};

const state = {
  liffProfile: null,
  lineUserId: null,
  memberSession: null,
};

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

function getStoredSession() {
  try {
    const raw = window.localStorage.getItem(window.APP_CONFIG.storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveSession(session) {
  window.localStorage.setItem(
    window.APP_CONFIG.storageKey,
    JSON.stringify(session),
  );
}

function clearSession() {
  window.localStorage.removeItem(window.APP_CONFIG.storageKey);
}

function buildMemberSession(formValues) {
  return {
    linkedLineUserId: state.lineUserId,
    memberId: formValues.memberId,
    memberName: "ベネフィット会員",
    organization: "Benefit Station",
    loginAt: new Date().toISOString(),
    coupons: mockCoupons,
  };
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
  const displayName =
    state.memberSession?.memberName || state.liffProfile?.displayName || "ゲスト";
  const lineIdText = state.lineUserId ? `LINE User ID: ${state.lineUserId}` : "LINE未取得";
  const memberIdText = state.memberSession?.memberId
    ? `会員ID: ${state.memberSession.memberId}`
    : "会員未連携";

  els.displayName.textContent = displayName;
  els.displayMeta.textContent = `${lineIdText} / ${memberIdText}`;
  els.profilePanel.classList.remove("hidden");
}

function showMemberLogin() {
  hideLoading();
  els.memberLoginPanel.classList.remove("hidden");
  els.couponSection.classList.add("hidden");
  showProfile();
  setStatus(els.memberStatus, "会員ログインが必要", "is-warn");
}

function showCoupons() {
  hideLoading();
  els.memberLoginPanel.classList.add("hidden");
  els.couponSection.classList.remove("hidden");
  showProfile();
  renderCoupons(state.memberSession?.coupons ?? []);
  setStatus(els.memberStatus, "会員連携済み", "is-ready");
}

function isSessionValidForCurrentLineUser(session) {
  if (!session || !state.lineUserId) {
    return false;
  }
  return session.linkedLineUserId === state.lineUserId;
}

async function initLiff() {
  if (!window.liff) {
    throw new Error("LIFF SDKを読み込めませんでした。");
  }
  if (!window.APP_CONFIG?.liffId || window.APP_CONFIG.liffId === "REPLACE_WITH_YOUR_LIFF_ID") {
    throw new Error("config.js に LIFF ID を設定してください。");
  }

  await liff.init({
    liffId: window.APP_CONFIG.liffId,
    withLoginOnExternalBrowser: true,
  });

  if (!liff.isLoggedIn()) {
    setLoading("LINEログインに移動します…");
    liff.login();
    return;
  }

  const profile = await liff.getProfile();
  state.liffProfile = profile;
  state.lineUserId = profile.userId;
  setStatus(els.lineStatus, "LINEログイン済み", "is-ready");
}

async function bootstrap() {
  try {
    setLoading("LINE認証を確認しています…");
    await initLiff();

    if (!state.lineUserId) {
      return;
    }

    state.memberSession = getStoredSession();
    if (!isSessionValidForCurrentLineUser(state.memberSession)) {
      state.memberSession = null;
      clearSession();
    }

    if (!state.memberSession) {
      showMemberLogin();
      return;
    }

    showCoupons();
  } catch (error) {
    console.error(error);
    hideLoading();
    els.memberLoginPanel.classList.remove("hidden");
    setStatus(els.lineStatus, "LINE設定エラー", "is-warn");
    setStatus(els.memberStatus, "デモモード", "is-warn");
    els.displayName.textContent = "設定確認が必要です";
    els.displayMeta.textContent =
      error instanceof Error ? error.message : "不明なエラーが発生しました。";
    els.profilePanel.classList.remove("hidden");
  }
}

els.memberLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(els.memberLoginForm);
  const memberId = String(formData.get("memberId") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!memberId || !password) {
    return;
  }

  setLoading("会員情報を連携しています…");
  els.memberLoginPanel.classList.add("hidden");

  window.setTimeout(() => {
    state.memberSession = buildMemberSession({ memberId, password });
    saveSession(state.memberSession);
    showCoupons();
  }, 600);
});

els.resetDemoBtn.addEventListener("click", () => {
  clearSession();
  window.location.reload();
});

bootstrap();
