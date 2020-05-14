import 'pepjs'
import { v4 as uuidv4 } from 'uuid'
import Konva from './scripts/konva'
import sceneFunc from './scripts/sceneFunc'
import Board from './scripts/board'
import cursorPen from '@/images/cursor-pen.png'
import cursorEraser from '@/images/cursor-eraser.png'
import './styles/main.scss'

const MAX_WIDTH = 2
const MIN_WIDTH = 0.1
const DRAW_MODE = {
  PEN: 'pen',
  ERASER: 'eraser'
}
const BUTTONS = {
  none: 0,        // 鼠标移动且无按钮被按压
  tip: 0x1,       // 鼠标左键、触摸接触、压感笔接触（无额外按钮被按压）
  barrel: 0x2,    // 鼠标右键
  middle: 0x4,    // 鼠标中键、压感笔接触且笔杆按钮被按压
  back: 0x8,      // 鼠标X1 (back) 
  forward: 0x10,  // 鼠标X2 (forward)
  eraser: 0x20    // 压感笔接触且橡皮擦按钮被按压
}

const COMPOSITE_OPERATION = {
  SOURCE_OVER: 'source-over',
  DESTINATION_OUT: 'destination-out'
}

const container = document.getElementById('stage-container')
const board = new Board({ container })

let brush = null

const { stage, layer } = board

const canvas = document.getElementById('my-house')
const context = canvas.getContext('2d')
let isEraser = false

let isDrawing = false
let lastPos = null
let lineWidth = 1
let mode = DRAW_MODE.PEN

const getLineWidth = e => {
  switch (e.pointerType) {
    case 'touch':
      return MAX_WIDTH
      break

    case 'pen':
      let width = e.pressure * 8
      // if (width < MIN_WIDTH) {
      //   return MIN_WIDTH 
      // }
      // return parseFloat(width.toFixed(3))
      return width
      break

    case 'mouse':
      return MAX_WIDTH
      break

    default: 
      console.log("pointerType " + e.pointerType + " is Not suported")
  }
}

// 判断是不是橡皮擦 wacom手写板的橡皮擦buttons是32 画笔buttons是1
const checkButtons = e => {
  if (mode === DRAW_MODE.ERASER) return true
  return (e.pointerType === 'pen' && e.buttons === BUTTONS.eraser)
}

const changeCursorStyle = type => {
  let cursor = type === 'pen' ? cursorPen : cursorEraser
  board.container.style.cursor = `url(${cursor}) 0 0, move`
}

function midPointBetween(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  }
}

const draw = pos => {
  context.globalCompositeOperation = isEraser
    ? COMPOSITE_OPERATION.DESTINATION_OUT
    : COMPOSITE_OPERATION.SOURCE_OVER
  context.strokeStyle = isEraser ? 'white' : board.strokeColor
  context.lineWidth = lineWidth
  context.lineJoin = 'round'
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(lastPos.x, lastPos.y)
  // let midPoint = midPointBetween(lastPos, pos)
  // context.quadraticCurveTo(lastPos.x, lastPos.y, midPoint.x, midPoint.y)
  context.lineTo(pos.x, pos.y)
  context.stroke()
  layer.draw()
  lastPos = pos
}

window.pointerdown = event => {
  isDrawing = true
  lastPos = event.pos
  console.log(lastPos)
}

window.pointermove = event => {
  if (!isDrawing) return
  const { pos, pressure, pointerType, buttons } = event
  isEraser = buttons === BUTTONS.eraser
  lineWidth = isEraser ? 128 : pressure * 8
  draw(pos)
}

window.pointerup = () => {
  isDrawing = false
}

window.pointerleave = () => {
  isDrawing = false
}

window.canvasready = cb => {
  window.addEventListener('load', () => {
    console.log('page is fully loaded')
    cb && cb()
  })
}

board.opEle.addEventListener('click', e => {
  const id = e.target.dataset['id']
  if (id === DRAW_MODE.PEN || id === DRAW_MODE.ERASER) {
    mode = id
    brush = createBrush()
    changeCursorStyle(mode)
  } else {
    return
  }
})
