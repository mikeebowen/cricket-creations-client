import { sanitize } from 'dompurify'

class BlogPost {
  id
  userId
  created
  lastUpdated
  title
  content
  tags
  published
  image

  constructor(data) {
    this.id = data.id
    this.created = data.created
    this.lastUpdated = data.lastUpdated
    this.title = data.title
    this.content = sanitize(data.content)
    this.tags = data.tags || []
    this.published = !!data.published
    this.image = data.image || ''
  }

  get data() {
    return {
      Title: this.title,
      Content: this.content,
      Published: this.published,
      Tags: this.tags.map(t => ({ Id: t.id, Name: t.name })),
      Image: this.image,
    }
  }

  get patchData() {
    return {
      Id: this.id,
      ...this.data,
    }
  }
}

export default BlogPost
