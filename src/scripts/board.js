import { saveAs } from 'file-saver'
import Konva from './konva'
import Timemachine from './timemachine'
import sceneFunc from './sceneFunc'

// 操作类型
const UNDO = 'UNDO'
const REDO = 'REDO'

// 动作类型
const ADD = 'add'
const REMOVE = 'remove'
const UPDATE = 'update'

export default class Board {
  constructor (options = {}) {
    this.container = typeof options.container === 'string'
      ? document.getElementById(options.container)
      : options.container
    this.opEle = document.getElementById('operations')
    this.colorEle = document.getElementById('colors')
    this.stage = null
    this.layer = null
    this.strokeColor = 'black'
    this.timemachine = new Timemachine()
    this.init()
  }

  init () {
    this.initStage()
    this.attachEvents()
  }

  initStage () {
    this.stage = new Konva.Stage({
      container: this.container,
      width: window.innerWidth,
      height: window.innerHeight
    })
    this.layer = new Konva.Layer()
    this.stage.add(this.layer)
    this.container.style.cursor = 'url(' + require('@/images/cursor-pen.png').default  + ') 0 0, move'
  }

  attachEvents () {
    this.opEle.addEventListener('click', e => {
      e.stopPropagation()
      const target = e.target
      if (target.nodeName === 'LI') {
        let ID = target.dataset['id'].replace(/\w/, m => m.toUpperCase())
        if (ID !== 'Pen' && ID !== 'Eraser') {
          let handle = `handle${ID}`
          this[handle].call(this)
        }
      }
    }, false)

    this.colorEle.addEventListener('click', e => {
      e.stopPropagation()
      const target = e.target
      if (target.nodeName === 'LI') {
        this.strokeColor = target.dataset['id']
      }
    }, false)
  }

  handleUndo () {
    if (this.timemachine.isStart()) return
    let record = this.timemachine.undo()
    this.timemachineHandler(record, UNDO)
  }

  handleRedo () {
    if (this.timemachine.isLatest()) return
    let record = this.timemachine.redo()
    this.timemachineHandler(record, REDO)
  }

  /**
   * 撤销或重做
   * @param {object} 记录
   * @param {string} 操作类型
   */
  timemachineHandler (record, handleType) {
    let func = Array.isArray(record.data)
      ? this.handleElements
      : this.handleSingleElement
    func.call(this, handleType, record)
  }

  /**
   * 处理清屏操作的undo redo
   * 只有add remove两种操作，不存在update的情况
   * @param {object} 记录
   * @param {string} 操作类型
   */
  handleElements (handleType, record) {
    let { action, data } = record
    if (handleType === UNDO) {
      switch (action) {
        case ADD:
          data.forEach(n => {
            let node = this.stage.findOne('#' + n.id())
            node && node.destroy()
          })
          break
        case REMOVE:
          data.forEach(node => {
            this.layer.add(node)
            node.sceneFunc((context, s) => {
              sceneFunc.brush(context, s)
            })
          })
          break
      }
    } else {
      switch (action) {
        case ADD:
          data.forEach(node => {
            this.layer.add(node)
            node.sceneFunc((context, s) => {
              sceneFunc.brush(context, s)
            })
          })
          break
        case REMOVE:
          data.forEach(n => {
            let node = this.stage.findOne('#' + n.id())
            node && node.destroy()
          })
          break
      }
    }
    this.layer.draw()
  }

  handleSingleElement (handleType, record) {
    let { action, data } = record
    let node = this.layer.findOne('#' + data.id())
    if (handleType === UNDO) {
      switch (action) {
        case ADD:
          if (node) {
            node.destroy() 
          }
          break
        case REMOVE:
          this.layer.add(data)
          break
      }
    } else {
      switch (action) {
        case ADD:
          this.layer.add(data)
          break
        case REMOVE:
          node && node.destroy()
          break
      }
    }
    node && node.sceneFunc((context, s) => {
      sceneFunc.brush(context, s)
    })
    this.layer.draw()
  }

  // 保存为图片
  handleSave () {
    let parts = this.stage.toDataURL().match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/)
    //assume base64 encoding
    let binStr = atob(parts[3])
    console.log(parts[3], binStr)
    //convert to binary in ArrayBuffer
    let buf = new ArrayBuffer(binStr.length)
    console.log(buf)
    let view = new Uint8Array(buf)
    for (var i = 0; i < view.length; i++) {
      view[i] = binStr.charCodeAt(i)
    }
    console.log(view)
    let blob = new Blob([view], { 'type': parts[1] })
    saveAs(blob, 'scribble_' + Date.now() + '.png')
  }

  // 清屏
  handleClear () {
    let children = this.layer.children
    if (children.length === 0) return
    this.timemachine.push({
      action: 'remove',
      data: [...children]
    })
    this.layer.destroyChildren()
    this.stage.draw()
  }
}
