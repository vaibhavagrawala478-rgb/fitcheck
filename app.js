/* FitCheck — photograph an area, border it, check if an object fits. */

// ---------- Object footprint database (width x depth x height, cm) ----------
const OBJECTS = [
  { name: "laptop 13-inch",   w: 30.4, d: 21.2, h: 1.6,  alias: ["macbook air", "laptop", "macbook", "notebook computer"] },
  { name: "laptop 15-inch",   w: 35.7, d: 24.5, h: 1.7,  alias: ["15 inch laptop"] },
  { name: "laptop 17-inch",   w: 39.9, d: 26.8, h: 2.0,  alias: ["17 inch laptop"] },
  { name: "tablet",           w: 24.8, d: 17.9, h: 0.6,  alias: ["ipad"] },
  { name: "phone",            w: 15.0, d: 7.5,  h: 0.8,  alias: ["iphone", "smartphone", "cell phone", "mobile"] },
  { name: "keyboard",         w: 45.0, d: 15.0, h: 2.5,  alias: ["computer keyboard"] },
  { name: "mouse",            w: 11.0, d: 6.5,  h: 4.0,  alias: ["computer mouse"] },
  { name: "monitor 24-inch",  w: 54.0, d: 20.0, h: 42.0, alias: ["monitor", "screen", "display"] },
  { name: "monitor 27-inch",  w: 61.0, d: 22.0, h: 46.0, alias: ["27 inch monitor"] },
  { name: "textbook",         w: 28.0, d: 22.0, h: 4.0,  alias: ["book", "school book"] },
  { name: "notebook A4",      w: 29.7, d: 21.0, h: 1.0,  alias: ["notebook", "a4", "a4 paper", "binder"] },
  { name: "letter paper",     w: 27.9, d: 21.6, h: 0.1,  alias: ["paper", "sheet of paper"] },
  { name: "novel",            w: 21.0, d: 14.0, h: 3.0,  alias: ["paperback", "small book"] },
  { name: "water bottle",     w: 7.0,  d: 7.0,  h: 23.0, alias: ["bottle", "drink bottle"] },
  { name: "mug",              w: 9.0,  d: 9.0,  h: 9.5,  alias: ["cup", "coffee mug", "coffee cup"] },
  { name: "soda can",         w: 6.6,  d: 6.6,  h: 12.2, alias: ["can", "coke can"] },
  { name: "cereal box",       w: 30.0, d: 8.0,  h: 30.0, alias: [] },
  { name: "pizza box (large)",w: 45.0, d: 45.0, h: 5.0,  alias: ["pizza", "pizza box"] },
  { name: "dinner plate",     w: 27.0, d: 27.0, h: 2.5,  alias: ["plate"] },
  { name: "backpack",         w: 32.0, d: 25.0, h: 45.0, alias: ["bag", "school bag", "rucksack"] },
  { name: "handbag",          w: 30.0, d: 15.0, h: 25.0, alias: ["purse", "tote"] },
  { name: "shoebox",          w: 33.0, d: 22.0, h: 13.0, alias: ["shoe box"] },
  { name: "sneaker (one)",    w: 30.0, d: 11.0, h: 12.0, alias: ["shoe", "sneaker", "trainer"] },
  { name: "pair of shoes",    w: 30.0, d: 22.0, h: 12.0, alias: ["shoes"] },
  { name: "microwave",        w: 50.0, d: 35.0, h: 30.0, alias: ["microwave oven"] },
  { name: "toaster",          w: 30.0, d: 18.0, h: 20.0, alias: [] },
  { name: "kettle",           w: 20.0, d: 15.0, h: 24.0, alias: ["electric kettle"] },
  { name: "printer",          w: 42.0, d: 35.0, h: 20.0, alias: [] },
  { name: "desk lamp",        w: 18.0, d: 18.0, h: 40.0, alias: ["lamp"] },
  { name: "plant pot",        w: 15.0, d: 15.0, h: 20.0, alias: ["plant", "flower pot", "pot"] },
  { name: "tissue box",       w: 23.0, d: 12.0, h: 8.0,  alias: ["tissues"] },
  { name: "game console",     w: 30.0, d: 26.0, h: 8.0,  alias: ["ps5", "xbox", "playstation", "console"] },
  { name: "board game box",   w: 40.0, d: 30.0, h: 8.0,  alias: ["game box"] },
  { name: "skateboard",       w: 80.0, d: 21.0, h: 10.0, alias: [] },
  { name: "guitar",           w: 100.0,d: 38.0, h: 12.0, alias: ["acoustic guitar"] },
  { name: "pillow",           w: 60.0, d: 40.0, h: 18.0, alias: ["cushion"] },
  { name: "folded blanket",   w: 40.0, d: 30.0, h: 15.0, alias: ["blanket"] },
  { name: "laundry basket",   w: 55.0, d: 40.0, h: 25.0, alias: ["basket", "hamper"] },
  { name: "desk chair",       w: 55.0, d: 55.0, h: 90.0, alias: ["chair", "office chair"] },
  { name: "stool",            w: 35.0, d: 35.0, h: 45.0, alias: [] },
  { name: "suitcase (carry)", w: 55.0, d: 35.0, h: 23.0, alias: ["luggage", "suitcase"] },
  { name: "helmet",           w: 28.0, d: 24.0, h: 18.0, alias: ["bike helmet"] },
  { name: "basketball",       w: 24.0, d: 24.0, h: 24.0, alias: ["ball"] },
  { name: "soccer ball",      w: 22.0, d: 22.0, h: 22.0, alias: ["football"] },
  { name: "wristwatch",       w: 4.5,  d: 4.5,  h: 1.2,  alias: ["watch"] },
  { name: "headphones",       w: 18.0, d: 16.0, h: 9.0,  alias: ["headset", "earphones"] },
  { name: "camera",           w: 14.0, d: 10.0, h: 10.0, alias: ["dslr"] },
  { name: "credit card",      w: 8.6,  d: 5.4,  h: 0.1,  alias: ["card", "id card"] },
  { name: "pencil case",      w: 22.0, d: 8.0,  h: 5.0,  alias: ["pencil box"] },
  { name: "stapler",          w: 15.0, d: 5.0,  h: 6.0,  alias: [] },
];

