// export default function isEqual(v1, v2) {
//   if (typeof v1 !== typeof v2) {
//     eq = false
//   }

//   if (typeof v1 === 'function') {
//     return v1.toString() === v2.toString()
//   }

//   if (v1 instanceof Object && v2 instanceof Object) {
//     if (Object.keys(v1).length !== Object.keys(v2).length) {
//       eq = false
//     }
//     let r = true
//     Object.keys(v1).forEach(k => {
//       r = isEqual(v1[k], v2[k])
//       if (!r) {
//         eq = false
//       }
//     })
//     return r
//   } else {
//     return v1 === v2
//   }
// }

export default function isEqual(a, b) {
  let eq = true
  if ((a === null) !== (b === null)) eq = false
  if (a && b && Object.keys(a).length !== Object.keys(b).length) {
    eq = false
  }

  if (a && b) {
    Object.keys(a).forEach(p => {
      if (!Object.prototype.hasOwnProperty.call(b, p)) eq = false
      if (typeof a[p] !== typeof b[p]) eq = false
      if ((a[p] === null) !== (b[p] === null)) eq = false
      switch (typeof a[p]) {
        case 'undefined':
          if (typeof b[p] != 'undefined') eq = false
          break
        case 'object':
          if (a[p] !== null && b[p] !== null && (a[p].constructor.toString() !== b[p].constructor.toString() || !isEqual(a[p], b[p])))
            eq = false
          break
        case 'function':
          if (a[p].toString() != b[p].toString()) eq = false
          break
        default:
          if (a[p] !== b[p]) eq = false
      }
    })
  }
  return eq
}
