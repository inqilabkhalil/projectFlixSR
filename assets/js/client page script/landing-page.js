

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
