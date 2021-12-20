import { sanitize } from 'dompurify'

export default class Page {
  id
  created
  lastUpdated
  title
  name
  content
  heading
  published

  constructor(data) {
    this.id = data.id
    this.created = data.created
    this.lastUpdated = data.lastUpdated
    this.title = data.title
    this.content = sanitize(data.content)
    this.heading = data.heading
    this.published = data.published
  }

  get data() {
    return {
      Id: this.id,
      Title: this.title,
      Content: this.content,
      Heading: this.heading,
      Published: this.published,
    }
  }
}
