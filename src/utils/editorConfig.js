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
  paste_data_images: true,
  block_unsupported_drop: true,
  automatic_uploads: true,
  async images_upload_handler(blobInfo, success, failure, progress) {
    try {
      const mimeType = detectMimeType(blobInfo.base64())

      if (!mimeType) {
        failure(`${blobInfo.name()} is an unsupported file type`)
      } else if (Buffer.from(blobInfo.base64(), 'base64').length > 1000000) {
        failure('File size limit is 1MB')
      } else {
        success(`data:${mimeType};charset=utf-8;base64,${blobInfo.base64()}`)
      }
    } catch (err) {
      failure((err && err.message) || err)
    }
  },
}

function detectMimeType(b64) {
  const signatures = {
    JVBERi0: 'application/pdf',
    R0lGODdh: 'image/gif',
    R0lGODlh: 'image/gif',
    iVBORw0KGgo: 'image/png',
    '/9j/': 'image/jpg',
  }

  for (const s in signatures) {
    if (b64.indexOf(s) === 0) {
      return signatures[s]
    }
  }

  return ''
}
