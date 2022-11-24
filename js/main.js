'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'
const winImg = '<img src="img/happy.jpg"></img>'
const lossImg = '<img src="img/sad1.png"></img>'
const neutImg = '<img src="img/neutral.jpg"></img>'
var gBoard
var gInterval
var gLives
var isFirstClick

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


function initGame() {
    initGameBonus()
    document.querySelector('.neutral').innerHTML = neutImg
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gBoard = buildBoard()
    if (gInterval) clearInterval(gInterval)
    renderBoard(gBoard)
    isFirstClick = true
}

function beginnerDif() {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    initGame()
    localStorageLevel = gLevel.SIZE
    saveLevelScore(localStorageLevel)
    updateElScore()
}

function mediumDif() {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    initGame()
    localStorageLevel = gLevel.SIZE
    saveLevelScore(localStorageLevel)
    updateElScore()
}


function expertDif() {
    gLevel.SIZE = 12
    gLevel.MINES = 32
    initGame()
    localStorageLevel = gLevel.SIZE
    saveLevelScore(localStorageLevel)
    updateElScore()
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
    var strHTML = '<table oncontextmenu="return false"><tbody>'

    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.SIZE; j++) {
            const currCell = board[i][j]
            var classStr = getClassName({ i, j })
            if (currCell.isShown) {
                if (currCell.isMine) var str = MINE
                else str = minesAroundCountcolor(+currCell.minesAroundCount)
                classStr += ' show-cell'
            } else {
                str = EMPTY
                classStr += ' hide-cell'
            }
            strHTML += `<td class="${classStr}"  onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this)" >${str}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    const el = document.querySelector('.board')
    el.innerHTML = strHTML
}

function createCell() {
    const cell = {
        minesAroundCount: 0,
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
    gUndo.push(copyBoard(gBoard))
    if (!currCell.minesAroundCount) {
        expandShown(gBoard, i, j)
    }
    gGame.isOn = true
    gInterval = setInterval(timer, 1000)
}

function cellClicked(elCell, i, j) {
    if (elCell.innerHTML === FLAG) return
    if (isHintLeft) return showHint({ i, j })
    if (isManCreateMode) return initManCreate({ i, j })
    if (!isFirstClick) {
        if (!gGame.isOn) return
        const currCell = gBoard[i][j]
        if (currCell.isShown) return
        if (currCell.isMine) {
            showMine(elCell)
            return
        }
        if (!currCell.minesAroundCount) {
            expandShown(gBoard, i, j)
            gUndo.push(copyBoard(gBoard))
            return
        }
        gGame.shownCount++
        currCell.isShown = true
        var str = minesAroundCountcolor(currCell.minesAroundCount)
        elCell.innerHTML = str
        elCell.classList.replace('hide-cell', 'show-cell')
        gUndo.push(gBoard)
        if (checkGameOver()) gameOver()
    } else {
        firstCellClicked(i, j)
        gUndo.push(copyBoard(gBoard))
        isFirstClick = false
    }
}


function cellMarked(elCell) {
    if (elCell.innerHTML === FLAG) {
        elCell.innerHTML = EMPTY
        gGame.markedCount--
    } else {
        elCell.innerHTML = FLAG
        gGame.markedCount++
        if (checkGameOver()) gameOver()
    }
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

function showMine(elCell) {
    const elLives = document.querySelector('.lives')
    if (gLives) {
        gLives--
        const heart = '❤️'.repeat(gLives)
        elLives.innerText = heart
        elCell.classList.replace('hide-cell', 'show-cell')
        elCell.innerText = MINE
        setTimeout(function () {
            elCell.classList.replace('show-cell', 'hide-cell')
            elCell.innerText = EMPTY
        }, 1000)
        return
    }
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine) renderCell({ i, j }, MINE)
        }
    }
    elLives.innerText === ''
    gameOver()

}

function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            const currCell = board[i][j]
            if (currCell.isShown) continue
            gGame.shownCount++
            currCell.isShown = true
            renderCell({ i, j }, minesAroundCountcolor(currCell.minesAroundCount))
            if (!currCell.minesAroundCount) { expandShown(board, i, j) }
        }
    }
}

function checkGameOver() {
    return gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES && gGame.markedCount === gLevel.MINES
}

function gameOver() {
    clearInterval(gInterval)
    var elNeut = document.querySelector('.neutral')
    if (checkGameOver()) {
        elNeut.innerHTML = winImg
        updateLevelScore(gGame.secsPassed - 1, localStorageLevel)
        updateElScore()
    }
    else elNeut.innerHTML = lossImg
    gGame.isOn = false
}
