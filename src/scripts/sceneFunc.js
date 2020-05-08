export default {
  brush (context, shape) {
    const { points, widths } = shape.getAttrs()
    var length = points.length,
      _context = context._context
  
    if (length === 0) return
    let lastIndex = 0
  
    _context.lineCap = shape.lineCap()
    _context.lineJoin = shape.lineJoin()
    _context.strokeStyle = shape.stroke()
    if (shape.hasName('eraser')) {
      context.beginPath()
      context.moveTo(points[0], points[1])
      for (let n = 2; n < length; n += 2) {
        context.lineTo(points[n], points[n + 1]);
      }
      context.strokeShape(shape)
    } else {
      for (let n = lastIndex; n < length; n += 2) {
        _context.lineWidth = widths[n / 2]
        _context.beginPath()
        _context.moveTo(points[lastIndex], points[lastIndex + 1])

        _context.bezierCurveTo(
          points[n++],
          points[n++],
          points[n++],
          points[n++],
          points[n++],
          points[n++]
        )
        _context.lineTo(points[n], points[n + 1])
        _context.stroke()
        lastIndex = n
      }
    }
  }
}