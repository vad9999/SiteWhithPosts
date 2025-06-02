export default class Comment {
  constructor({ body = '', postId = null, userId = null, likes = 0, dislikes = 0 } = {}) {
    this.body = body
    this.postId = postId
    this.userId = userId
    this.likes = likes
    this.dislikes = dislikes
  }

  static fromJson(data) {
    return new Comment(data)
  }
}
