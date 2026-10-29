(() => {
  const CAT_COUNT = 25;
  const MAX_ON_SCREEN = 30;
  const SPAWN_EVERY_MS = 250;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rand = (min, max) => min + Math.random() * (max - min);
  const cats = Array.from({ length: CAT_COUNT }, (_, i) => `cats/cat${i + 1}.png`);

  // Warm the cache so cats don't pop in half-loaded.
  cats.forEach((src) => (new Image().src = src));

  function spawn(layer) {
    if (layer.childElementCount >= MAX_ON_SCREEN) return;

    const size = rand(80, 130);
    const img = document.createElement("img");
    img.src = cats[Math.floor(Math.random() * cats.length)];
    img.alt = "";
    img.style.cssText =
      `position:absolute;top:0;left:${rand(0, 100)}vw;width:${size}px;height:${size}px;` +
      "margin-left:-" + size / 2 + "px;will-change:transform;";
    layer.appendChild(img);

    img.animate(
      [
        { transform: `translateY(-${size}px)` },
        { transform: `translateY(calc(100vh + ${size}px))` },
      ],
      { duration: rand(4000, 9000), easing: "linear" }
    ).onfinish = () => img.remove();
  }

  addEventListener("DOMContentLoaded", () => {
    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText =
      "position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:9999;";
    document.body.appendChild(layer);

    const style = document.createElement("style");
    style.textContent = "@media print { [data-cats] { display: none !important; } }";
    layer.dataset.cats = "";
    document.head.appendChild(style);

    setInterval(() => !document.hidden && spawn(layer), SPAWN_EVERY_MS);
  });
})();