const IN_TO_CM = 2.54;
const GRID_MAX = 240;          // longest side of analysis grid (cells)
const ROT_STEP = 15;           // degrees between tested rotations

// ---------- DOM ----------
const $ = (id) => document.getElementById(id);
const canvas = $("canvas");
const ctx = canvas.getContext("2d");
const video = $("camVideo");

// ---------- State ----------
let img = null;                // captured Image
let polygon = [];              // [{x,y}] in image coords
let polyClosed = false;
let drawing = false;
let drawMode = "trace";        // 'trace' | 'points'
let pxPerCmX = 0, pxPerCmY = 0;
let placement = null;          // last found fit (image coords)
let camStream = null;

// ---------- Photo input ----------
$("fileInput").addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => loadPhoto(r.result);
  r.readAsDataURL(f);
});

$("btnCamera").addEventListener("click", async () => {
  try {
    camStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }, audio: false,
    });
    video.srcObject = camStream;
    $("cameraBox").classList.remove("hidden");
  } catch (err) {
    $("camHint").textContent = "Camera unavailable (" + err.name + "). Use Upload photo instead.";
    $("cameraBox").classList.remove("hidden");
  }
});

$("btnSnap").addEventListener("click", () => {
  if (!camStream) return;
  const c = document.createElement("canvas");
  c.width = video.videoWidth;
  c.height = video.videoHeight;
  c.getContext("2d").drawImage(video, 0, 0);
  stopCamera();
  loadPhoto(c.toDataURL("image/jpeg", 0.92));
});

$("btnCamCancel").addEventListener("click", stopCamera);

function stopCamera() {
  if (camStream) camStream.getTracks().forEach((t) => t.stop());
  camStream = null;
  $("cameraBox").classList.add("hidden");
}

function loadPhoto(src) {
  const im = new Image();
  im.onload = () => {
    img = im;
    canvas.width = im.naturalWidth;
    canvas.height = im.naturalHeight;
    resetAll();
    unlock("step2");
    redraw();
  };
  im.src = src;
}

function resetAll() {
  polygon = [];
  polyClosed = false;
  placement = null;
  pxPerCmX = pxPerCmY = 0;
  $("scaleInfo").textContent = "";
  $("result").className = "result-empty";
  $("result").textContent = "Draw an area and check an object to see the verdict.";
  lock("step3"); lock("step4");
}
function unlock(id) { $(id).classList.remove("locked"); }
function lock(id)   { $(id).classList.add("locked"); }

// ---------- Drawing ----------
$("modeTrace").addEventListener("click", () => setMode("trace"));
$("modePoints").addEventListener("click", () => setMode("points"));

