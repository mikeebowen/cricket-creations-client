import {Model} from '@vuex-orm/core'
import BlogPost from './BlogPost'

export default class User extends Model {
  static entity = 'users';
  static primaryKey = 'id';
  static fields() {
    return {
      id: this.number(null).nullable(),
      name: {
        first: this.string(null).nullable(),
        last: this.string(null).nullable(),
      },
      email: this.string(null).nullable(),
      avatar: this.string(null).nullable(),
      blogPosts: this.hasMany(BlogPost, 'author_id'),
    }
  }
  static apiConfig = {
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    baseURL: '/',
    dataKey: 'data',
    save: true,
  };

  static fetchById (id) {
    return this.api().get(`/users/${id}`)
  }
}
