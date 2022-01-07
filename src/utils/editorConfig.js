import store from '../store/store'
import refreshCredentials from './refreshCredentials'

export default {
  height: 750,
  // menubar: false,
  plugins: ['link', 'table', 'spellchecker', 'image', 'imagetools', 'save', 'lists', 'imagetools', 'codesample', 'code '],
  toolbar:
    'insertfile undo redo | code | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image codesample',
  menubar: 'file edit insert view format table tools image',
  browser_spellcheck: true,
  codesample_languages: [
    { text: 'HTML/XML', value: 'markup' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'CSS', value: 'css' },
    { text: 'PHP', value: 'php' },
    { text: 'Ruby', value: 'ruby' },
    { text: 'Python', value: 'python' },
    { text: 'Java', value: 'java' },
    { text: 'C', value: 'c' },
    { text: 'C#', value: 'csharp' },
    { text: 'C++', value: 'cpp' },
  ],
  relative_urls: false,
  remove_script_host: false,
  convert_urls: true,
  paste_data_images: true,
  block_unsupported_drop: true,
  automatic_uploads: true,
  async images_upload_handler(blobInfo, success, failure, progress) {
    await refreshCredentials()

    const xhr = new XMLHttpRequest()

    xhr.withCredentials = true
    xhr.open('POST', '/api/image', true)
    xhr.setRequestHeader('Authorization', 'Bearer ' + store.state?.user?.user?.token)

    xhr.upload.onprogress = function (e) {
      progress((e.loaded / e.total) * 100)
    }

    xhr.onload = function () {
      if (xhr.status === 403) {
        failure('HTTP Error: ' + xhr.status, { remove: true })
        return
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        failure('HTTP Error: ' + xhr.status)
        return
      }

      const json = JSON.parse(xhr.responseText)

      if (!json || typeof json.location !== 'string') {
        failure('Invalid JSON: ' + xhr.responseText)
        return
      }

      success(json.location)
    }

    xhr.onerror = function () {
      failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status)
    }

    const formData = new FormData()
    formData.append('file', blobInfo.blob(), blobInfo.filename())

    xhr.send(formData)
  },
}