function setMode(m) {
  drawMode = m;
  $("modeTrace").classList.toggle("active", m === "trace");
  $("modePoints").classList.toggle("active", m === "points");
  $("drawHint").textContent = m === "trace"
    ? "Drag on the photo to trace the area's edge. Release to close the shape."
    : "Click each corner of the area (3+ points). Click the first point again, or double-click, to close.";
  polygon = []; polyClosed = false; placement = null;
  redraw();
}

function evPos(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (canvas.width / r.width),
    y: (e.clientY - r.top) * (canvas.height / r.height),
  };
}

canvas.addEventListener("pointerdown", (e) => {
  if (!img) return;
  e.preventDefault();
  const p = evPos(e);
  if (drawMode === "trace") {
    if (polyClosed) { polygon = []; polyClosed = false; placement = null; }
    drawing = true;
    polygon = [p];
  } else {
    if (polyClosed) return;
    if (polygon.length >= 3 && dist(p, polygon[0]) < canvas.width * 0.02 + 12) {
      polyClosed = true;
    } else {
      polygon.push(p);
    }
    redraw();
  }
});

canvas.addEventListener("pointermove", (e) => {
  if (!drawing || drawMode !== "trace") return;
  const p = evPos(e);
  const last = polygon[polygon.length - 1];
  if (!last || dist(p, last) > canvas.width * 0.004) {
    polygon.push(p);
    redraw();
  }
});

canvas.addEventListener("pointerup", () => {
  if (!drawing) return;
  drawing = false;
  if (polygon.length < 8) { polygon = []; }
  else { polyClosed = true; onPolygonDone(); }
  redraw();
});

canvas.addEventListener("dblclick", () => {
  if (drawMode === "points" && polygon.length >= 3 && !polyClosed) {
    polyClosed = true;
    onPolygonDone();
    redraw();
  }
});

$("btnUndo").addEventListener("click", () => {
  if (drawMode === "points" && polygon.length) {
    polygon.pop(); polyClosed = false; placement = null;
    redraw();
  } else if (drawMode === "trace") {
    polygon = []; polyClosed = false; placement = null;
    redraw();
  }
});

$("btnClear").addEventListener("click", () => {
  polygon = []; polyClosed = false; placement = null;
  lock("step3"); lock("step4");
  redraw();
});

function onPolygonDone() {
  unlock("step3");
}

function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

function redraw() {
  if (!img) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
  ctx.drawImage(img, 0, 0);

  if (polygon.length) {
    const u = canvas.width / 500; // stroke width unit
    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);
    for (const p of polygon) ctx.lineTo(p.x, p.y);
    if (polyClosed) ctx.closePath();
    ctx.fillStyle = "rgba(79,140,255,0.20)";
    ctx.fill();
    ctx.lineWidth = 2.5 * u;
    ctx.strokeStyle = "#4f8cff";
    ctx.stroke();

    if (drawMode === "points" && !polyClosed) {
      for (const p of polygon) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5 * u, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#4f8cff";
        ctx.lineWidth = 2 * u;
        ctx.stroke();
      }
    }
  }

  if (placement) {
    const { cx, cy, w, h, rot } = placement;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.rect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = "rgba(52,199,89,0.30)";
    ctx.fill();
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = canvas.width / 300;
    ctx.strokeStyle = "#34c759";
    ctx.stroke();
    ctx.restore();
  }
}

// ---------- Scale ----------
$("btnScale").addEventListener("click", () => {
  if (!polyClosed) return;
  const unit = $("unit").value;
  const wIn = parseFloat($("realW").value);
  const hIn = parseFloat($("realH").value);
  if (!wIn || wIn <= 0) { $("scaleInfo").textContent = "Enter at least the real width."; return; }

  const wCm = unit === "in" ? wIn * IN_TO_CM : wIn;
  const hCm = hIn ? (unit === "in" ? hIn * IN_TO_CM : hIn) : null;

  const bb = polyBBox(polygon);
  if (bb.w < 2 || bb.h < 2) { $("scaleInfo").textContent = "Drawn area is too small — draw a bigger border."; return; }
  pxPerCmX = bb.w / wCm;
  pxPerCmY = hCm ? bb.h / hCm : pxPerCmX;

  $("scaleInfo").textContent =
    `Area ≈ ${wCm.toFixed(1)} cm wide` + (hCm ? ` × ${hCm.toFixed(1)} cm tall` : "") +
    ` (${regionAreaCm2().toFixed(0)} cm² inside your border).`;
  unlock("step4");
  placement = null;
  redraw();
});

function polyBBox(poly) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poly) {
    x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y);
    x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

