// =========================================================
// Iowa Club Korea 2025 - Full Bilingual Script (All Form Labels + Notes)
// =========================================================

let currentLang = "ko";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("openMapBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    openMap();
  });

  document.getElementById("rsvp-form")?.addEventListener("submit", submitRSVP);

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

  if (formData.get("transport") === "자차" && !formData.get("carNumber"))
    return alert(
      currentLang === "en"
        ? "Please enter your vehicle number if you drive."
        : "자차 이용 시 차량번호를 입력해 주세요."
    );
  if (formData.get("transport") === "기타" && !formData.get("transportOther"))
    return alert(
      currentLang === "en"
        ? "Please enter your transportation method."
        : "기타 교통수단을 입력해 주세요."
    );
  if (formData.get("payment") !== "입금 완료")
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
      rsvp: "📋 참석 신청",
      submitBtn: "참석 신청하기",
      labels: {
        name: "이름 *",
        year: "졸업년도 *",
        age: "연령대 *",
        major: "전공 *",
        email: "이메일 *",
        phone: "연락처 *",
        payment: "참가비 입금 확인 *",
        transport: "오시는 경로 *",
        otherTransport: "기타 교통수단",
        carNumber: "차량번호"
      },
      placeholders: {
        year: "예: 2020",
        major: "예: 경영학과",
        email: "example@email.com",
        phone: "01012345678",
        car: "예: 12가3456",
        other: "교통수단을 입력해주세요"
      },
      ageOptions: [
        "만 20~24세",
        "만 25~29세",
        "만 30~34세",
        "만 35~39세",
        "만 40~44세",
        "만 45~49세",
        "만 50세 이상"
      ],
      transportOptions: ["대중교통", "자차", "기타"],
      paymentRadio: "입금 완료",
      copy: "복사",
      parkingHint: "주차 할인 사전 등록 필수",
      bankLabel: "입금 계좌:"
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
      rsvp: "📋 RSVP",
      submitBtn: "Submit RSVP",
      labels: {
        name: "Name *",
        year: "Graduation Year *",
        age: "Age Group *",
        major: "Major *",
        email: "Email *",
        phone: "Phone Number *",
        payment: "Payment Confirmation *",
        transport: "Transportation Method *",
        otherTransport: "Other Transportation",
        carNumber: "Vehicle Number"
      },
      placeholders: {
        year: "e.g. 2020",
        major: "e.g. Business Administration",
        email: "example@email.com",
        phone: "01012345678 (KR format)",
        car: "e.g. 12가3456",
        other: "Please enter your transportation method"
      },
      ageOptions: [
        "Age 20–24",
        "Age 25–29",
        "Age 30–34",
        "Age 35–39",
        "Age 40–44",
        "Age 45–49",
        "Age 50+"
      ],
      transportOptions: ["Public Transport", "Car", "Other"],
      paymentRadio: "Payment Completed",
      copy: "Copy",
      parkingHint: "Vehicle registration required for parking discount",
      bankLabel: "Bank Account:"
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
    document.querySelector(".event-info h2").textContent = tt.eventInfo;
    document.querySelector(".rsvp-section h2").textContent = tt.rsvp;
    document.querySelector(".submit-btn").textContent = tt.submitBtn;

    // Form 라벨
    document.querySelector('label[for="name"]').textContent = tt.labels.name;
    document.querySelector('label[for="graduationYear"]').textContent =
      tt.labels.year;
    document.querySelector(".form-group .form-label:nth-of-type(3)").textContent =
      tt.labels.age;
    document.querySelector('label[for="major"]').textContent = tt.labels.major;
    document.querySelector('label[for="email"]').textContent = tt.labels.email;
    document.querySelector('label[for="phone"]').textContent = tt.labels.phone;
    document.querySelectorAll(".form-label")[6].textContent = tt.labels.payment;
    document.querySelectorAll(".form-label")[7].textContent = tt.labels.transport;
    document.querySelector('label[for="transportOther"]').textContent =
      tt.labels.otherTransport;
    document.querySelector('label[for="carNumber"]').textContent =
      tt.labels.carNumber;

    // Placeholder
    document.getElementById("graduationYear").placeholder = tt.placeholders.year;
    document.getElementById("major").placeholder = tt.placeholders.major;
    document.getElementById("email").placeholder = tt.placeholders.email;
    document.getElementById("phone").placeholder = tt.placeholders.phone;
    document.getElementById("carNumber").placeholder = tt.placeholders.car;
    document.getElementById("transportOther").placeholder = tt.placeholders.other;

    // 연령대
    const ageLabels = document.querySelectorAll('input[name="ageGroup"] + label');
    ageLabels.forEach((l, i) => (l.textContent = tt.ageOptions[i]));

    // 교통수단
    const transportLabels = document.querySelectorAll('input[name="transport"] + label');
    transportLabels.forEach((l, i) => (l.textContent = tt.transportOptions[i]));

    // 입금 확인
    document.querySelector('label[for="paidYes"]').textContent = tt.paymentRadio;

    // 복사 버튼
    const copyBtn = document.getElementById("copyAccountBtn");
    copyBtn.textContent = tt.copy;

    // 계좌 라벨
    document.querySelector("#bankAccountText strong").textContent = tt.bankLabel;

    // 주차 문구
    document.querySelectorAll(".form-hint").forEach((h) => {
      if (h.textContent.includes("주차")) h.textContent = tt.parkingHint;
    });
  }
}
