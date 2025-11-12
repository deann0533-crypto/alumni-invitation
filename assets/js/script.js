// =========================================================
// Iowa Club Korea 2025 - Full Bilingual Script
// =========================================================

let currentLang = "ko";

document.addEventListener("DOMContentLoaded", () => {
  // 지도 버튼
  document.getElementById("openMapBtn")?.addEventListener("click", (e) => {
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

  const required = [
    "name",
    "graduationYear",
    "ageGroup",
    "major",
    "email",
    "phone",
    "payment",
    "transport"
  ];
  for (const f of required)
    if (!formData.get(f)) return alert("모든 필수 입력칸을 정확히 채워주세요.");

  if (formData.get("transport") === "자차" && !formData.get("carNumber"))
    return alert("자차 이용 시 차량번호를 입력해 주세요.");
  if (formData.get("transport") === "기타" && !formData.get("transportOther"))
    return alert("기타 교통수단을 입력해 주세요.");
  if (formData.get("payment") !== "입금 완료")
    return alert("참가비 입금 후 '입금 완료'를 선택해 주세요.");

  fetch(
    "https://docs.google.com/forms/d/1c9Y_Vjp3wHbWFum47AF-fcDROZGrrapNJQxCTWFuduk/formResponse",
    {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams(Object.fromEntries(formData))
    }
  ).then(() => {
    form.reset();
    setTransportFields("");
    const msg = document.getElementById("successMessage");
    msg.textContent =
      currentLang === "en"
        ? "✅ Your RSVP has been submitted. Thank you!"
        : "✅ 신청이 완료되었습니다. 감사합니다!";
    msg.classList.add("show");
    setTimeout(() => msg.classList.remove("show"), 3000);
  });
}

// =========================================================
// 언어 전환
// =========================================================
function initLanguageSwitcher() {
  const t = {
    ko: {
      invitation: `<p><strong>Hawkeyes: Past, Present, and Future</strong></p><br/>
        <p>한 해를 돌아보며, 함께 웃고 추억하는 시간.</p><br/>
        <p>Hawkeyes 동문들과 함께하는 이 밤이 올해의 가장 따뜻한 순간이 되길 바라며 여러분을 초대합니다.</p><br/>
        <p style="text-align:right;font-weight:600;">Iowa Club Korea</p>`,
      mapSection: "🗺️ 오시는 길",
      mapButton: "📍 지도 앱으로 보기",
      transportGuide: "대중교통 안내",
      eventInfo: "📅 행사 정보",
      date: "일시",
      location: "장소",
      address: "주소",
      fee: "회비",
      contact: "문의",
      rsvp: "📋 참석 신청",
      submitBtn: "참석 신청하기",
      placeholders: {
        year: "예: 2020",
        major: "예: 경영학과",
        email: "example@email.com",
        phone: "01012345678",
        car: "예: 12가3456",
        other: "교통수단을 입력해주세요"
      },
      radioAge: [
        "만 20~24세",
        "만 25~29세",
        "만 30~34세",
        "만 35~39세",
        "만 40~44세",
        "만 45~49세",
        "만 50세 이상"
      ],
      transportOptions: ["대중교통", "자차", "기타"],
      payment: "입금 완료",
      copy: "복사",
      bankLabel: "입금 계좌:",
      transportGuideHTML: `
        <div class="transport-item"><div class="transport-title"><span class="icon">🚇</span><strong>지하철</strong></div><div class="transport-desc"><p><strong>5, 9호선 여의도역</strong> 3번 출구, IFC몰 연결통로 이용, 도보 15분</p><p><strong>5호선 여의나루역</strong> 1번 출구에서 도보 10분</p></div></div>
        <div class="transport-item"><div class="transport-title"><span class="icon">🚌</span><strong>버스</strong></div><div class="transport-desc"><p><strong>여의도환승센터</strong> 하차 (도보 5분)</p><p class="bus-numbers">160, 260, 261, 262, 360, 461, 600, 503, 753 등</p></div></div>
        <div class="transport-item"><div class="transport-title"><span class="icon">🚗</span><strong>자차</strong></div><div class="transport-desc"><p>더현대서울 지하 주차장 이용</p><p class="parking-info">참석자에 한해 <strong>주차 할인</strong> 지원<br/>(차량번호 사전 등록 필수)</p></div></div>`
    },
    en: {
      invitation: `<p><strong>Hawkeyes: Past, Present, and Future</strong></p><br/>
        <p>A time to look back on the past, laugh, and reminisce together.</p><br/>
        <p>We hope this night with fellow Hawkeyes will be the warmest moment of the year, and we cordially invite you to join us.</p><br/>
        <p style="text-align:right;font-weight:600;">Iowa Club Korea</p>`,
      mapSection: "🗺️ Directions",
      mapButton: "📍 View in Map App",
      transportGuide: "Public Transportation",
      eventInfo: "📅 Event Information",
      date: "Date & Time",
      location: "Venue",
      address: "Address",
      fee: "Fee",
      contact: "Contact",
      rsvp: "📋 RSVP",
      submitBtn: "Submit RSVP",
      placeholders: {
        year: "e.g. 2020",
        major: "e.g. Business Administration",
        email: "example@email.com",
        phone: "01012345678 (KR format)",
        car: "e.g. 12가3456",
        other: "Please enter your transportation method"
      },
      radioAge: [
        "Age 20–24",
        "Age 25–29",
        "Age 30–34",
        "Age 35–39",
        "Age 40–44",
        "Age 45–49",
        "Age 50+"
      ],
      transportOptions: ["Public Transport", "Car", "Other"],
      payment: "Payment Completed",
      copy: "Copy",
      bankLabel: "Bank Account:",
      transportGuideHTML: `
        <div class="transport-item"><div class="transport-title"><span class="icon">🚇</span><strong>Subway</strong></div><div class="transport-desc"><p><strong>Yeouido Station (Lines 5 & 9)</strong> Exit 3 – 15 min walk via IFC Mall</p><p><strong>Yeouinaru Station (Line 5)</strong> Exit 1 – 10 min walk</p></div></div>
        <div class="transport-item"><div class="transport-title"><span class="icon">🚌</span><strong>Bus</strong></div><div class="transport-desc"><p><strong>Yeouido Transfer Center</strong> stop (5-min walk)</p><p class="bus-numbers">160, 260, 261, 262, 360, 461, 600, 503, 753</p></div></div>
        <div class="transport-item"><div class="transport-title"><span class="icon">🚗</span><strong>Car</strong></div><div class="transport-desc"><p>Use The Hyundai Seoul underground parking</p><p class="parking-info">Parking discount provided for attendees<br/>(vehicle registration required)</p></div></div>`
    }
  };

  const btns = document.querySelectorAll(".lang-btn");
  btns.forEach((btn) =>
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentLang = btn.dataset.lang;
      setLang(t[currentLang]);
    })
  );

  function setLang(tt) {
    document.getElementById("invitationText").innerHTML = tt.invitation;
    document.querySelector(".map-section h2").textContent = tt.mapSection;
    document.getElementById("openMapBtn").textContent = tt.mapButton;
    document.querySelector(".transport-guide h3").textContent = tt.transportGuide;
    document.querySelector(".transport-guide").innerHTML =
      `<h3>${tt.transportGuide}</h3>` + tt.transportGuideHTML;

    document.querySelector(".event-info h2").textContent = tt.eventInfo;
    document.querySelector(".rsvp-section h2").textContent = tt.rsvp;
    document.querySelector(".submit-btn").textContent = tt.submitBtn;

    // Placeholder
    document.getElementById("graduationYear").placeholder = tt.placeholders.year;
    document.getElementById("major").placeholder = tt.placeholders.major;
    document.getElementById("email").placeholder = tt.placeholders.email;
    document.getElementById("phone").placeholder = tt.placeholders.phone;
    document.getElementById("carNumber").placeholder = tt.placeholders.car;
    document.getElementById("transportOther").placeholder = tt.placeholders.other;

    // 라디오 연령대
    const ageLabels = document.querySelectorAll('input[name="ageGroup"] + label');
    ageLabels.forEach((label, i) => (label.textContent = tt.radioAge[i]));

    // 교통수단 선택지
    const transportLabels = document.querySelectorAll('input[name="transport"] + label');
    transportLabels.forEach((label, i) => (label.textContent = tt.transportOptions[i]));

    // 입금 완료 라벨
    document.querySelector('label[for="paidYes"]').textContent = tt.payment;

    // 복사 버튼
    const copyBtn = document.getElementById("copyAccountBtn");
    copyBtn.textContent = tt.copy;

    // 계좌 라벨
    document.querySelector("#bankAccountText strong").textContent = tt.bankLabel;
  }
}
