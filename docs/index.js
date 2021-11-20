const API = "https://schlachthof-wolken.eu.ngrok.io/images/";
// const API = "http://10.0.0.3:8080/images/";

let IMAGES = [];

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

function setBackground(url) {
  document.body.style.backgroundImage = `url('${url}')`;
}

let BLOCKED = false;
function canvasUpdate(index) {
  const image = IMAGES[index];

  const url = API + image;
  shadowCanvasUpdate(url);
  if (BLOCKED) {
    return;
  }
  BLOCKED = true;
  mainCanvasUpdate(url);
  document.querySelector("div").innerText = index;
  document.querySelector("span").innerText = image;
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
    BLOCKED = false;
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
};

let touchOffset = 0;
let touchStart = 0;
if ("ontouchstart" in window) {
  bodyEl.addEventListener("touchstart", function (e) {
    var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];

    touchStart = Math.max(0, touch.pageY);
  });

  bodyEl.addEventListener("touchmove", function (e) {
    // if (BLOCKED) {
    //   return;
    // }
    var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];

    const touchMove = touch.pageY;
    const touchDelta = touchMove - touchStart;

    const touchIndex = Math.min(
      Math.max(0, touchDelta + touchOffset),
      IMAGES.length
    );
    updateCycle(touchIndex);

    // document.querySelector(
    //   "span"
    // ).innerText = `Start: ${touchStart}, Move: ${touchMove}, Delta: ${touchDelta}, Offset: ${touchOffset}, Index: ${touchIndex}`;
  });

  bodyEl.addEventListener("touchend", function (e) {
    var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];

    const touchMove = touch.pageY;
    const touchDelta = touchMove - touchStart;

    touchOffset = Math.min(
      Math.max(0, touchDelta + touchOffset),
      IMAGES.length
    );
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
