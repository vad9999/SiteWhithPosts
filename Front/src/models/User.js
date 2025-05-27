export default class User {
  constructor({ userName = '', email = '', login = '', password = '' } = {}) {
    this.userName = userName
    this.email = email
    this.login = login
    this.password = password
  }

  static fromJson(data) {
    return new User(data)
  }
}
