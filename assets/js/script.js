// DOM 준비 후 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
  // 지도 버튼
  const openMapBtn = document.getElementById("openMapBtn");
  openMapBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openMap();
  });

  // 교통수단 라디오 변경
  ["publicTransport", "car", "other"].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener("change", toggleTransportFields);
  });

  // 폼 제출
  const form = document.getElementById("rsvp-form");
  form?.addEventListener("submit", submitRSVP);

  // 최초 로드시 숨김 상태 보정
  toggleTransportFields();

  // 계좌번호 복사 버튼
  const copyBtn = document.getElementById("copyAccountBtn");
  copyBtn?.addEventListener("click", async () => {
    const account = copyBtn.dataset.account || document.querySelector(".account-number")?.textContent?.trim();
    if (!account) return;

    try {
      await navigator.clipboard.writeText(account);
      const original = copyBtn.textContent;
      copyBtn.textContent = "복사됨!";
      copyBtn.disabled = true;
      setTimeout(() => {
        copyBtn.textContent = original;
        copyBtn.disabled = false;
      }, 1200);
    } catch (e) {
      // clipboard API 실패 시 폴백
      const sel = window.getSelection();
      const range = document.createRange();
      const node = document.querySelector(".account-number");
      if (!node) return;
      range.selectNodeContents(node);
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand("copy");
      sel.removeAllRanges();
      const original = copyBtn.textContent;
      copyBtn.textContent = "복사됨!";
      copyBtn.disabled = true;
      setTimeout(() => {
        copyBtn.textContent = original;
        copyBtn.disabled = false;
      }, 1200);
    }
  });
});

/* =========================================================
   교통수단 라디오에 따른 입력 필드 토글
   ========================================================= */
function toggleTransportFields() {
  const carRadio = document.getElementById("car");
  const otherRadio = document.getElementById("other");
  const carNumberGroup = document.getElementById("carNumberGroup");
  const otherTransportGroup = document.getElementById("otherTransportGroup");

  if (!carNumberGroup || !otherTransportGroup) return;

  if (carRadio?.checked) {
    carNumberGroup.classList.remove("hidden");
    otherTransportGroup.classList.add("hidden");
  } else if (otherRadio?.checked) {
    otherTransportGroup.classList.remove("hidden");
    carNumberGroup.classList.add("hidden");
  } else {
    carNumberGroup.classList.add("hidden");
    otherTransportGroup.classList.add("hidden");
  }
}

/* =========================================================
   지도 앱 선택 모달
   ========================================================= */
function openMap() {
  const modal = document.getElementById("mapModal");
  modal.classList.remove("hidden");

  const naverBtn = document.getElementById("naverBtn");
  const kakaoBtn = document.getElementById("kakaoBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const query = encodeURIComponent("스위치22");
  const kakaoUrl = `https://map.kakao.com/link/search/${query}`;
  const naverUrl = `https://map.naver.com/v5/search/${query}`;

  kakaoBtn.onclick = () => {
    window.open(kakaoUrl, "_blank");
    closeModal();
  };

  naverBtn.onclick = () => {
    window.open(naverUrl, "_blank");
    closeModal();
  };

  cancelBtn.onclick = closeModal;

  // 배경 클릭 시 닫기
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  function closeModal() {
    modal.classList.add("hidden");
  }
}

/* =========================================================
   RSVP 제출 처리 (Google Form 전송)
   ========================================================= */
function submitRSVP(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  // ✅ 참가비 '예' 확인 (입금 완료 선택 필수)
  const payment = formData.get("payment");
  if (payment !== "입금 완료") {
    alert("참가비 입금 후 '예'를 선택해 주세요."); // <- 수정된 메시지
    return; // 전송 중단
  }

  // Google Form endpoint
  const googleFormUrl =
    "https://docs.google.com/forms/d/1c9Y_Vjp3wHbWFum47AF-fcDROZGrrapNJQxCTWFuduk/formResponse";

  const params = new URLSearchParams({
    "entry.1776982355": formData.get("name"),
    "entry.1355659894": formData.get("graduationYear"),
    "entry.1130149190": formData.get("ageGroup"),
    "entry.1725897632": formData.get("major"),
    "entry.907944483": formData.get("email"),
    "entry.384771722": formData.get("phone"),
    "entry.148829751": formData.get("payment"),
    "entry.1578977719": formData.get("transport"),
    "entry.659569829": formData.get("transportOther") || "",
    "entry.1500214709": formData.get("carNumber") || ""
  });

  // 전송
  fetch(googleFormUrl, { method: "POST", mode: "no-cors", body: params })
    .then(() => {
      form.reset();
      toggleTransportFields(); // 초기화 후 숨김 상태 재적용
      const msg = document.getElementById("successMessage");
      msg?.classList.add("show");
      setTimeout(() => msg?.classList.remove("show"), 3000);
    })
    .catch((err) => {
      console.error("RSVP Error:", err);
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    });
}
