import { sanitize } from 'dompurify'

class BlogPost {
  id
  userId
  created
  lastUpdated
  author
  title
  subtitle
  content
  tags
  published
  image

  constructor(data) {
    this.id = data.id
    this.created = data.created
    this.lastUpdated = data.lastUpdated
    this.author = data.author
    this.title = data.title
    this.subtitle = data.subtitle
    this.content = sanitize(data.content)
    this.tags = data.tags || []
    this.published = !!data.published
    this.image = data.image || ''
  }

  get data() {
    return {
      Title: this.title,
      Subtitle: this.subtitle,
      Content: this.content.replaceAll('<img src="', '<img src="/'),
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
