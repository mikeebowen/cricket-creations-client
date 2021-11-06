export default class Page {
  id
  created
  lastUpdated
  title
  name
  content
  heading

  constructor(data) {
    this.id = data.id
    this.created = data.created
    this.lastUpdated = data.lastUpdated
    this.title = data.title
    this.name = data.name
    this.content = data.content
    this.heading = data.heading
  }

  get data() {
    return {
      Title: this.title,
      Name: this.name,
      Content: this.content,
      Heading: this.heading,
    }
  }
}
