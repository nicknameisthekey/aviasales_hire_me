// "Открыть струю креатива": a WordArt button above the resume that swaps the
// photo to pic.png, makes it dance and rains cats (cats/cat1.png … catN.png).
// Clicking again turns it all back off.
(() => {
  const CAT_COUNT = 25;
  const MAX_ON_SCREEN = 30;
  const SPAWN_EVERY_MS = 250;
  const LABEL_ON = "Открыть струю креатива";
  const LABEL_OFF = "Закрыть струю креатива";
  const NORMAL_PHOTO = "pic.jpg";
  const CREATIVE_PHOTO = "pic.png";

  const rand = (min, max) => min + Math.random() * (max - min);
  const cats = Array.from({ length: CAT_COUNT }, (_, i) => `cats/cat${i + 1}.png`);

  const CSS = `
    @media print { .wordart, [data-cats] { display: none !important; } }

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

    let timer = null;
    let warmed = false;

    button.addEventListener("click", () => {
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
      }
    });
  });
})();
