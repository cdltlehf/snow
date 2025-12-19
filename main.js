function main() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const velocityX = 0.001;
  const velocityY = 0.001;
  const minRadius = 2;
  const near = 0.05;
  const far = 0.5;
  const radius = 1.0;
  const minLightness = 0.9;
  const maxLightness = 1.0;

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.filter = "blur(5px)";
  canvas.style.pointerEvents = "none";

  const dpi = globalThis.devicePixelRatio || 1;
  const mouse = { x: 0, y: 0 };

  const resizeCanvas = (entries) => {
    for (entry of entries) {
      const canvas = entry.target;
      if (!canvas) return;
      canvas.width = canvas.clientWidth * dpi;
      canvas.height = canvas.clientHeight * dpi;
    }
  };
  const onMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouse.x = x / rect.width;
    mouse.y = y / rect.height;
  };
  const resizeObserver = new globalThis.ResizeObserver(resizeCanvas);
  resizeObserver.observe(canvas);

  globalThis.document.addEventListener("mousemove", onMouseMove);

  const snowFlakes = [];
  const numSnowFlakes = 100;
  for (let i = 0; i < numSnowFlakes; i++) {
    const x = Math.random();
    const y = Math.random();
    const lightness = Math.random() * (maxLightness - minLightness) +
      minLightness;
    const color = `hsl(0, 0%, ${lightness * 100}%)`;
    const z = Math.random() * (far - near) + near;
    snowFlakes.push({ x, y, z, color });
  }
  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    for (const { x: rawX, y: rawY, z, color } of snowFlakes) {
      const x = rawX * canvas.width;
      const y = rawY * canvas.height;
      const r = radius / z + minRadius;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }
    for (const snowFlake of snowFlakes) {
      snowFlake.y += velocityY / snowFlake.z;
      snowFlake.x += ((mouse.x - 0.5) * velocityX) / snowFlake.z;
      if (snowFlake.y > 1.0) {
        snowFlake.y = 0.0;
        snowFlake.x = Math.random();
      }
      if (snowFlake.x > 1.0) snowFlake.x = 0.0;
      if (snowFlake.x < 0.0) snowFlake.x = 1.0;
    }
    globalThis.requestAnimationFrame(render);
  };
  render();
  document.body.append(canvas);
}

if ("window" in globalThis) {
  if (globalThis.document.readyState === "loading") {
    globalThis.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
}
