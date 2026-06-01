const SIZE = 8;

let board = [];
let gameOver = false;
let playerTurn = true;
let gameStarted = false;

const boardDiv = $("#board");
const API = window.location.origin;

let gameDifficulty = 0;
let currentWinCells = null;

const STATS_KEY = "caroGameStats";
let stats = {
    "-1": { wins: 0, draws: 0, losses: 0 },
    "0": { wins: 0, draws: 0, losses: 0 },
    "1": { wins: 0, draws: 0, losses: 0 }
};

function loadStats() {
    const savedStats = localStorage.getItem(STATS_KEY);
    if (savedStats) {
        stats = JSON.parse(savedStats);
    }
    updateStatsDisplay();
}

function saveStats() {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function updateStatsDisplay() {
    const difficultyMap = {
        "-1": "easy",
        "0": "medium",
        "1": "hard"
    };

    for (let diff in stats) {
        const prefix = difficultyMap[diff];
        $(`#${prefix}-wins`).text(stats[diff].wins);
        $(`#${prefix}-draws`).text(stats[diff].draws);
        $(`#${prefix}-losses`).text(stats[diff].losses);
    }
}

function updateStats(difficulty, result) {
    const diffStr = String(difficulty);
    if (stats[diffStr]) {
        if (result === "win") {
            stats[diffStr].wins++;
        } else if (result === "draw") {
            stats[diffStr].draws++;
        } else if (result === "loss") {
            stats[diffStr].losses++;
        }
        saveStats();
        updateStatsDisplay();
    }
}

function getSelectedDifficulty() {
    return parseInt($('input[name="difficulty"]:checked').val()) || 0;
}

function setDifficultyDisabled(disabled) {
    $('input[name="difficulty"]').prop("disabled", disabled);
}

function init() {
    boardDiv.html("");
    for (let r = 0; r < SIZE; r++) {
        board[r] = [];
        for (let c = 0; c < SIZE; c++) {
            board[r][c] = ".";

            const cell = $("<div></div>");
            cell.addClass("cell");

            cell.attr("data-row", r);
            cell.attr("data-col", c);

            cell.on("click", () => playerMove(r, c, cell));

            boardDiv.append(cell);
        }
    }
    hideWinLine();
}

async function playerMove(r, c, cell) {
    if (gameOver || !playerTurn || !gameStarted) return;
    if (board[r][c] != ".") return;

    playerTurn = false;

    $("#turn").text("Đến lượt AI...🤖");

    board[r][c] = "X";

    cell.text("X");
    cell.addClass("x");

    let winCells = checkWin("X");
    if (winCells) {
        gameOver = true;
        drawWinLine(winCells);

        setTimeout(() => {
            updateStats(gameDifficulty, "win");
            showModal("🎉 Bạn thắng! 🏆");
            if (currentWinCells) {
                setTimeout(() => drawWinLine(currentWinCells), 50);
            }

        }, 800);
        return;
    }

    if (checkDraw()) {
        gameOver = true;

        setTimeout(() => {
            updateStats(gameDifficulty, "draw");
            showModal("🤝 Hòa rồi! 😅")
        }, 800);
        return;
    }

    const res = await fetch(`${API}/move`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            board: board,
            difficulty: gameDifficulty
        })
    });

    const data = await res.json();
    const aiCell = boardDiv.children().eq(data.row * SIZE + data.col);

    board[data.row][data.col] = "O";

    aiCell.text("O");
    aiCell.addClass("o");

    winCells = checkWin("O");
    if (winCells) {
        gameOver = true;

        drawWinLine(winCells);

        setTimeout(() => {
            updateStats(gameDifficulty, "loss");
            showModal("🎉 AI thắng! 🏆!");
            if (currentWinCells) {
                setTimeout(() => drawWinLine(currentWinCells), 50);
            }
        }, 800);
        return;
    }

    if (checkDraw()) {
        gameOver = true;

        setTimeout(() => {
            updateStats(gameDifficulty, "draw");
            showModal("🤝 Hòa rồi! 😅");
        }, 800);
        return;
    }

    playerTurn = true;
    $("#turn").text("Đến lượt bạn...😎");
}

