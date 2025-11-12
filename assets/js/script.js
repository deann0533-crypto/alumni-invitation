// =========================================================
// Iowa Club Korea 2025 - FINAL VERIFIED BILINGUAL VERSION
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
  const form = document.getElementById("rsvp-form");
  form?.addEventListener("submit", submitRSVP);

  // 복사 버튼
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
    if (!formData.get(f))
      return alert(
        currentLang === "en"
          ? "Please fill out all required fields."
          : "모든 필수 입력칸을 정확히 채워주세요."
      );

  const transportValue = formData.get("transport");
  if (
    (transportValue === "자차" || transportValue === "Car") &&
    !formData.get("carNumber")
  )
    return alert(
      currentLang === "en"
        ? "Please enter your vehicle number if you drive."
        : "자차 이용 시 차량번호를 입력해 주세요."
    );
  if (
    (transportValue === "기타" || transportValue === "Other") &&
    !formData.get("transportOther")
  )
    return alert(
      currentLang === "en"
        ? "Please enter your transportation method."
        : "기타 교통수단을 입력해 주세요."
    );
  if (
    formData.get("payment") !== "입금 완료" &&
    formData.get("payment") !== "Payment Completed"
  )
    return alert(
      currentLang === "en"
        ? "Please confirm payment before proceeding."
        : "참가비 입금 후 '입금 완료'를 선택해 주세요."
    );

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
  const translations = {
    ko: {
      invitation: `<p><strong>Hawkeyes: Past, Present, and Future</strong></p>
        <br/><p>한 해를 돌아보며, 함께 웃고 추억하는 시간.</p>
        <br/><p>Hawkeyes 동문들과 함께하는 이 밤이 올해의 가장 따뜻한 순간이 되길 바라며 여러분을 초대합니다.</p>
        <br/><p style="text-align:right;font-weight:600;">Iowa Club Korea</p>`,
      mapSection: "🗺️ 오시는 길",
      mapButton: "📍 지도 앱으로 보기",
      eventInfo: "📅 행사 정보",
      // [수정됨] 행사 정보 상세 내용을 객체에 포함
      eventDetails: {
        labels: ["일시", "장소", "주소", "회비", "문의"],
        values: [
          "2025년 12월 12일 (금) 오후 6시 30분 ~ 9시 30분",
          `여의도 파크원 타워2 스위치22
          <div class="event-info-note">
            타워2 1층 저층부 엘리베이터 앞 아이오와 동문회 행사 진행원의 안내를 받아 입장 (지하 1층은 입장 불가)
          </div>`,
          "서울특별시 영등포구 여의대로 108 파크원 타워2 22층",
          "1인 50,000원",
          `이환석 (<a href="tel:01089674981">010-8967-4981</a>)<br/>
          문정호 (<a href="tel:01026786495">010-2678-6495</a>)`
        ]
      },
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
      age: [
        "만 20~24세",
        "만 25~29세",
        "만 30~34세",
        "만 35~39세",
        "만 40~44세",
        "만 45~49세",
        "만 50세 이상"
      ],
      transport: ["대중교통", "자차", "기타"],
      payment: "입금 완료",
      copy: "복사",
      transportGuideHTML: `
        <h3>대중교통 안내</h3>
        <div class="transport-item"><div class="transport-title"><span class="icon">🚇</span><strong>지하철</strong></div><div class="transport-desc"><p><strong>5, 9호선 여의도역</strong> 3번 출구, IFC몰 연결통로 이용, 도보 15분</p><p><strong>5호선 여의나루역</strong> 1번 출구에서 도보 10분</p></div></div>
        <div class="transport-item"><div class="transport-title"><span class="icon">🚌</span><strong>버스</strong></div><div class="transport-desc"><p><strong>여의도환승센터</strong> 하차 (도보 5분)</p><p class="bus-numbers">160, 260, 261, 262, 360, 461, 600, 503, 753 등</p></div></div>
        <div class="transport-item"><div class="transport-title"><span class="icon">🚗</span><strong>자차</strong></div><div class="transport-desc"><p>더현대서울 지하 주차장 이용</p><p class="parking-info">참석자에 한해 <strong>주차 할인</strong> 지원<br/>(차량번호 사전 등록 필수)</p></div></div>`
    },
    en: {
      invitation: `<p><strong>Hawkeyes: Past, Present, and Future</strong></p>
        <br/><p>A time to look back on the past, laugh, and reminisce together.</p>
        <br/><p>We hope this night with fellow Hawkeyes will be the warmest moment of the year, and we cordially invite you to join us.</p>
        <br/><p style="text-align:right;font-weight:600;">Iowa Club Korea</p>`,
      mapSection: "🗺️ Directions",
      mapButton: "📍 View in Map App",
      eventInfo: "📅 Event Information",
      // [수정됨] 행사 정보 상세 내용을 객체에 포함
      eventDetails: {
        labels: ["Date & Time", "Venue", "Address", "Fee", "Contact"],
        values: [
          "Dec 12, 2025 (Fri) · 6:30–9:30 PM",
          `Switch22, Tower 2, Parc.1, Yeouido
          <div class="event-info-note">
            Please follow the Iowa Club staff’s guidance at the Tower 2 elevator lobby. (B1 entry not allowed)
          </div>`,
          "22F, Tower 2, Parc.1, 108 Yeoui-daero, Yeongdeungpo-gu, Seoul",
          "₩50,000 per person",
          `Hwanseok Lee (<a href="tel:01089674981">010-8967-4981</a>)<br/>
          Jungho Moon (<a href="tel:01026786495">010-2678-6495</a>)`
        ]
      },
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
      age: [
        "Age 20–24",
        "Age 25–29",
        "Age 30–34",
        "Age 35–39",
        "Age 40–44",
        "Age 45–49",
        "Age 50+"
      ],
      transport: ["Public Transport", "Car", "Other"],
      payment: "Payment Completed",
      copy: "Copy",
      transportGuideHTML: `
        <h3>Public Transportation</h3>
        <div class="transport-item"><div class="transport-title"><span class="icon">🚇</span><strong>Subway</strong></div><div class="transport-desc"><p><strong>Yeouido Station (Lines 5 & 9)</strong> Exit 3 – 15 min walk via IFC Mall</p><p><strong>Yeouinaru Station (Line 5)</strong> Exit 1 – 10 min walk</p></div></div>
        <div class="transport-item"><div class="transport-title"><span class="icon">🚌</span><strong>Bus</strong></div><div class="transport-desc"><p><strong>Yeouido Transfer Center</strong> stop (5-min walk)</p><p class="bus-numbers">160, 260, 261, 262, 360, 461, 600, 503, 753</p></div></div>
        <div class="transport-item"><div class="transport-title"><span class="icon">🚗</span><strong>Car</strong></div><div class="transport-desc"><p>Use The Hyundai Seoul underground parking</p><p class="parking-info">Parking discount for attendees<br/>(Vehicle registration required)</p></div></div>`
    }
  };

  const btns = document.querySelectorAll(".lang-btn");
  btns.forEach((btn) =>
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentLang = btn.dataset.lang;
      setLang(translations[currentLang]);
    })
  );

  function setLang(tt) {
    // 초대문
    document.getElementById("invitationText")?.replaceChildren();
    document.getElementById("invitationText").innerHTML = tt.invitation;

    // 제목, 버튼
    document.querySelector(".map-section h2").textContent = tt.mapSection;
    document.getElementById("openMapBtn").textContent = tt.mapButton;
    document.querySelector(".event-info h2").textContent = tt.eventInfo;
    document.querySelector(".rsvp-section h2").textContent = tt.rsvp;
    document.querySelector(".submit-btn").textContent = tt.submitBtn;

    // 교통안내 전체 교체
    const guide = document.querySelector(".transport-guide");
    if (guide) guide.innerHTML = tt.transportGuideHTML;

    // [신규 추가] 행사 정보 상세 내용 번역
    const infoItems = document.querySelectorAll(".event-info .info-item");
    if (tt.eventDetails && infoItems.length >= tt.eventDetails.labels.length) {
      infoItems.forEach((item, index) => {
        const label = item.querySelector(".info-label");
        const value = item.querySelector(".info-value");
        
        if (label && tt.eventDetails.labels[index]) {
          label.textContent = tt.eventDetails.labels[index];
        }
        if (value && tt.eventDetails.values[index]) {
          value
