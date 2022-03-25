const API = "https://www.himmelfilm.de/0,8/";

let IMAGES = [];
let INDEX = 0;
let LOOPING = true;

async function getHtml() {
  const response = await fetch(API);
  return await response.text();
}

function randomIndex(a) {
  return Math.floor(Math.random() * a.length);
}

function extratHrefs(html) {
  return html
    .match(/href="(.*?)"/g)
    .filter(
      (e) => e.includes(".jpg") || e.includes(".jpeg") || e.includes(".png")
    )
    .map((e) => e.replace('href="', "").replace('"', ""));
}

function updateTheme(r, g, b) {
  var metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor.setAttribute(
    "content",
    ((r << 16) | (g << 8) | b).toString(16)
  );
}

function updateCycle(override) {
  if (!LOOPING) {
    return;
  }

  if (override > 0) {
    INDEX = override;
  } else {
    INDEX++;
  }

  const image = IMAGES[INDEX];
  if (!image) {
    return false;
  }
  const url = API + image;
  console.log(INDEX, url);

  mainCanvasUpdate(url);
  // document.querySelector("div#left").innerText = `${iIMAGES}`;
  document.querySelector("button#info").innerText = `${image}`;
}

function mainCanvasUpdate(url) {
  var canvas = document.getElementById("main_canvas");
  var img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function () {
    var ctx = canvas.getContext("2d", 0, 0, canvas.width, canvas.height);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height); // Or at whatever offset you like

    const colors = canvas
      .getContext("2d")
      .getImageData(window.innerWidth / 2, 0, 1, 1).data;

    updateTheme(colors[0], colors[1], colors[2]);

    //@todo: updateFavicon
    setTimeout(() => updateCycle(), 20);
  };

  img.onload;
  img.src = url;
}

document.getElementById("random").addEventListener("click", function (event) {
  event.preventDefault();

  LOOPING = true;
  const rndi = randomIndex(IMAGES);
  updateCycle(rndi);
});

document.getElementById("now").addEventListener("click", function (event) {
  event.preventDefault();

  LOOPING = true;
  updateCycle(IMAGES.length - 60);
});

document
  .getElementById("main_canvas")
  .addEventListener("click", function (event) {
    event.preventDefault();

    LOOPING = !LOOPING;
    updateCycle();
  });

async function main() {
  console.log("main");
  const html = await getHtml();
  IMAGES = extratHrefs(html);
  console.dir(IMAGES);

  updateCycle(IMAGES.length - 1);
}

main();
