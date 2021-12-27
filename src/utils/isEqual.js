export default function isEqual(a, b) {
  let eq = true
  if (a === b) {
    return eq
  }
  if ((a === null) !== (b === null)) {
    eq = false
  }
  if (a && b && Object.keys(a).length !== Object.keys(b).length) {
    eq = false
  }
  if (a && b) {
    Object.keys(a).forEach(p => {
      if (!Object.prototype.hasOwnProperty.call(b, p)) {
        eq = false
      }
      if (typeof a[p] !== typeof b[p]) {
        eq = false
      }
      if ((a[p] === null) !== (b[p] === null)) {
        eq = false
      }
      switch (typeof a[p]) {
        case 'undefined':
          if (typeof b[p] !== 'undefined') {
            eq = false
          }
          break
        case 'object':
          if (
            a[p] !== null &&
            b[p] !== null &&
            ((a[p] && a[p].constructor.toString() !== b[p] && b[p].constructor.toString()) || !isEqual(a[p], b[p]))
          ) {
            eq = false
          }
          break
        case 'function':
          if (a[p].toString() !== b[p].toString()) {
            eq = false
          }
          break
        default:
          if (a[p] !== b[p]) {
            eq = false
          }
      }
    })
  }
  return eq
}
