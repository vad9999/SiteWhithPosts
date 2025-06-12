export default class User {
  constructor({
    id = null,
    userName = "",
    email = "",
    login = "",
    password = "",
    createdAt = Date.now(),
    updatedAt = Date.now(),
    deletedAt = null,
  } = {}) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.login = login;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static fromJson(data) {
    return new User(data);
  }
}
