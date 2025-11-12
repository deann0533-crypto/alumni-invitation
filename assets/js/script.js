// =========================================================
// Iowa Club Korea 2025 - Perfect Bilingual Version (KR/EN)
// =========================================================

let currentLang = "ko";

document.addEventListener("DOMContentLoaded", () => {
  // 지도 버튼
  const openMapBtn = document.getElementById("openMapBtn");
  openMapBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openMap();
  });

  // RSVP 제출
  document.getElementById("rsvp-form")?.addEventListener("submit", submitRSVP);

  // 계좌 복사 버튼
  const copyBtn = document.getElementById("copyAccountBtn");
  copyBtn?.addEventListener("click", async () => {
    const account =
      copyBtn.dataset.account ||
      document.querySelector(".account-number")?.textContent?.trim();
    if (!account) return;

    const copyText = currentLang === "en" ? "Copied!" : "복사됨!";
    const original = currentLang === "en" ? "Copy" : "복사";

    try {
      await navigator.clipboard.writeText(account);
      copyBtn.textContent = copyText;
      copyBtn.disabled = true;
      setTimeout(() => {
        copyBtn.textContent = original;
        copyBtn.disabled = false;
      }, 1200);
    } catch {
      document.execCommand("copy");
      copyBtn.textContent = copyText;
      setTimeout(() => (copyBtn.textContent = original), 1200);
    }
  });

  // 초기 상태
  setTransportFields("");
  initLanguageSwitcher();
});

// =========================================================
// 교통수단 토글
// =========================================================
function setTransportFields(value) {
  const car = document.getElementById("carNumberGroup");
  const other = document.getElementById("otherTransportGroup");
  if (!car || !other) return;
  car.classList.add("hidden");
  other.classList.add("hidden");
  if (value === "자차" || value === "Car") car.classList.remove("hidden");
  if (value === "기타" || value === "Other") other.classList.remove("hidden");
}

document.addEventListener("change", (e) => {
  if (e.target.name === "transport") setTransportFields(e.target.value);
});

// =========================================================
// 지도 모달
// =========================================================
function openMap() {
  const modal = document.getElementById("mapModal");
  modal.classList.remove("hidden");
  const naverBtn = document.getElementById("naverBtn");
  const kakaoBtn = document.getElementById("kakaoBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const query = encodeURIComponent("스위치22");
  kakaoBtn.onclick = () => {
    window.open(`https://map.kakao.com/link/search/${query}`, "_blank");
    modal.classList.add("hidden");
  };
  naverBtn.onclick = () => {
    window.open(`https://map.naver.com/v5/search/${query}`, "_blank");
    modal.classList.add("hidden");
  };
  cancelBtn.onclick = () => modal.classList.add("hidden");
  modal.onclick = (e) => e.target === modal && modal.classList.add("hidden");
}

// =========================================================
// RSVP 제출
// =========================================================
function submitRSVP(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
