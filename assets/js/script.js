// =========================================================
// Iowa Club Korea 2025 - Main Script
// =========================================================

// DOM 준비 후 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
  // 지도 버튼 클릭 시 모달 열기
  const openMapBtn = document.getElementById("openMapBtn");
  openMapBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openMap();
  });

  // 폼 제출 이벤트
  const form = document.getElementById("rsvp-form");
  form?.addEventListener("submit", submitRSVP);

  // 계좌번호 복사 버튼
  const copyBtn = document.getElementById("copyAccountBtn");
  copyBtn?.addEventListener("click", async () => {
    const account =
      copyBtn.dataset.account ||
      document.querySelector(".account-number")?.textContent?.trim();
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

  // 페이지 로드시 교통수단 필드 초기화
  const selected = document.querySelector('input[name="transport"]:checked');
  setTransportFieldsBy(selected ? selected.value : "");
});

// =========================================================
// 교통수단 선택 시 입력칸 토글 (안전한 위임 방식)
// =========================================================
function setTransportFieldsBy(value) {
  const carGroup = document.getElementById("carNumberGroup");
  const otherGroup = document.getElementById("otherTransportGroup");
  if (!carGroup || !otherGroup) return;

  // 기본: 모두 숨김
  carGroup.classList.add("hidden");
  otherGroup.classList.add("hidden");

  if (value === "자차") {
    carGroup.classList.remove("hidden");
  } else if (value === "기타") {
    otherGroup.classList.remove("hidden");
  }
}

// ✅ 폼 전체에 변경 위임 (라디오 개별 바인딩 이슈 방지)
document.addEventListener("change", (e) => {
  if (e.target && e.target.name === "transport") {
    setTransportFieldsBy(e.target.value);
  }
});

// =========================================================
// 지도 앱 선택 모달
// =========================================================
function openMap() {
  const modal = document.getElementById("mapModal");
  if (!modal) return;
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

// =========================================================
// RSVP 제출 처리 (Google Form 전송)
// =========================================================
function submitRSVP(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  // 필수입력칸 확인
  const requiredFields = [
    "name",
    "graduationYear",
    "ageGroup",
    "major",
    "email",
    "phone",
    "payment",
    "transport"
  ];

  for (const key of requiredFields) {
    if (!formData.get(key)) {
      alert("모든 필수 입력칸을 정확히 채워주세요.");
      return;
    }
  }

  // '자차' 선택시 차량번호 필수
  if (formData.get("transport") === "자차" && !formData.get("carNumber")) {
    alert("자차 이용 시 차량번호를 입력해 주세요.");
    return;
  }

  // '기타' 선택시 기타교통수단 필수
  if (formData.get("transport") === "기타" && !formData.get("transportOther")) {
    alert("기타 교통수단을 입력해 주세요.");
    return;
  }

  // 참가비 입금 여부 체크
  if (formData.get("payment") !== "입금 완료") {
    alert("참가비 입금 후 '입금 완료'를 선택해 주세요.");
    return;
  }

  // Google Form 전송
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

  fetch(googleFormUrl, { method: "POST", mode: "no-cors", body: params })
    .then(() => {
      form.reset();
      setTransportFieldsBy("");
      const msg = document.getElementById("successMessage");
      msg?.classList.add("show");
      setTimeout(() => msg?.classList.remove("show"), 3000);
    })
    .catch((err) => {
      console.error("RSVP Error:", err);
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    });
}
