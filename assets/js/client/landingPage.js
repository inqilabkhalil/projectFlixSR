// ✅ TOGGLE KODU — DƏYİŞMİR (eyni saxlanılıb)
function toggleFaq(element) {
  const answer = element.nextElementSibling;
  const icon = element.querySelector(".faq-icon");

  if (answer.classList.contains("active")) {
    answer.classList.remove("active");
    icon.classList.remove("spin");
  } else {
    answer.classList.add("active");
    icon.classList.add("spin");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // CONTACT
  const fullName = document.getElementById("full-name-input");
  const email = document.getElementById("email-input");
  const reason = document.getElementById("reason-input");
  const btn = document.querySelector(".send-btn");
  const msg = document.getElementById("form-msg");

  const CONTACT_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/contact";

  const showMsg = (text, ok = false) => {
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = ok ? "lime" : "tomato";
  };

  if (btn) {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      const full_name = fullName?.value.trim();
      const emailVal = email?.value.trim();
      const reasonVal = reason?.value.trim();

      if (!full_name || !emailVal || !reasonVal) {
        showMsg("Zəhmət olmasa bütün xanaları doldur.", false);
        return;
      }

      btn.disabled = true;
      showMsg("Göndərilir...", true);

      try {
        const res = await fetch(CONTACT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ full_name, email: emailVal, reason: reasonVal }),
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data?.result) {
          showMsg("Uğurla göndərildi ✅", true);
          fullName.value = "";
          email.value = "";
          reason.value = "";
        } else {
          const errText =
            (data?.message &&
              (typeof data.message === "string"
                ? data.message
                : JSON.stringify(data.message))) ||
            "Xəta baş verdi. Yenidən yoxla.";
          showMsg(errText, false);
        }
      } catch (err) {
        console.error(err);
        showMsg("Şəbəkə xətası. İnterneti yoxla.", false);
      } finally {
        btn.disabled = false;
      }
    });
  }

  // HERO -> REGISTER
  const emailInputHero = document.getElementById("email-input-hero");
  const getStartedBtn = document.getElementById("getStartedButton");

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const emailVal = emailInputHero?.value.trim();
      if (!emailVal) return;

      window.location.href = `./pages/client/register.html?email=${encodeURIComponent(emailVal)}`;
    });
  }
});