class Post {
  id
  userId
  created
  lastUpdated
  title
  content
  tags

  constructor(data) {
    this.id = data.id
    this.created = data.created
    this.lastUpdated = data.lastUpdated
    this.title = data.title
    this.content = data.content
    this.userId = data.userId
    this.tags = data.tags || []
  }

  get patchData() {
    return {
      Title: this.title,
      Content: this.content,
      Tags: this.tags.map(t => ({ Id: t.id, Name: t.name })),
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
