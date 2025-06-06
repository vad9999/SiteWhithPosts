export default class Comment {
  constructor({ body = '', postId = null, userId = null, createdAt = Date.now() } = {}) {
    this.body = body
    this.postId = postId
    this.userId = userId,
    this.createdAt = createdAt
  }

  static fromJson(data) {
    return new Comment(data)
  }
}
