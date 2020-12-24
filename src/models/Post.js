class Post {
  id
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
  }

  get data() {
    return {
      Title: this.title,
      Content: this.content,
    }
  }
}

export default Post
