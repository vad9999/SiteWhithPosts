export default class Comment {
  constructor({ id = null, body = '', postId = null, userId = null, date = null, likes = 0, dislikes = 0 } = {}) {
    this.id = id
    this.body = body
    this.postId = postId
    this.userId = userId
    this.date = date
    this.likes = likes
    this.dislikes = dislikes
  }

  static fromJson(data) {
    return new Comment(data)
  }
}
