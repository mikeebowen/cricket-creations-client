export default class User {
  id
  name
  surname
  email
  avatar
  token
  refreshToken
  expiration

  constructor(options) {
    this.id = options.id
    this.name = options.name
    this.surname = options.surname
    this.email = options.email
    this.avatar = options.avatar
    this.token = options.token
    this.refreshToken = options.refreshToken
    this.expiration = options.expiration
  }
}
