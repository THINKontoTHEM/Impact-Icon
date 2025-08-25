// Google Sheets JSON API
const sheetID = "1j7UYLo7dydGAFDm3WU2TntqieccDv5UlVih8XzTE5KU";
const sheetName = "All";
const query = encodeURIComponent("select B");
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}&tq=${query}`;

let values = [];

fetch(url)
  .then(res => res.text())
  .then(rep => {
    const json = JSON.parse(rep.substring(47, rep.length - 2));
    const rows = json.table.rows;

    values = [
      [rows[0].c[0].v, "KG"],
      [rows[1].c[0].v, "KG"],
      [rows[2].c[0].v, "L"],
      [rows[3].c[0].v, "KG"],
      [rows[4].c[0].v, ""]
    ];
  });

// 點擊卡片觸發
document.querySelectorAll(".card").forEach((card, i) => {
  const front = card.querySelector(".front");
  const back = card.querySelector(".back");
  const numberEl = card.querySelector(".number");
  const unitEl = card.querySelector(".unit");

  card.addEventListener("click", () => {
    if (values.length === 0) return;

    if (numberEl.innerText === "") {
      let num = values[i][0];

      // 格式化數字：最後一張取整，其他保留兩位
      if (i === 4) {
        num = Math.round(num);
      } else {
        num = parseFloat(num).toFixed(2);
      }

      numberEl.innerText = num;
      unitEl.innerText = values[i][1];
      numberEl.style.opacity = "1";
      unitEl.style.opacity = "1";
    }

    front.style.opacity = "0";
    back.style.opacity = "1";
    back.style.transform = "scale(1) rotate(360deg)";

    setTimeout(() => {
      back.style.opacity = "0";
      front.style.opacity = "1";
      front.style.transform = "scale(1) rotate(0deg)";
    }, 3000);
  });
});

// 全屏 + 開場動畫控制
const startScreen = document.querySelector(".start-screen");
const openingScene = document.querySelector(".opening-scene");
const container = document.querySelector(".container");
const textEl = document.querySelector(".opening-text");

let textFinished = false;

document.body.addEventListener("click", async () => {
  // 第一次點擊 → 進入全屏 + 打字動畫
  if (startScreen.style.display !== "none") {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }

    startScreen.style.display = "none";
    openingScene.style.display = "flex";

    const text = `AT OUR FUTURE FARM,\nEVERY LEAF TELLS A <span class="highlight">SUSTAINABLE STORY.</span>`;
    textEl.innerHTML = "";

    let i = 0;
    const typer = setInterval(() => {
      textEl.innerHTML = text.substring(0, i) + (i < text.length ? "|" : "");
      i++;
      if (i > text.length) {
        clearInterval(typer);
        textFinished = true;
      }
    }, 50);
  }

  // 第二次點擊 → 漸隱 Opening Scene，顯示 Panel
  else if (textFinished && openingScene.style.display !== "none") {
    openingScene.style.transition = "opacity 1s";
    openingScene.style.opacity = "0";
    setTimeout(() => {
      openingScene.style.display = "none";
      container.style.display = "grid";
    }, 1000);
  }
});
