const token = localStorage.getItem("access_token");

const favoriteNumber = document.querySelector(".favorite-number");
const usersNumber = document.querySelector(".users-number");
const moviesNumber = document.querySelector(".movies-number");
const commentsNumber = document.querySelector(".comments-number");
const categoriesNumber = document.querySelector(".categories-number");
const actorsNumber = document.querySelector(".actors-number");
const contactsNumber = document.querySelector(".contacts-number");

async function getDashboardStats() {
  try {
    const url = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/dashboard`;

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, options);
    const result = await response.json();
    const data = result.data;

    // 🔥 duration və digər ayarları bir dəfə təyin edirik
    const counterOptions = {
      duration: 1,
      separator: ",",
      useEasing: true,
    };

    new countUp.CountUp("favorites-count", data.comments || 0, counterOptions).start();
    new countUp.CountUp("users-count", data.users || 0, counterOptions).start();
    new countUp.CountUp("movies-count", data.movies || 0, counterOptions).start();
    new countUp.CountUp("comments-count", data.comments || 0, counterOptions).start();
    new countUp.CountUp("categories-count", data.categories || 0, counterOptions).start();
    new countUp.CountUp("actors-count", data.actors || 0, counterOptions).start();
    new countUp.CountUp("contacts-count", data.contacts || 0, counterOptions).start();

  } catch (error) {
    console.error(error);
  }
}

getDashboardStats();