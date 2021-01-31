export default class Page {
  id
  userId
  created
  lastUpdated
  title
  heading
  content

  constructor(data) {
    this.id = data.id
    this.userId = data.userId
    this.created = data.created
    this.lastUpdated = data.lastUpdated
    this.title = data.title
    this.heading = data.heading
    this.content = data.content
  }

  get patchData() {
    return {
      Title: this.title,
      Heading: this.heading,
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
