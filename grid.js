
const columns = 17;
let rows = 37;

let windowWidth = window.innerWidth;

window.addEventListener('resize', () => {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  console.log('Updated width:', windowWidth);
  document.documentElement.style.setProperty("--cell-size", Math.floor(windowWidth / (columns + 2)) + "px");
  rows = Math.floor((window.innerHeight - 200) / (windowWidth / (columns + 2)));
});

document.documentElement.style.setProperty("--cell-size", Math.floor(windowWidth / (columns + 2)) + "px");
document.documentElement.style.setProperty("--number-of-columns", columns);

function createGrid(r, c) {
    const grid = document.getElementById("grid");

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < columns; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            cell.addEventListener("click", () => {
                cell.classList.toggle("on");
            });

            grid.appendChild(cell);
        }
    }
}

createGrid(columns, rows);