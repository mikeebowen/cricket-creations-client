class Post {
  id
  userId
  created
  lastUpdated
  title
  content
  tags
  published

  constructor(data) {
    this.id = data.id
    this.created = data.created
    this.lastUpdated = data.lastUpdated
    this.title = data.title
    this.content = data.content
    this.tags = data.tags || []
    this.published = !!data.published
  }

  get data() {
    return {
      Title: this.title,
      Content: this.content,
      Published: this.published,
      Tags: this.tags.map(t => ({ Id: t.id, Name: t.name })),
    }
  }

  get patchData() {
    return {
      Id: this.id,
      ...this.data,
    }
  }
}

export default Post
