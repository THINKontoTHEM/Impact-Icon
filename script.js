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

    // 這裡要注意：rows[0] = B2, rows[1] = B3, rows[2] = B4 ...
    values = [
      rows[0].c[0].v + " kg",  // B2
      rows[1].c[0].v + " kg",  // B3
      rows[2].c[0].v + " L",   // B4
      rows[3].c[0].v + " kg",  // B5
      rows[4].c[0].v + " g"    // B6
    ];
  });

// 點擊卡片觸發
document.querySelectorAll(".card").forEach((card, i) => {
  const front = card.querySelector(".front");
  const back = card.querySelector(".back");
  const numberEl = card.querySelector(".number");

  card.addEventListener("click", () => {
    if (values.length === 0) return; // 還沒讀到資料就點擊，直接跳過

    // 顯示數字（只要還沒顯示過）
    if (numberEl.innerText === "") {
      numberEl.innerText = values[i];
      numberEl.style.opacity = "1";
    }

    // Icon A -> B
    front.style.opacity = "0";
    back.style.opacity = "1";
    back.style.transform = "scale(1) rotate(360deg)";

    // 3 秒後回到 A，但數字保持
    setTimeout(() => {
      back.style.opacity = "0";
      front.style.opacity = "1";
      front.style.transform = "scale(1) rotate(0deg)";
    }, 3000);
  });
});
