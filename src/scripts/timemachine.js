/**
 * 时光机
 * stack 当前操作栈
 * index 当前栈索引
 * historyIndex 历史开始的索引
 */
export default class Timemachine {
  constructor() {
    this.stack = []
    this.index = 0
    this.historyIndex = 0
  }

  /**
   * 撤销一步
   */
  undo() {
    let backward = this.index - 1

    if (backward >= this.historyIndex) {
      let record = this.get(backward)

      if (record) {
        this.index--
        return record
      }
    }
  }

  /**
   * 前进一步
   */
  redo() {
    let record = this.get()

    if (record) {
      this.index++
      return record
    }
  }

  /**
   * 获取指定索引的数据
   * @param index
   * @returns {*}
   */
  get(index = this.index) {
    return this.stack[index]
  }

  /**
   * 全部记录栈
   */
  fullStack() {
    return this.stack
  }

  /**
   * 历史记录
   * @returns {*[]}
   */
  historyStack() {
    return this.stack.slice(0, this.historyIndex)
  }

  /**
   * 当前记录
   */
  presentStack() {
    return this.stack.slice(this.historyIndex)
  }

  /**
   * 增加一条记录
   * @param data
   */
  push(data) {
    if (!this.isLatest()) {
      this.stack.splice(this.index)
    }

    this.stack.push(data)
    this.index++
  }

  /**
   * 删除一条记录
   * @param index
   */
  remove(index) {
    if (index < this.stack.length) {
      this.stack.splice(index, 1)

      if (index < this.index) {
        this.index--
      }
      if (index < this.historyIndex) {
        this.historyIndex--
      }
    }
  }

  /**
   * 设置历史起点
   * @param index
   */
  makeHistory(index) {
    if (typeof index === 'number') {
      this.historyIndex = index
    } else {
      this.historyIndex = this.size()
    }
  }

  /**
   * 移动指针
   * @param index
   */
  travel(index) {
    if (typeof index === 'number') {
      this.index = index
    }
  }

  /**
   * 当前栈中数量
   * @returns {number}
   */
  size() {
    return this.stack.length
  }

  /**
   * 是否在起始点
   */
  isStart() {
    return this.index === this.historyIndex
  }

  /**
   * 当前是否是最新状态
   * @returns {boolean}
   */
  isLatest() {
    return this.index === this.size()
  }

  /**
   * 重置
   */
  reset() {
    this.stack = []
    this.index = 0
    this.historyIndex = 0
  }
}
