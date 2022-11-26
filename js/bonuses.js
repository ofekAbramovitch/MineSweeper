'use strict'

var hintsCount
var isHintLeft
var localStorageLevel
var safeClickCount
var isManCreateMode
var manCreateCount
var gUndo



function initGameBonus() {
    gLives = 3
    document.querySelector('.lives').innerText = '❤️'.repeat(3)
    hintsCount = 3
    document.querySelector('.hints span').innerText = '💡'.repeat(3)
    isHintLeft = false
    localStorageLevel = gLevel.SIZE
    updateElScore()
    safeClickCount = 3
    document.querySelector('.safe-click-div span').innerText = safeClickCount
    isManCreateMode = false
    manCreateCount = 0
    gLevel.MINES = initMines()
    gUndo = []
}

function hint() {
    hintsCount--
    const elHint = document.querySelector('.hints span')
    const lamp = '💡'.repeat(hintsCount)
    elHint.innerText = lamp
    isHintLeft = true
}

function showHint(location) {
    const rowIdx = location.i
    const colIdx = location.j
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            const currCell = gBoard[i][j]
            const val = currCell.isMine ? MINE : minesAroundCountcolor(currCell.minesAroundCount)
            renderCell({ i, j }, val)
        }
    }

    setTimeout(function () {
        renderBoard(gBoard)
        const elHint = document.querySelector('.hints span')
        elHint.innerText = '💡'.repeat(hintsCount)
        isHintLeft = false
    }, 1000);
}

function saveLevelScore(localStorageLevel) {
    if (localStorage.getItem(localStorageLevel) === null) {
        localStorage.setItem(localStorageLevel, '-1')
    }
}

function updateLevelScore(currScore, localStorageLevel) {
    const prevScore = localStorage.getItem(localStorageLevel)
    if (currScore < prevScore || prevScore === '-1') {
        localStorage.setItem(localStorageLevel, currScore)
    }
}

function updateElScore() {
    const score = localStorage.getItem(localStorageLevel)
    const elScore = document.querySelector('.score span')
    elScore.innerText = convertTime(score)
}

function safeClick() {
    if (!safeClickCount) return
    const cells = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!gBoard[i][j].isShown && !gBoard[i][j].isMine) cells.push({ i, j })
        }
    }
    const currCell = drawCell(cells)
    const val = minesAroundCountcolor(gBoard[currCell.i][currCell.j].minesAroundCount)
    renderCell(currCell, val)
    setTimeout(function () {
        renderCell(currCell, EMPTY, false)
    }, 1500)
    safeClickCount--
    document.querySelector('.safe-click-div span').innerText = safeClickCount
}

function initMines() {
    if (gLevel.SIZE === 4) return 2
    if (gLevel.SIZE === 8) return 14
    if (gLevel.SIZE === 12) return 32
}

function manCreate(elBtn) {
    if (elBtn.innerText === 'Manually create mode') {
        initGame()
        elBtn.innerText = 'Start'
        isManCreateMode = true
    } else {
        elBtn.innerText = 'Manually create mode'
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        gLevel.MINES = manCreateCount
        isManCreateMode = false
        isFirstClick = false
        gGame.isOn = true
        gInterval = setInterval(timer, 1000)
    }
}

function initManCreate(location) {
    renderCell(location, MINE)
    gBoard[location.i][location.j].isMine = true
    manCreateCount++
}

function undo() {
    if (!gUndo.length) return
    if (!gGame.isOn) return
    var board = gUndo.pop()
    gBoard = board
    countShownAndMarked()
    renderBoard(board)
}

function copyBoard(board) {
    const copy = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        copy[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            const currCell = board[i][j]
            copy[i][j] = createCell(currCell.minesAroundCount, currCell.isShown, currCell.isMine, currCell.isMarked)
        }
    }
    return copy
}

function countShownAndMarked() {
    gGame.shownCount = 0
    gGame.markedCount = 0
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isShown) gGame.shownCount++
            else if (currCell.isMarked) gGame.markedCount++
        }
    }
}