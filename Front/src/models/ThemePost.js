export default class ThemePost {
  constructor({ id = null, name = "" } = {}) {
    this.id = id;
    this.name = name;
  }

  static fromJson(data) {
    return new ThemePost(data);
  }
}
