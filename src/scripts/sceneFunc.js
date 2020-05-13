import { Vec2 } from './util'

/**
 * creates bezier curve from control points
 *
 * @param p1 - control point 1 {x: float, y: float}
 * @param p2 - control point 2 {x: float, y: float}
 * @param p3 - control point 3 {x: float, y: float}
 * @param p4 - control point 4 {x: float, y: float}
 * @param resolution - int
 * @returns {Array} - bezier curve made up of points {x: float, y: float}
 */
function getBezierPoints(p1, p2, p3, p4, resolution) {
  var curvePoints = []
  var t, result
  for (var i = 0; i <= resolution; i++) {
      t = i / resolution
      result = {}
      result.x = Math.pow(1 - t, 3) * p1.x + 3 * Math.pow(1 - t, 2) * t * p2.x + 3 * (1 - t) * Math.pow(t, 2) * p3.x + Math.pow(t, 3) * p4.x
      result.y = Math.pow(1 - t, 3) * p1.y + 3 * Math.pow(1 - t, 2) * t * p2.y + 3 * (1 - t) * Math.pow(t, 2) * p3.y + Math.pow(t, 3) * p4.y
      curvePoints[curvePoints.length] = result
  }
  return curvePoints
}

// function 

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
        context.lineTo(points[n], points[n + 1])
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
