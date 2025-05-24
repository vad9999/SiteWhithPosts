export default class Role {
  constructor({ id = null, name = '' } = {}) {
    this.id = id
    this.name = name
  }

  static fromJson(data) {
    return new Role(data)
  }
}