function checkWin(player) {
    const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1]
    ];

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] !== player) continue;
            for (let [dr, dc] of directions) {
                let cells = [[r, c]];
                for (let k = 1; k < 5; k++) {

                    let nr = r + dr * k;
                    let nc = c + dc * k;

                    if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) break;
                    if (board[nr][nc] !== player) break;

                    cells.push([nr, nc]);
                }
                if (cells.length === 5) {
                    return cells;
                }
            }
        }
    }
    return null;
}

function checkDraw() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] === ".") {
                return false;
            }
        }
    }
    return true;
}

function drawWinLine(cells) {
    if (!cells || cells.length < 2) return;

    currentWinCells = cells;

    const boardEl = $("#board");
    const winLine = $("#winLine");

    const first = cells[0];
    const last = cells[cells.length - 1];

    const firstCell = $(`.cell[data-row="${first[0]}"][data-col="${first[1]}"]`);
    const lastCell = $(`.cell[data-row="${last[0]}"][data-col="${last[1]}"]`);

    if (!firstCell.length || !lastCell.length) return;

    const boardRect = boardEl[0].getBoundingClientRect();

    const firstRect = firstCell[0].getBoundingClientRect();
    const lastRect = lastCell[0].getBoundingClientRect();

    const x1 = firstRect.left - boardRect.left + firstRect.width / 2;
    const y1 = firstRect.top - boardRect.top + firstRect.height / 2;

    const x2 = lastRect.left - boardRect.left + lastRect.width / 2;
    const y2 = lastRect.top - boardRect.top + lastRect.height / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const length = Math.sqrt(dx * dx + dy * dy);

    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    winLine.css({
        width: `${length}px`,
        left: `${x1}px`,
        top: `${y1 - 3}px`,
        transform: `rotate(${angle}deg)`,
        display: "block"
    });
}

function hideWinLine() {
    $("#winLine").hide();
    currentWinCells = null;
}

async function aiFirstMove() {
    const res = await fetch(`${API}/move`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            board: board,
            difficulty: gameDifficulty
        })
    });

    const data = await res.json();
    const aiCell = boardDiv.children().eq(data.row * SIZE + data.col);

    board[data.row][data.col] = "O";

    aiCell.text("O");
    aiCell.addClass("o");

    playerTurn = true;

    $("#turn").text("Đến lượt bạn 😎");
}

function showModal(text) {
    $("#modalText").text(text);
    $("#winModal").css("display", "flex");
}

function restartGame() {
    board = [];
    gameOver = false;
    playerTurn = true;
    gameStarted = false;
    currentWinCells = null;

    $("#winModal").hide();
    $("#turn").text("");
    $("#startBtn").css("display", "inline-block");
    $("#homeBtn").show();
    $(".button-row").css("display", "flex");
    $('input[name="difficulty"]').prop("disabled", false);

    init();
}

function startGame() {
    setDifficultyDisabled(true);
    gameDifficulty = getSelectedDifficulty();
    console.log("Độ khó đã chọn:", gameDifficulty);
    gameStarted = true;

    init();

    const first = Math.random() < 0.5;
    if (first) {
        playerTurn = true;
        $("#turn").text("Bạn đi trước 😎");
    } else {
        playerTurn = false;
        $("#turn").text("AI đi trước 🤖");
        aiFirstMove();
    }
    $("#startBtn").hide();
    $("#homeBtn").hide();
}

$(window).on("resize", () => {
    if (currentWinCells) {
        setTimeout(() => {
            drawWinLine(currentWinCells);
        }, 100);
    }
})

$(document).ready(() => {
    loadStats();
    init();
    $("#homeBtn").click(function (e) {
        e.preventDefault();
        localStorage.removeItem(STATS_KEY);
        window.location.href = "/";
    });
});