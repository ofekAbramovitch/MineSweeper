'use strict'

// const GAMER_IMG = '<img src="img/gamer.png">'
//const WIN_SOUND = new Audio('sound/win.wav')
//WIN_SOUND.play()


// function createBoard() {
//     var board = []

//     for (var i = 0; i < 8; i++) {
//         board.push([])

//         for (var j = 0; j < 8; j++) {
//             board[i][j] = (Math.random() > 0.5) ? LIFE : ''
//         }
//     }

//     return board
// }


// function renderBoard(board) {
//     var strHTML = ''

//     for (var i = 0; i < board.length; i++) {
//         strHTML += '<tr>'

//         for (var j = 0; j < board[0].length; j++) {
//             var cell = board[i][j]
//             var className = (cell) ? 'occupied' : ''
//             var cellData = 'data-i="' + i + '" data-j="' + j + '"'

//             strHTML += `<td class="${className}" ${cellData}
//             onclick="onCellClicked(this,${i},${j})">
//             ${cell}</td>`
//         }

//         strHTML += '</tr>\n'
//     }

//     var elBoard = document.querySelector('.board')
//     elBoard.innerHTML = strHTML
// }


// function copyMat(mat) {
//     var newMat = []

//     for (var i = 0; i < mat.length; i++) {
//         newMat[i] = []

//         for (var j = 0; j < mat[0].length; j++) {
//             newMat[i][j] = mat[i][j]
//         }
//     }

//     return newMat
// }


// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}


// function countNegs(board, rowIdx, colIdx) {
//     var foodCount = 0
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i >= board.length) continue
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (i === rowIdx && j === colIdx) continue
//             if (j < 0 || j >= board[0].length) continue
//             var currCell = board[i][j]
//             if (currCell === FOOD) foodCount++
//         }
//     }
//     return count

// }

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
    elCell.classList.replace('hide-cell', 'show-cell')
}


function getEmptyCells() {
    var emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard[i].length; j++) {

            if ((gBoard[i][j] != WALL) && (gBoard[i][j] != PACMAN) && (gBoard[i][j] != POWER_FOOD)) {
                emptyCells.push({ i, j })
            }
        }
    }

    return emptyCells
}


// function getNextLocation(eventKeyboard) {
//     // console.log(eventKeyboard)
//     const nextLocation = {
//         i: gPacman.location.i,
//         j: gPacman.location.j
//     }
//     // DONE: figure out nextLocation
//     switch (eventKeyboard) {
//         case 'ArrowUp':
//             nextLocation.i--
//             break;
//         case 'ArrowRight':
//             nextLocation.j++
//             break;
//         case 'ArrowDown':
//             nextLocation.i++
//             break;
//         case 'ArrowLeft':
//             nextLocation.j--
//             break;
//     }

//     return nextLocation
// }


// function drawNum(nums) {
//     var idx = getRandomInt(0, nums.length)
//     var num = nums[idx]
//     nums.splice(idx, 1)

//     return num
// }

function drawCell(cells) {
    var idx = getRandomInt(0, cells.length)
    var cell = cells.splice(idx, 1)[0]
    return cell
}


function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}


// function shuffle(items) {
//     var randIdx, keep, i;
//     for (i = items.length - 1; i > 0; i--) {
//         randIdx = getRandomInt(0, items.length - 1)

//         keep = items[i];
//         items[i] = items[randIdx]
//         items[randIdx] = keep
//     }

//     return items
// }


function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }

    return color
}


// function timer() {
//     var timer = document.querySelector('.timer span')
//     var start = Date.now()

//     gTimerInterval = setInterval(function () {
//         var currTs = Date.now()
//         var secs = parseInt((currTs - start) / 1000)
//         var ms = (currTs - start) - secs * 1000
//         ms = '000' + ms
//         ms = ms.substring(ms.length - 2, ms.length)

//         timer.innerText = `\n ${secs}:${ms}`
//     }, 100)
// }

function timer() {
    const timer = document.querySelector('.timer span')
    timer.innerText = convertTime(gGame.secsPassed)
    gGame.secsPassed++
}

function convertTime(sec) {
    if (sec === -1) return 'No score'
    var minute = Math.floor(sec / 60)
    sec = sec % 60
    const strSecond = sec < 10 ? '0' + sec : sec
    const strMinutes = minute < 10 ? '0' + minute : minute
    return strMinutes + ':' + strSecond
}