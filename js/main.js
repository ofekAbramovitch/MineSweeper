'use strict'

var gBoard
var gShownCells = 0
var gInterval

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const EMPTY = ''
const MINE = '💣'

function initGame() {
    gGame.isOn = false
    gBoard = buildBoard()
    renderBoard(gBoard)

}

function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell()
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = '<table><tbody>'

    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.SIZE; j++) {
            const currCell = board[i][j]
            var classStr = getClassName({ i, j })
            if (currCell.isShown) {
                if (currCell.isMine) var str = MINE
                else str = minesAroundCountcolor(+currCell.minesAroundCount)
                classStr += 'show-cell'
            } else {
                str = EMPTY
                classStr += 'hide-cell'
            }
            strHTML += `<td class="${classStr}" onclick="cellClicked(this, ${i}, ${j})">${str}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    const el = document.querySelector('.board')
    el.innerHTML = strHTML
}

function createCell() {
    const cell = {
        minesAroundCount: 4,
        isShown: false,
        isMine: false,
        isMarked: true
    }
    return cell
}

function setMinesNegsCount(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const currCell = board[i][j]
            currCell.minesAroundCount = minesNegsCount(board, i, j)
        }
    }
}

function minesNegsCount(board, rowIdx, colIdx) {
    var mineCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) mineCount++
        }
    }
    return mineCount
}

function firstCellClicked(i, j) {
    const currCell = gBoard[i][j]
    gGame.shownCount++
    currCell.isShown = true
    getRandMine()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    if (!currCell.minesAroundCount) {
        expandShown(gBoard, i, j)
    }
    gGame.isOn = true
    gInterval = setInterval(timer,1000)
}

function cellClicked(elCell, i, j) {
    if (gGame.isOn) {
        const currCell = gBoard[i][j]
        if (currCell.isMine) {
            showMine()
            return
        }
        if (!currCell.minesAroundCount) {
            expandShown(gBoard, i, j)
        }
        gGame.shownCount++
        currCell.isShown = true
        var str = minesAroundCountcolor(currCell.minesAroundCount)
        elCell.innerHTML = str
        elCell.classList.replace('hide-cell', 'show-cell')
        if (checkGameOver()) gameOver()
    } else firstCellClicked(i, j)
}

function minesAroundCountcolor(minesAroundCount) {
    switch (minesAroundCount) {
        case 0:
            return EMPTY
        case 1:
            return `<span style="color: blue;">${minesAroundCount}</span>`
        case 2:
            return `<span style="color: green;">${minesAroundCount}</span>`
        case 3:
            return `<span style="color: red;">${minesAroundCount}</span>`
        case 4:
            return `<span style="color: darkblue;">${minesAroundCount}</span>`
        case 5:
            return `<span style="color: darkred;">${minesAroundCount}</span>`
        case 6:
            return `<span style="color: darkcyan;">${minesAroundCount}</span>`
        case 7:
            return `<span style="color: cyan;">${minesAroundCount}</span>`
        case 8:
            return `<span style="color: brown;">${minesAroundCount}</span>`
    }
}

function getRandMine() {
    const cells = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!gBoard[i][j].isShown) cells.push({ i, j })
        }
    }
    for (var i = 0; i < gLevel.MINES; i++) {
        const currCell = drawCell(cells)
        gBoard[currCell.i][currCell.j].isMine = true
    }
}

function showMine() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine) renderCell({ i, j }, MINE)
        }
    }
    gameOver()
}

function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            const currCell = board[i][j]
            gGame.shownCount++
            currCell.isShown = true
            renderCell({ i, j }, minesAroundCountcolor(currCell.minesAroundCount))
        }
    }
}

function checkGameOver() {
    return gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES
}

function gameOver() {
    clearInterval(gInterval)
}