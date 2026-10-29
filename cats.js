// "Открыть струю креатива": a WordArt button above the resume that swaps the
// photo to pic.png, makes it dance and rains cats (cats/cat1.png … catN.png).
// Clicking again turns it all back off.
(() => {
  const CAT_COUNT = 25;
  const MAX_ON_SCREEN = 30;
  const SPAWN_EVERY_MS = 250;
  const LABEL_ON = "Открыть струю креатива";
  const LABEL_OFF = "Призакрыть струю креатива";
  const NORMAL_PHOTO = "pic.jpg";
  const CREATIVE_PHOTO = "pic.png";

  // DVD logo (Wikimedia Commons, public domain), inlined so it works from file:// too.
  const DVD_SVG = `<svg fill="currentColor" aria-hidden="true" viewBox="0 0 1058.4 465.84" xmlns="http://www.w3.org/2000/svg"><g><path d="m91.053 0-13.719 57.707 102.28 0.039063h24c65.747 0 105.91 26.44 94.746 73.4-12.147 51.133-69.613 73.4-130.67 73.4h-22.947l29.787-125.45h-102.27l-43.521 183.2h145.05c109.07 0 212.76-57.573 231.01-131.15 3.3467-13.507 2.8806-47.253-5.3594-67.359-0.21299-0.787-0.42594-1.4-1.1855-3-0.293-0.653-0.56012-3.6412 1.1465-4.2812 0.947-0.36 2.7069 1.4944 2.9336 2.041 0.853 2.24 1.5059 3.9062 1.5059 3.9062l92.293 260.6 234.97-265.21 99.535-0.089844h24c65.76 0 106.25 26.44 95.092 73.4-12.147 51.133-69.947 73.4-131 73.4h-22.959l29.799-125.47h-102.27l-43.533 183.21h145.07c109.05 0 213.48-57.4 231-131.15 17.52-73.75-59.107-131.15-168.69-131.15h-216.4s-57.319 67.88-67.959 80.693c-57.12 68.787-67.241 87.226-68.961 91.986 0.24-4.8-1.8138-23.412-26.174-92.959-6.48-18.52-27.359-79.721-27.359-79.721h-389.25zm408.77 324.16c-276.04 0-499.83 31.72-499.83 70.84s223.79 70.84 499.83 70.84c276.04 0 499.83-31.72 499.83-70.84s-223.79-70.84-499.83-70.84zm-18.094 48.627c63.04 0 114.13 10.573 114.13 23.613s-51.095 23.613-114.13 23.613c-63.027 0-114.13-10.573-114.13-23.613s51.106-23.613 114.13-23.613z"/><path d="m963.6 445.05-0.73242 5.1738h13.08l-5.1074 36.32h5.7207l5.1055-36.32h11.68l0.72071-5.1738h-30.467zm41.215 0-13.693 41.494h5.4785l10.215-31.76h0.1328l7.1718 31.76 16.668-31.453h0.1191v31.453h5.4805v-41.494h-5.4805l-14.906 28.107-6.4395-28.107h-4.746z" display="none"/></g></svg>`;

  const rand = (min, max) => min + Math.random() * (max - min);
  const cats = Array.from({ length: CAT_COUNT }, (_, i) => `cats/cat${i + 1}.png`);

  const CSS = `
    @media print { .wordart, .dvd-logo, [data-cats] { display: none !important; } }

    .wordart-bar { display: flex; justify-content: center; margin: -6mm 0 8mm; perspective: 500px; }
    .wordart {
      border: 0; background: none; padding: 0 12px; cursor: pointer;
      font: 900 clamp(20px, 5.6vw, 46px)/1.1 Impact, "Arial Black", "Comic Sans MS", sans-serif;
      letter-spacing: 1px; text-transform: uppercase; white-space: nowrap;
      transform: rotateX(28deg) skewX(-14deg);
      filter: hue-rotate(0deg)
        drop-shadow(1px 1px 0 #3a0057) drop-shadow(1px 1px 0 #3a0057)
        drop-shadow(1px 1px 0 #2a003f) drop-shadow(1px 1px 0 #2a003f)
        drop-shadow(1px 1px 0 #1a0027) drop-shadow(1px 1px 0 #1a0027)
        drop-shadow(4px 6px 3px rgba(80, 0, 0, .7));
      animation: wordart-hue 6s linear infinite, wordart-lurch 3.1s ease-in-out infinite;
    }
    .wordart:hover { animation: wordart-hue .6s linear infinite, wordart-shake .12s linear infinite; }
    .wordart:focus-visible { outline: 3px dashed #c0f; outline-offset: 6px; }
    .wordart span {
      display: inline-block;
      background: linear-gradient(#f00 0%, #f90 22%, #ff0 40%, #0f6 58%, #09f 76%, #c0f 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent;
      -webkit-text-stroke: 1px #200;
      animation: wordart-wave 1.4s ease-in-out infinite;
    }
    .wordart span:nth-child(odd) { animation-duration: 1.9s; }
    .wordart span:nth-child(3n) { animation-name: wordart-twitch; }

    @keyframes wordart-hue { to { filter: hue-rotate(360deg)
        drop-shadow(1px 1px 0 #3a0057) drop-shadow(1px 1px 0 #3a0057)
        drop-shadow(1px 1px 0 #2a003f) drop-shadow(1px 1px 0 #2a003f)
        drop-shadow(1px 1px 0 #1a0027) drop-shadow(1px 1px 0 #1a0027)
        drop-shadow(4px 6px 3px rgba(80, 0, 0, .7)); } }
    @keyframes wordart-lurch {
      0%, 100% { transform: rotateX(28deg) skewX(-14deg) rotate(-2deg); }
      50%      { transform: rotateX(18deg) skewX(10deg) rotate(2deg) scale(1.04, .96); }
    }
    @keyframes wordart-shake {
      0%   { transform: rotateX(28deg) skewX(-14deg) translate(-2px, 1px); }
      50%  { transform: rotateX(28deg) skewX(-14deg) translate(2px, -1px) rotate(1deg); }
      100% { transform: rotateX(28deg) skewX(-14deg) translate(-1px, 2px); }
    }
    @keyframes wordart-wave {
      0%, 100% { transform: translateY(0) scaleY(1); }
      50%      { transform: translateY(-9px) scaleY(1.25) rotate(-6deg); }
    }
    @keyframes wordart-twitch {
      0%, 86%, 100% { transform: none; }
      88% { transform: translate(3px, -6px) rotate(14deg) scale(1.3); }
      92% { transform: translate(-3px, 4px) rotate(-18deg); }
    }

    /* Photo does a squash-and-stretch "press me" bounce, like an old game button. */
    .creative .photo { animation: photo-dance 1s ease-in-out infinite; transform-origin: center bottom; }
    @keyframes photo-dance {
      0%, 100% { transform: scale(1, 1); }
      25%      { transform: scale(1.12, 0.9); }
      50%      { transform: scale(0.92, 1.12); }
      75%      { transform: scale(1.05, 0.97); }
    }

    /* DVD logo that bounces around while the stream is closed; recolours on every wall hit. */
    .wordart.away { visibility: hidden; }
    .dvd-logo {
      position: fixed; z-index: 10000; left: 0; top: 0;
      width: 110px; aspect-ratio: 1058.4 / 465.84;
      pointer-events: none; color: var(--dvd-color, #c0f);
    }
    .dvd-logo svg { display: block; width: 100%; height: 100%; }
    .dvd-logo[hidden] { display: none; }

    @media (prefers-reduced-motion: reduce) {
      .wordart, .wordart span, .wordart:hover { animation: none; }
    }
  `;

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

  function setLabel(button, text) {
    button.setAttribute("aria-label", text);
    button.replaceChildren(
      ...[...text].map((ch) => {
        const span = document.createElement("span");
        span.textContent = ch === " " ? " " : ch;
        span.setAttribute("aria-hidden", "true");
        span.style.animationDelay = `${-Math.random() * 2}s`;
        return span;
      })
    );
  }

  addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    const photo = document.querySelector(".photo");
    const bar = document.createElement("div");
    bar.className = "wordart-bar";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wordart";
    setLabel(button, LABEL_ON);
    bar.appendChild(button);
    document.body.prepend(bar);

    const layer = document.createElement("div");
    layer.dataset.cats = "";
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText =
      "position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:9999;";
    document.body.appendChild(layer);

    const logo = document.createElement("div");
    logo.className = "dvd-logo";
    logo.setAttribute("aria-hidden", "true");
    logo.hidden = true;
    logo.innerHTML = DVD_SVG;
    document.body.appendChild(logo);

    let timer = null;
    let warmed = false;
    let dvd = null; // { x, y, vx, vy, last, raf } while the logo is bouncing

    // Closing the stream replaces the WordArt button with a purely decorative
    // DVD logo bouncing around the viewport; clicks pass straight through it.
    function startDvd() {
      const r = button.getBoundingClientRect();
      button.classList.add("away");
      logo.hidden = false;
      const speed = 220; // px per second on each axis
      dvd = {
        x: r.left + (r.width - logo.offsetWidth) / 2,
        y: r.top + (r.height - logo.offsetHeight) / 2,
        vx: Math.random() < 0.5 ? -speed : speed, vy: speed,
        last: performance.now(), raf: 0,
      };
      const step = (now) => {
        const dt = Math.min((now - dvd.last) / 1000, 0.05);
        dvd.last = now;
        const maxX = innerWidth - logo.offsetWidth;
        const maxY = innerHeight - logo.offsetHeight;
        dvd.x += dvd.vx * dt;
        dvd.y += dvd.vy * dt;
        let hit = false;
        if (dvd.x <= 0 || dvd.x >= maxX) { dvd.vx = dvd.x <= 0 ? Math.abs(dvd.vx) : -Math.abs(dvd.vx); hit = true; }
        if (dvd.y <= 0 || dvd.y >= maxY) { dvd.vy = dvd.y <= 0 ? Math.abs(dvd.vy) : -Math.abs(dvd.vy); hit = true; }
        dvd.x = Math.max(0, Math.min(dvd.x, maxX));
        dvd.y = Math.max(0, Math.min(dvd.y, maxY));
        if (hit) logo.style.setProperty("--dvd-color", `hsl(${Math.floor(rand(0, 360))} 90% 55%)`);
        logo.style.transform = `translate(${dvd.x}px, ${dvd.y}px)`;
        dvd.raf = requestAnimationFrame(step);
      };
      dvd.raf = requestAnimationFrame(step);
    }

    function stopDvd() {
      cancelAnimationFrame(dvd.raf);
      dvd = null;
      logo.hidden = true;
      button.classList.remove("away");
    }

    function toggle() {
      if (dvd) stopDvd();

      const on = document.documentElement.classList.toggle("creative");
      setLabel(button, on ? LABEL_OFF : LABEL_ON);

      if (on) {
        if (!warmed) [CREATIVE_PHOTO, ...cats].forEach((src) => (new Image().src = src));
        warmed = true;
        if (photo) photo.src = CREATIVE_PHOTO;
        timer = setInterval(() => !document.hidden && spawn(layer), SPAWN_EVERY_MS);
      } else {
        if (photo) photo.src = NORMAL_PHOTO;
        clearInterval(timer);
        layer.replaceChildren();
        startDvd();
      }
    }

    button.addEventListener("click", toggle);
  });
})();