function regionAreaCm2() {
  let a = 0;
  for (let i = 0; i < polygon.length; i++) {
    const p = polygon[i], q = polygon[(i + 1) % polygon.length];
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a / 2) / (pxPerCmX * pxPerCmY);
}

// ---------- Object lookup ----------
const objList = $("objList");
for (const o of OBJECTS) {
  const opt = document.createElement("option");
  opt.value = o.name;
  objList.appendChild(opt);
}

function findObject(name) {
  const n = name.trim().toLowerCase();
  if (!n) return null;
  for (const o of OBJECTS) {
    if (o.name.toLowerCase() === n) return o;
    if (o.alias.some((a) => a === n)) return o;
  }
  for (const o of OBJECTS) {
    if (o.name.toLowerCase().includes(n) || n.includes(o.name.toLowerCase())) return o;
    if (o.alias.some((a) => a.includes(n) || n.includes(a))) return o;
  }
  return null;
}

$("objName").addEventListener("input", () => {
  const hit = findObject($("objName").value);
  $("customDims").classList.toggle("hidden", !!hit || !$("objName").value.trim());
});

// ---------- Speech input ----------
$("btnMic").addEventListener("click", () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { $("objName").placeholder = "Speech not supported — type it instead"; return; }
  const rec = new SR();
  rec.lang = "en-US";
  rec.interimResults = false;
  $("btnMic").textContent = "…";
  rec.onresult = (e) => {
    $("objName").value = e.results[0][0].transcript;
    $("objName").dispatchEvent(new Event("input"));
  };
  rec.onend = () => { $("btnMic").innerHTML = "&#127908;"; };
  rec.onerror = () => { $("btnMic").innerHTML = "&#127908;"; };
  rec.start();
});

function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.05;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (_) { /* silent */ }
}

// ---------- Fit check ----------
$("btnCheck").addEventListener("click", () => {
  if (!polyClosed || polygon.length < 3) { say("Draw and close a border on the photo first.", "warn"); return; }
  if (!pxPerCmX) { say("Set the real size in step 3 first.", "warn"); return; }

  let obj = findObject($("objName").value);
  let label = obj ? obj.name : $("objName").value.trim() || "object";

  if (!obj) {
    $("customDims").classList.remove("hidden");
    const w = parseFloat($("custW").value), d = parseFloat($("custD").value);
    if (!w || !d || w <= 0 || d <= 0) {
      say(`I don't know "${label}" yet — enter its width and depth below.`, "warn");
      return;
    }
    const k = $("custUnit").value === "in" ? IN_TO_CM : 1;
    obj = { name: label, w: w * k, d: d * k };
  }

  const fit = findFit(obj.w * pxPerCmX, obj.d * pxPerCmY);
  placement = fit ? fit.placement : null;
  redraw();
  report(obj, label, fit);
});

function report(obj, label, fit) {
  const objArea = obj.w * obj.d;
  const regArea = regionAreaCm2();
  const pct = Math.round((objArea / regArea) * 100);
  const el = $("result");

  if (fit) {
    const tight = pct > 55 || fit.marginPx < canvas.width * 0.01;
    const cls = tight ? "warn" : "good";
    const word = tight ? `Fits, but it's tight` : `Yes, it fits`;
    el.className = "";
    el.innerHTML =
      `<div class="verdict ${cls}">${tight ? "⚠" : "✓"} ${word}</div>` +
      `<div class="result-details"><b>${label}</b> — footprint ${obj.w}×${obj.d} cm` +
      (obj.h ? `, ~${obj.h} cm tall` : "") +
      ` — uses ~${pct}% of your area. Green box shows one spot it fits.</div>`;
    speak(tight ? `${label} fits, but it's tight.` : `Yes, the ${label} fits.`);
  } else {
    el.className = "";
    el.innerHTML =
      `<div class="verdict bad">✗ Doesn't fit</div>` +
      `<div class="result-details"><b>${label}</b> — footprint ${obj.w}×${obj.d} cm` +
      (obj.h ? `, ~${obj.h} cm tall` : "") +
      ` — needs ~${objArea.toFixed(0)} cm², your area holds ~${regArea.toFixed(0)} cm² but the shape can't take it. Try a bigger gap.</div>`;
    speak(`No, the ${label} doesn't fit.`);
  }
}

function say(msg, cls) {
  const el = $("result");
  el.className = "";
  el.innerHTML = `<div class="verdict ${cls}">${msg}</div>`;
}

