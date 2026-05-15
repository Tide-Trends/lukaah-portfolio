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
    data[i + 3] = 18;
  }

  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(drawGrain);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawGrain();
