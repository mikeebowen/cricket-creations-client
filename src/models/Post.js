class Post {
  id
  userId
  created
  lastUpdated
  title
  content

  constructor(data) {
    this.id = data.id
    this.created = data.created
    this.lastUpdated = data.lastUpdated
    this.title = data.title
    this.content = data.content
    this.userId = data.userId
  }

  get patchData() {
    return {
      Title: this.title,
      Content: this.content,
    }
  }

  get postData() {
    return {
      ...this.patchData,
      UserId: 1,
    }
  }
}

export default Post
