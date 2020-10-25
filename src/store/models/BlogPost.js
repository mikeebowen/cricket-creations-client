import { Model } from '@vuex-orm/core'
import { map } from 'lodash'

export default class BlogPost extends Model {
  static entity = 'blogPosts'
  static primaryKey = 'id'

  static fields() {
    return {
      id: this.attr(null).nullable(),
      userId: this.attr(null).nullable(),
      created: this.attr(null).nullable(),
      lastUpdated: this.attr(null).nullable(),
      title: this.string(''),
      content: this.string(''),
      image: this.attr(null).nullable(),
    }
  }

  static apiConfig = {
    headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
    baseURL: '/',
    dataKey: 'data',
    save: true,
  }

  static fetch(config) {
    return this.api().get('/api/blogpost', {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      baseURL: '/',
      // dataKey: 'data',
      save: true,
      dataTransformer: ({ data: { data } }) => {
        const res = map(data, x => {
          return x
        })
        return res
      },
    })
  }
}
