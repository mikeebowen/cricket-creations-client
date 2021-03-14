import store from '../store/store'

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
    this.userId = data.userId
    this.tags = data.tags || []
    this.published = !!data.published
  }

  get patchData() {
    return {
      Title: this.title,
      Content: this.content,
      Published: this.published,
      Tags: this.tags.map(t => ({ Id: t.id, Name: t.name })),
    }
  }

  get postData() {
    return {
      ...this.patchData,
      UserId: parseInt(store.state?.user?.user?.id),
    }
  }
}

export default Post
