export default class Post {
  constructor({
    id = null,
    title = "",
    body = "",
    userId = null,
    themePostId = 1,
    createdAt = Date.now(),
  } = {}) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.themePostId = themePostId;
    this.userId = userId;
    this.createdAt = createdAt;
  }

  static fromJson(data) {
    return new Post(data);
  }
}
