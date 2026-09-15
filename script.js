const canvas = document.querySelector("#grain");
const ctx = canvas.getContext("2d", { alpha: true });
let frame = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
}

function drawGrain() {
  frame += 1;
  if (frame % 2 === 0) {
    requestAnimationFrame(drawGrain);
    return;
  }

  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.random() * 255;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 16;
  }

  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(drawGrain);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

const navLinks = document.querySelectorAll('nav a[href^="#"]');
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));
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
    if (!response.ok) throw new Error(data.error || "Checkout failed.");
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
    const reference = document.querySelector("#pay-reference")?.value?.trim() || "";
    const btn = document.querySelector("#custom-pay-btn");
    openCheckout({ customAmount: amount, reference }, btn);
  });
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawGrain();
