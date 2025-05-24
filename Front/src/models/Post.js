export default class Post {
  constructor({ id = null, title = '', body = '', userId = null, likes = 0, dislikes = 0 } = {}) {
    this.id = id
    this.title = title
    this.body = body
    this.userId = userId
    this.likes = likes
    this.dislikes = dislikes
  }

  static fromJson(data) {
    return new Post(data)
  }
}
