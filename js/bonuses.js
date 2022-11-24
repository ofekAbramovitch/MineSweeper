'use strict'

var hintsCount
var isHintLeft
var localStorageLevel
var gUndo



function initGameBonus() {
    document.querySelector('.lives').innerText = '❤️'.repeat(3)
    document.querySelector('.hints span').innerText = '💡'.repeat(3)
    gLives = 3
    hintsCount = 3
    isHintLeft = false
    localStorageLevel = gLevel.SIZE
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





function undo() {
    if (!gUndo.length) return
    var board = gUndo.pop()
    gBoard = board
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