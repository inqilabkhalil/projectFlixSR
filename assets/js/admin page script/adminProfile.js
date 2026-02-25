const tokenAcces = localStorage.getItem("access_token");

if (tokenAcces) {
  const PROFILE_URL =
    "https://api.sarkhanrahimli.dev/api/filmalisa/profile   ";

  async function loadProfile() {
    try {
      const res = await fetch(PROFILE_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenAcces}`,
        },
      });

      const result = await res.json();
      if (!result.result) return;

      const profile = result.data;

      const adminText = document.querySelector(".admin-text");
      const profileName = document.querySelector(".profileName");
      const profileImg = document.querySelector(".rightHeaderSection img");

      // Name
      if (adminText) {
        adminText.textContent = `Hi ${profile.full_name}`;
      }

      if (profileName) {
        profileName.textContent = profile.full_name;
      }

      // Image
      if (profileImg) {
        const defaultImg = profileImg.src; // mövcud static şəkil

        if (profile.img_url) {
          profileImg.src = profile.img_url;
        } else {
          profileImg.src = defaultImg; // static qalır
        }
      }

    } catch (err) {
      console.error("Profile error:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", loadProfile);
}