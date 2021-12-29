export default function isBase64(str) {
  if (str === '' || str.trim() === '') {
    return false
  }
  try {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
    let b64

    if (str.includes(',')) {
      b64 = str.split(',')[1]
    } else {
      b64 = str
    }

    return base64regex.test(b64)
  } catch (err) {
    return false
  }
}
