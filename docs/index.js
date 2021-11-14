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
  const image = IMAGES[index];
  document.querySelector("div").innerText = index;
  // document.querySelector("span").innerText = image;

  const url = API + image;
  canvasUpdate(url);
}

function setBackground(url) {
  document.body.style.backgroundImage = `url('${url}')`;
}

function canvasUpdate(url) {
  var canvas = document.getElementById("my_canvas_id");
  var ctx = canvas.getContext("2d", 0, 0, canvas.width, canvas.height);
  var img = new Image();
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height); // Or at whatever offset you like
  };
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
  event.preventDefault();
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
