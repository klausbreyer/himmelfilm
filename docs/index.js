// const API = "https://schlachthof-wolken.eu.ngrok.io/images/";
// const API = "https://files.v01.io/schlachthof-wolken-nebraska/0,8/";
const API =
  "https://nebraska.schlachthof-wolken.de/www.schlachthof-wolken.de/0,8/";
// const API = "https://files.v01.io/schlachthof-wolken/";
// const API = "http://10.0.0.3:8080/images/";

const TOUCH_FACTOR = 1;

let IMAGES = [];

const PRELOADING_BUFFER = 250;
let preloadedIndex = 0;

function dynamicPreloader(startIndex) {
  const preloadLimit = startIndex + 2 * PRELOADING_BUFFER;

  document.querySelector(
    "span"
  ).innerText = `preloading ${startIndex} ${preloadedIndex} -> ${preloadLimit}`;

  for (preloadedIndex; preloadedIndex < preloadLimit; preloadedIndex++) {
    const image = IMAGES[preloadedIndex];
    const url = API + image;
    shadowCanvasUpdate(url);
  }
}

async function getHtml() {
  const response = await fetch(API);
  return await response.text();
}

function extratHrefs(html) {
  return html
    .match(/href="(.*?)"/g)
    .filter(
      (e) => e.includes(".jpg") || e.includes(".jpeg") || e.includes(".png")
    )
    .map((e) => e.replace('href="', "").replace('"', ""))
    .reverse();
}

function updateCycle(index) {
  canvasUpdate(index);
}

function canvasUpdate(index) {
  const image = IMAGES[index];
  const url = API + image;

  mainCanvasUpdate(url);
  document.querySelector("div").innerText = `${image}: ${index}`;
  // document.querySelector("span").innerText = image;
}

function mainCanvasUpdate(url) {
  var canvas = document.getElementById("main_canvas");
  var ctx = canvas.getContext("2d", 0, 0, canvas.width, canvas.height);
  var img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height); // Or at whatever offset you like

    const colors = canvas
      .getContext("2d")
      .getImageData(window.innerWidth / 2, 0, 1, 1).data;

    updateTheme(colors[0], colors[1], colors[2]);
  };

  img.onload;
  img.src = url;
}

function shadowCanvasUpdate(url) {
  var canvas = document.getElementById("shadow_canvas");
  var ctx = canvas.getContext("2d", 0, 0, canvas.width, canvas.height);
  var img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height); // Or at whatever offset you like
  };

  img.onload;
  img.src = url;
}

async function main() {
  console.log("main");
  const html = await getHtml();
  IMAGES = extratHrefs(html);
  console.dir(IMAGES);
  updateCycle(0);

  dynamicPreloader(0);
}
main();

const bodyEl = document.querySelector("body");

let wheelIndex = 1;
bodyEl.onwheel = function (event) {
  // event.preventDefault();
  wheelIndex += event.deltaY > 1 ? 1 : -1;
  // Restrict scale
  wheelIndex = Math.min(Math.max(0, wheelIndex), IMAGES.length);
  updateCycle(wheelIndex);

  dynamicPreloader(wheelIndex);
};

let touchOffset = 0;
let touchStart = 0;
function calculateTouchIndex(pageY) {
  const touchMove = pageY;
  const touchDelta = touchMove - touchStart;

  const yPixelPosition = Math.max(0, touchDelta + touchOffset);
  // for smoother scrolling, we have a scrolling factor.
  const weightedPosition = Math.round(yPixelPosition * TOUCH_FACTOR);

  const touchIndex = Math.min(
    weightedPosition,
    preloadedIndex - PRELOADING_BUFFER
    // preloaded are 2* preloading buffer. but accesible are only the first part.
  );
  return touchIndex;
}
if ("ontouchstart" in window) {
  bodyEl.addEventListener("touchstart", function (e) {
    var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];

    touchStart = Math.max(0, touch.pageY);
  });

  bodyEl.addEventListener("touchmove", function (e) {
    var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];

    const touchIndex = calculateTouchIndex(touch.pageY);
    updateCycle(touchIndex);
    dynamicPreloader(touchIndex);

    // document.querySelector(
    //   "span"
    // ).innerText = `Start: ${touchStart}, Move: ${touchMove}, Delta: ${touchDelta}, Offset: ${touchOffset}, Index: ${touchIndex}`;
  });

  bodyEl.addEventListener("touchend", function (e) {
    var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];

    const touchIndex = calculateTouchIndex(touch.pageY);
    dynamicPreloader(touchIndex);

    const touchMove = touch.pageY;
    const touchDelta = touchMove - touchStart;
    const yPixelPosition = Math.max(0, touchDelta + touchOffset);

    touchOffset = yPixelPosition;
  });
}

function scaleToPercent(scale) {
  return (scale / window.innerHeight) * 100;
}

function updateTheme(r, g, b) {
  var metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor.setAttribute(
    "content",
    ((r << 16) | (g << 8) | b).toString(16)
  );
}
