const photos = JSON.parse(document.getElementById("photo-data").textContent);
const viewer = document.getElementById("photo-viewer");
let currentPhoto = 0;
function displayPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  const photo = photos[currentPhoto];
  const image = document.getElementById("viewer-image");
  image.src = photo.src;
  image.alt = photo.alt;
  document.getElementById("viewer-caption").textContent = photo.caption;
  document.getElementById("original-photo").href = photo.post;
}
document.querySelectorAll("[data-photo]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      !viewer.showModal
    )
      return;
    event.preventDefault();
    displayPhoto(Number(link.dataset.photo));
    viewer.showModal();
  });
});
document
  .getElementById("close-photo")
  .addEventListener("click", () => viewer.close());
document
  .getElementById("previous-photo")
  .addEventListener("click", () => displayPhoto(currentPhoto - 1));
document
  .getElementById("next-photo")
  .addEventListener("click", () => displayPhoto(currentPhoto + 1));
viewer.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    displayPhoto(currentPhoto + 1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    displayPhoto(currentPhoto - 1);
  }
});
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) {
    const rect = viewer.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      viewer.close();
  }
});
let heroIndex = 0;
const shuffle = document.getElementById("shuffle");
shuffle.hidden = false;
shuffle.addEventListener("click", () => {
  heroIndex = (heroIndex + 1) % photos.length;
  const photo = photos[heroIndex];
  const image = document.getElementById("hero-image");
  image.src = photo.src;
  image.alt = photo.alt;
  document.getElementById("hero-caption").textContent = photo.caption;
  const link = document.getElementById("hero-photo-link");
  link.href = photo.src;
  link.dataset.photo = heroIndex;
});
const payDetails = document.getElementById("pay");
function openPaymentSection() {
  if (location.hash === "#pay") payDetails.open = true;
}
window.addEventListener("hashchange", openPaymentSection);
openPaymentSection();
document.querySelectorAll('a[href="#pay"]').forEach((a) =>
  a.addEventListener("click", () => {
    payDetails.open = true;
  }),
);
const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          navLinks.forEach((link) => {
            const active = link.hash === "#" + entry.target.id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
      }),
    { rootMargin: "-15% 0px -55% 0px" },
  );
  navLinks.forEach((a) => {
    const section = document.querySelector(a.hash);
    if (section) observer.observe(section);
  });
}

const statusEl = document.querySelector("#checkout-status");

function setStatus(message, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.toggle("is-error", isError);
}

async function openCheckout(payload, trigger) {
  if (trigger) {
    trigger.disabled = true;
    trigger.classList.add("is-loading");
  }
  setStatus("Opening secure checkout…", false);

  try {
    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        response.status === 503
          ? "Online invoice payments aren’t configured yet. Please use the payment link in your agreement or contact hello@lukaah.com."
          : "Checkout could not be opened. Please try again or contact hello@lukaah.com.",
      );
    window.location.href = data.url;
  } catch (error) {
    setStatus(error.message, true);
    if (trigger) {
      trigger.disabled = false;
      trigger.classList.remove("is-loading");
    }
  }
}

const PRICE_KEYS = {
  STRIPE_PRICE_DISCOVERY: "discovery",
  STRIPE_PRICE_PROJECT: "project",
  STRIPE_PRICE_RETAINER: "retainer",
};

document.querySelectorAll(".checkout-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const priceKey = PRICE_KEYS[button.dataset.priceEnv] || "default";
    openCheckout({ priceKey }, button);
  });
});

const customPayForm = document.querySelector("#custom-pay-form");
if (customPayForm) {
  customPayForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const amount = Number(document.querySelector("#pay-amount")?.value);
    const reference =
      document.querySelector("#pay-reference")?.value?.trim() || "";
    const btn = document.querySelector("#custom-pay-btn");
    openCheckout({ customAmount: amount, reference }, btn);
  });
}
