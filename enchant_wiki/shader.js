(function () {
  "use strict";

  const hero = document.querySelector(".hero");
  if (!hero || hero.querySelector("canvas.enchant-lattice")) return;

  const canvas = document.createElement("canvas");
  canvas.className = "enchant-lattice";
  canvas.setAttribute("aria-hidden", "true");
  hero.prepend(canvas);

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: true
  });
  if (!gl) {
    hero.classList.add("shader-fallback");
    return;
  }

  const vertexSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform vec2 resolution;
    uniform vec2 pointer;
    uniform float time;

    float line(float value, float width) {
      return 1.0 - smoothstep(0.0, width, abs(value));
    }

    float rune(vec2 p, float scale) {
      p *= scale;
      float ring = line(abs(length(p) - 0.72), 0.025);
      float diamond = line(abs(p.x) + abs(p.y) - 0.55, 0.025);
      float axis = max(line(p.x, 0.013) * step(abs(p.y), 0.9), line(p.y, 0.013) * step(abs(p.x), 0.9));
      return max(ring * 0.7, max(diamond, axis * 0.38));
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
      vec2 mouse = (pointer * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
      float drift = time * 0.045;

      vec2 gridUv = uv * 4.5;
      vec2 cell = abs(fract(gridUv + vec2(drift, -drift * 0.45)) - 0.5);
      float grid = max(line(cell.x - 0.49, 0.012), line(cell.y - 0.49, 0.012));

      vec2 p1 = uv - vec2(0.55 + sin(time * 0.21) * 0.05, 0.03);
      vec2 p2 = uv - vec2(-0.62, -0.24 + cos(time * 0.18) * 0.05);
      vec2 p3 = uv - mouse * 0.08 - vec2(0.0, 0.32);
      float glyphs = rune(p1, 1.3) + rune(p2, 1.7) * 0.65 + rune(p3, 2.2) * 0.42;

      float diagonal = line(fract((uv.x - uv.y) * 1.7 + drift) - 0.5, 0.018) * 0.18;
      float pulse = 0.55 + sin(time * 0.8) * 0.12;
      float focus = exp(-3.0 * dot(uv - mouse * 0.12, uv - mouse * 0.12));

      vec3 graphite = vec3(0.025, 0.034, 0.035);
      vec3 jade = vec3(0.08, 0.78, 0.50);
      vec3 brass = vec3(0.91, 0.66, 0.22);
      vec3 color = graphite;
      color += jade * grid * (0.10 + focus * 0.12);
      color += jade * glyphs * pulse;
      color += brass * diagonal;
      color += brass * glyphs * focus * 0.35;

      float vignette = 1.0 - smoothstep(0.45, 1.45, length(uv));
      color *= 0.62 + vignette * 0.55;
      gl_FragColor = vec4(color, 0.92);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("OmniEnchant wiki shader disabled:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) {
    hero.classList.add("shader-fallback");
    canvas.remove();
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    hero.classList.add("shader-fallback");
    canvas.remove();
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.useProgram(program);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolution = gl.getUniformLocation(program, "resolution");
  const pointerLocation = gl.getUniformLocation(program, "pointer");
  const timeLocation = gl.getUniformLocation(program, "time");
  const pointer = { x: 0.5, y: 0.5 };
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let started = performance.now();

  function resize() {
    const rect = hero.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.floor(rect.width * ratio));
    const height = Math.max(1, Math.floor(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function draw(now) {
    resize();
    gl.useProgram(program);
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform2f(pointerLocation, pointer.x, pointer.y);
    gl.uniform1f(timeLocation, reducedMotion.matches ? 4.0 : (now - started) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.dataset.rendered = "true";
    if (!reducedMotion.matches && !document.hidden) frame = requestAnimationFrame(draw);
  }

  function restart() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(draw);
  }

  hero.addEventListener("pointermove", event => {
    const rect = hero.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = 1 - (event.clientY - rect.top) / rect.height;
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      started = performance.now();
      restart();
    } else {
      cancelAnimationFrame(frame);
    }
  });
  reducedMotion.addEventListener?.("change", restart);
  if (window.ResizeObserver) {
    new ResizeObserver(resize).observe(hero);
  } else {
    addEventListener("resize", resize, { passive: true });
  }
  restart();
}());
