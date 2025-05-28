export default class Post {
  constructor({  title = '', body = '', userId = null, themePostId = 1,likes = 0, dislikes = 0, createdAt = Date.now() } = {}) {
    this.title = title
    this.body = body
    this.themePostId = themePostId
    this.userId = userId
    this.likes = likes
    this.dislikes = dislikes
    this.createdAt = createdAt
  }

  static fromJson(data) {
    return new Post(data)
  }
}
