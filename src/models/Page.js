import store from '../store/store'

export default class Page {
  id
  userId
  created
  lastUpdated
  title
  name
  content
  heading

  constructor(data) {
    this.id = data.id
    this.userId = data.userId
    this.created = data.created
    this.lastUpdated = data.lastUpdated
    this.title = data.title
    this.name = data.name
    this.content = data.content
    this.heading = data.heading
  }

  get patchData() {
    return {
      Title: this.title,
      Name: this.name,
      Content: this.content,
      Heading: this.heading,
    }
  }

  get postData() {
    return {
      ...this.patchData,
      UserId: parseInt(store.state?.user?.user?.id),
    }
  }
}
