import {Model} from '@vuex-orm/core';
import {map} from 'lodash';

export default class BlogPost extends Model {
  static  entity = 'blogPosts';
  static primaryKey = 'id';

  static fields() {
    return {
      id: this.attr(null),
      author_id: this.attr(null),
      created: this.attr(null),
      lastUpdated: this.attr(null),
      title: this.string(''),
      article: this.string(''),
      image: this.attr(null),
    };
  }

  static apiConfig = {
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    baseURL: '/',
    dataKey: 'data',
    save: true,
  };

  static fetch(config) {
    return this.api().get('api/articles', {
      dataTransformer: ({data: {data}}) => {
        const res = map(data, (x, i) => {
          x.id = i;
          return x;
        });
        return res;
      },
    });
  }
}
