export default class User {
  constructor({ id = null, fullName = '', email = '', login = '', password = '', roleId = null, registrationDate = null } = {}) {
    this.id = id
    this.fullName = fullName
    this.email = email
    this.login = login
    this.password = password
    this.roleId = roleId
    this.registrationDate = registrationDate
  }

  static fromJson(data) {
    return new User(data)
  }
}
