// =========================================================
// Iowa Club Korea 2025 - Main Script (Full + Multilingual)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const openMapBtn = document.getElementById("openMapBtn");
  openMapBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openMap();
  });

  const form = document.getElementById("rsvp-form");
  form?.addEventListener("submit", submitRSVP);

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
    } catch {
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

  setTransportFields("");
  initLanguageSwitcher();
});

// =========================================================
// 교통수단 선택 시 입력칸 토글
// =========================================================
function setTransportFields(value) {
  const carGroup = document.getElementById("carNumberGroup");
  const otherGroup = document.getElementById("otherTransportGroup");
  if (!carGroup || !otherGroup) return;

  carGroup.classList.add("hidden");
  otherGroup.classList.add("hidden");

  if (value === "자차" || value === "Car") carGroup.classList.remove("hidden");
  else if (value === "기타" || value === "Other")
    otherGroup.classList.remove("hidden");
}

document.addEventListener("change", (e) => {
  if (e.target && e.target.name === "transport") {
    setTransportFields(e.target.value);
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

  if (formData.get("transport") === "자차" && !formData.get("carNumber")) {
    alert("자차 이용 시 차량번호를 입력해 주세요.");
    return;
  }

  if (formData.get("transport") === "기타" && !formData.get("transportOther")) {
    alert("기타 교통수단을 입력해 주세요.");
    return;
  }

  if (formData.get("payment") !== "입금 완료") {
    alert("참가비 입금 후 '입금 완료'를 선택해 주세요.");
    return;
  }

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
      setTransportFields("");
      const msg = document.getElementById("successMessage");
      msg?.classList.add("show");
      setTimeout(() => msg?.classList.remove("show"), 3000);
    })
    .catch((err) => {
      console.error("RSVP Error:", err);
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    });
}

// =========================================================
// 언어 전환 (한국어 / 영어)
// =========================================================
function initLanguageSwitcher() {
  const translations = {
    ko: {
      invitation: `<p><strong>Hawkeyes: Past, Present, and Future</strong></p>
        <br/>
        <p>한 해를 돌아보며, 함께 웃고 추억하는 시간.</p>
        <br/>
        <p>Hawkeyes 동문들과 함께하는 이 밤이 올해의 가장 따뜻한 순간이 되길 바라며 여러분을 초대합니다.</p>
        <br/>
        <p style="text-align:right;font-weight:600;">Iowa Club Korea</p>`,
      eventInfo: "📅 행사 정보",
      date: "일시",
      location: "장소",
      address: "주소",
      fee: "회비",
      contact: "문의",
      rsvp: "📋 참석 신청",
      eventDetails: {
        date: "2025년 12월 12일 (금) 오후 6시 30분 ~ 9시 30분",
        location: `여의도 파크원 타워2 스위치22
          <div class="event-info-note">
            타워2 1층 저층부 엘리베이터 앞 아이오와 동문회 행사 진행원의 안내를 받아 입장 (지하 1층은 입장 불가)
          </div>`,
        address: "서울특별시 영등포구 여의대로 108 파크원 타워2 22층",
        fee: "1인 50,000원",
        contact: `이환석 (<a href="tel:01089674981">010-8967-4981</a>)<br/>
                  문정호 (<a href="tel:01026786495">010-2678-6495</a>)`
      }
    },
    en: {
      invitation: `<p><strong>Hawkeyes: Past, Present, and Future</strong></p>
        <br/>
        <p>A time to look back on the past, laugh, and reminisce together.</p>
        <br/>
        <p>We hope that this night with fellow Hawkeyes will be the warmest moment of the year.</p>
        <br/>
        <p>We cordially invite you to join us.</p>
        <br/>
        <p style="text-align:right;font-weight:600;">Iowa Club Korea</p>`,
      eventInfo: "📅 Event Information",
      date: "Date & Time",
      location: "Venue",
      address: "Address",
      fee: "Fee",
      contact: "Contact",
      rsvp: "📋 RSVP",
      eventDetails: {
        date: "Dec 12, 2025 (Fri), 6:30–9:30 PM",
        location: `Switch22, Tower 2, Parc.1, Yeouido
          <div class="event-info-note">
            Please follow the Iowa Club staff’s guidance at the Tower 2 ground-floor elevator lobby. (B1 floor entry not allowed)
          </div>`,
        address: "22F, Tower 2, Parc.1, 108 Yeoui-daero, Yeongdeungpo-gu, Seoul",
        fee: "₩50,000 per person",
        contact: `Hwanseok Lee (<a href="tel:01089674981">010-8967-4981</a>)<br/>
                  Jungho Moon (<a href="tel:01026786495">010-2678-6495</a>)`
      }
    }
  };

  const btns = document.querySelectorAll(".lang-btn");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      setLanguage(btn.dataset.lang);
    });
  });

  function setLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    document.getElementById("invitationText").innerHTML = t.invitation;
    document.querySelector(".event-info h2").textContent = t.eventInfo;
    document.querySelector(".rsvp-section h2").textContent = t.rsvp;

    const items = document.querySelectorAll(".event-info .info-item");
    const values = document.querySelectorAll(".event-info .info-value");
    if (items.length >= 5 && values.length >= 5) {
      items[0].querySelector(".info-label").textContent = t.date;
      items[1].querySelector(".info-label").textContent = t.location;
      items[2].querySelector(".info-label").textContent = t.address;
      items[3].querySelector(".info-label").textContent = t.fee;
      items[4].querySelector(".info-label").textContent = t.contact;

      values[0].innerHTML = t.eventDetails.date;
      values[1].innerHTML = t.eventDetails.location;
      values[2].innerHTML = t.eventDetails.address;
      values[3].innerHTML = t.eventDetails.fee;
      values[4].innerHTML = t.eventDetails.contact;
    }
  }
}
