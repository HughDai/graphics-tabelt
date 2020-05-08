export const Vec2 = {
  add: function (p1, p2) {
      return {x: p1.x + p2.x, y: p1.y + p2.y}
  },
  sub: function (p1, p2) {
      return {x: p1.x - p2.x, y: p1.y - p2.y}
  },
  nor: function (p) {
      var len = Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2))
      return {x: p.x / len, y: p.y / len}
  },
  len: function (p) {
      return Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2))
  },
  dist: function (p1, p2) {
      return BV.Vec2.len(BV.Vec2.sub(p1, p2))
  },
  mul: function (p, s) {
      return {x: p.x * s, y: p.y * s}
  },
  angle: function (p1, p2) {
      return Math.atan2(p2.y - p1.y, p2.x - p1.x)
  }
}
