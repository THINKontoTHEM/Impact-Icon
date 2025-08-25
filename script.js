// Google Sheets JSON API
const sheetID = "1j7UYLo7dydGAFDm3WU2TntqieccDv5UlVih8XzTE5KU";
const sheetName = "All";
const query = encodeURIComponent("select B");
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}&tq=${query}`;

let values = [];
let units = ["KG", "KG", "L", "KG", "PCS"]; // 保留單位

fetch(url)
  .then(res => res.text())
  .then(rep => {
    const json = JSON.parse(rep.substring(47, rep.length - 2));
    const rows = json.table.rows;

    // 數據處理
    values = [
      parseFloat(rows[0].c[0].v).toFixed(2),
      parseFloat(rows[1].c[0].v).toFixed(2),
      parseFloat(rows[2].c[0].v).toFixed(2),
      parseFloat(rows[3].c[0].v).toFixed(2),
      Math.round(rows[4].c[0].v)
    ];

    // 初始化：顯示 ??? + 單位
    document.querySelectorAll(".number").forEach((el, i) => {
      el.innerHTML = `<span class="digits">???</span> <span class="unit">${units[i]}</span>`;
      el.style.opacity = "1"; // 顯示出來
    });
  });

// 點擊卡片觸發
document.querySelectorAll(".card").forEach((card, i) => {
  const front = card.querySelector(".front");
  const back = card.querySelector(".back");
  const numberEl = card.querySelector(".number");

  card.addEventListener("click", () => {
    if (values.length === 0) return;

    // 顯示實際數字（保留單位）
    const digitsEl = numberEl.querySelector(".digits");
    if (digitsEl && digitsEl.innerText === "???") {
      digitsEl.innerText = values[i];
    }

    // Icon A -> B
    front.style.opacity = "0";
    back.style.opacity = "1";
    back.style.transform = "scale(1) rotate(360deg)";

    // 3 秒後回到 A
    setTimeout(() => {
      back.style.opacity = "0";
      front.style.opacity = "1";
      front.style.transform = "scale(1) rotate(0deg)";
    }, 3000);
  });
});

// 開場動畫控制
const startScreen = document.querySelector(".start-screen");
const openingScene = document.querySelector(".opening-scene");
const container = document.querySelector(".data-panel-wrapper");
const textEl = document.querySelector(".opening-text");

let textFinished = false;

document.body.addEventListener("click", async () => {
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
  } else if (textFinished && openingScene.style.display !== "none") {
    openingScene.style.transition = "opacity 1s";
    openingScene.style.opacity = "0";
    setTimeout(() => {
      openingScene.style.display = "none";
      container.style.display = "flex"; // 顯示數據面板
    }, 1000);
  }
});