// Rasterize polygon, then try the object's footprint at several rotations.
function findFit(objWpx, objHpx) {
  const bb = polyBBox(polygon);
  const scale = Math.min(GRID_MAX / bb.w, GRID_MAX / bb.h, 1);
  const gw = Math.max(8, Math.round(bb.w * scale));
  const gh = Math.max(8, Math.round(bb.h * scale));
  const cw = bb.w / gw, ch = bb.h / gh;   // image px per cell

  // 1) inside-mask
  const mask = new Uint8Array(gw * gh);
  for (let y = 0; y < gh; y++)
    for (let x = 0; x < gw; x++)
      if (inPoly(bb.x + (x + 0.5) * cw, bb.y + (y + 0.5) * ch)) mask[y * gw + x] = 1;

  // 2) chamfer distance transform (approx, in cells) → clearance at each cell
  const D = chamfer(mask, gw, gh);

  // 3) try rotations
  for (let deg = 0; deg < 180; deg += ROT_STEP) {
    const rot = (deg * Math.PI) / 180;
    const cos = Math.cos(rot), sin = Math.sin(rot);
    // rotated footprint extent in cells
    const fw = Math.abs(objWpx * cos) + Math.abs(objHpx * sin);
    const fh = Math.abs(objWpx * sin) + Math.abs(objHpx * cos);
    const rw = fw / cw, rh = fh / ch;
    if (rw > gw || rh > gh) continue;
    const need = Math.min(objWpx / cw, objHpx / ch) / 2; // min half-extent (cells)

    const step = Math.max(1, Math.floor(Math.min(rw, rh) / 5));
    for (let cy = rh / 2; cy <= gh - rh / 2; cy += step) {
      for (let cx = rw / 2; cx <= gw - rw / 2; cx += step) {
        const gi = Math.min(gh - 1, Math.round(cy)) * gw + Math.min(gw - 1, Math.round(cx));
        if (D[gi] < need) continue; // quick reject
        if (!rotRectInside(mask, gw, gh, cx, cy, objWpx / cw, objHpx / ch, cos, sin)) continue;
        return {
          placement: {
            cx: bb.x + cx * cw, cy: bb.y + cy * ch,
            w: objWpx, h: objHpx, rot,
          },
          marginPx: (D[gi] - need) * cw,
        };
      }
    }
  }
  return null;
}

// Is the rotated rect (center cx,cy, half-size w×h cells, cos/sin) fully inside mask?
// Tests the cells it covers — exact enough at our grid resolution.
function rotRectInside(mask, gw, gh, cx, cy, w, h, cos, sin) {
  const hw = w / 2, hh = h / 2;
  const bx = Math.abs(hw * cos) + Math.abs(hh * sin);
  const by = Math.abs(hw * sin) + Math.abs(hh * cos);
  const x0 = Math.max(0, Math.floor(cx - bx)), x1 = Math.min(gw - 1, Math.ceil(cx + bx));
  const y0 = Math.max(0, Math.floor(cy - by)), y1 = Math.min(gh - 1, Math.ceil(cy + by));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      // cell center in rect's local frame
      const lx = (x + 0.5 - cx) * cos + (y + 0.5 - cy) * sin;
      const ly = -(x + 0.5 - cx) * sin + (y + 0.5 - cy) * cos;
      if (Math.abs(lx) <= hw && Math.abs(ly) <= hh && !mask[y * gw + x]) return false;
    }
  }
  return true;
}

function chamfer(mask, w, h) {
  const INF = 1e9;
  const D = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) D[i] = mask[i] ? INF : 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (x > 0) D[i] = Math.min(D[i], D[i - 1] + 1);
      if (y > 0) {
        D[i] = Math.min(D[i], D[i - w] + 1);
        if (x > 0) D[i] = Math.min(D[i], D[i - w - 1] + 1.414);
        if (x < w - 1) D[i] = Math.min(D[i], D[i - w + 1] + 1.414);
      }
    }
  for (let y = h - 1; y >= 0; y--)
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      if (x < w - 1) D[i] = Math.min(D[i], D[i + 1] + 1);
      if (y < h - 1) {
        D[i] = Math.min(D[i], D[i + w] + 1);
        if (x < w - 1) D[i] = Math.min(D[i], D[i + w + 1] + 1.414);
        if (x > 0) D[i] = Math.min(D[i], D[i + w - 1] + 1.414);
      }
    }
  return D;
}

function inPoly(x, y) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j];
    if ((a.y > y) !== (b.y > y) &&
        x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
