
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
        favoriteNumber.textContent = result.data.comments;
        usersNumber.textContent = result.data.users;
        moviesNumber.textContent = result.data.movies;
        commentsNumber.textContent = result.data.comments;
        categoriesNumber.textContent = result.data.categories;
        actorsNumber.textContent = result.data.actors;
        contactsNumber.textContent = result.data.contacts;
    }
    catch (error) {
        console.error(error);

    }
}
getDashboardStats();