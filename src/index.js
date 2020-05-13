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
const BRUSH_CONFIG = {
  stroke: '#0000FF',
  tension: 1,
  lineCap: 'round',
  lineJoin: 'round',
  draggable: false,
  dash: false
}
const COMPOSITE_OPERATION = {
  SOURCE_OVER: 'source-over',
  DESTINATION_OUT: 'destination-out'
}

const container = document.getElementById('stage-container')
const board = new Board({ container })
let brush = null

const { stage, layer } = board

let isDrawing = false
let mode = DRAW_MODE.PEN

const createBrush = () => {
  brush = new Konva.Shape({
    ...BRUSH_CONFIG,
    name: mode,
    strokeWidth: mode === DRAW_MODE.PEN ? 0 : 32,
    stroke: board.strokeColor,
    globalCompositeOperation: mode === DRAW_MODE.PEN
      ? COMPOSITE_OPERATION.SOURCE_OVER
      : COMPOSITE_OPERATION.DESTINATION_OUT,
    sceneFunc: function(context) {
      sceneFunc.brush(context, this)
    }
  })
  brush.id(uuidv4())
}

const onPointerdown = e => {
  isDrawing = true
  let isEraser = checkButtons(e)
  mode = isEraser ? DRAW_MODE.ERASER : DRAW_MODE.PEN
  changeCursorStyle(mode)
  createBrush()
  let pos = getPointerPosition(e)
  let width = getLineWidth(e)
  brush.setAttrs({
    points: [pos.x, pos.y],
    widths: isEraser ? null : [width]
  })
}

const onPointermove = e => {
  if (!isDrawing) return
  if (!brush.getLayer()) layer.add(brush)
  let pos = getPointerPosition(e)
  let { points, widths } = brush.getAttrs()
  let newPoints = points.concat([pos.x, pos.y])
  mode !== DRAW_MODE.ERASER && widths.push(getLineWidth(e))
  brush.setAttrs({
    points: newPoints,
    widths
  })
  layer.draw()
}

const onPointerup = e =>  {
  isDrawing = false
  if (brush.attrs.added || !brush.getLayer()) return
  brush.attrs.added = true
  board.timemachine.push({
    action: 'add',
    data: brush
  })
}

const onPointerleave = e => {
  isDrawing = false
}

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
      return parseFloat(width.toFixed(3))
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

const getPointerPosition = e => {
  // stage.getPointerPosition()返回的是int类型，需要float类型
  let pos = stage.getPointerPosition()
  if (!pos) pos = { x: e.clientX, y: e.clientY }
  console.log(pos)
  let x = Number.isInteger(pos.x) ? pos.x : pos.x.toFixed(2)
  let y = Number.isInteger(pos.y) ? pos.y : pos.y.toFixed(2)
  return { x, y }
  // const canvasRect = container.getBoundingClientRect()
  // const { top, left } = canvasRect
  // const position = {
  //   x: e.clientX - left,
  //   y: e.clientY - top
  // }
  // return {
  //   x: position.x.toFixed(3),
  //   y: position.y.toFixed(3)
  // }
}

const changeCursorStyle = type => {
  let cursor = type === 'pen' ? cursorPen : cursorEraser
  board.container.style.cursor = `url(${cursor}) 0 0, move`
}

container.addEventListener('pointerdown', onPointerdown)
container.addEventListener('pointermove', onPointermove)
container.addEventListener('pointerup', onPointerup)
container.addEventListener('pointerleave', onPointerleave)

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
