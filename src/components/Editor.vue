<script>
import { compile, ref } from 'vue'

import Piece from './Piece.vue'

function onError (e) {
  Swal.fire('错误', '事务信息错误', 'error')
  console.error(e)
}

export default {
  ref: 'editor',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  components: {
    Piece
  },
  setup: (props, ctx) => {
    const innerText = ref(props.modelValue)
    const data = {}

    const clean = html => html
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/<!--(.*?)-->/g, '') // clean comment
      .replace(/<span(.*?)>/g, '').replace(/<\/span>/g, '') // clean span

    function recover (html) { // recover pieces
      const raw = html.match(/<div piece-start="(.*?)"(.*?)<div piece-end=""(.*?)><\/div><\/div>/g)
      if (!raw) return html
      let res = html
      for (const rp of raw) {
        const id = rp.match(/piece-start="(.*?)"/)[1]
        const regex = new RegExp(`<piece id="${id}"(.*?)/>`)
        const m = innerText.value.match(regex)
        const p = m ? m[0] : ''
        res = res.replace(rp, p)
      }
      return res
    }

    function blur () {
      let html = document.getElementById('editor').innerHTML
      html = clean(html)
      html = recover(html)
      ctx.emit('update:modelValue', html)
      innerText.value = html
    }
    
    const h = compile(`<div id="editor" class="content editor" contenteditable="true" @blur="blur">${innerText.value}</div>`, { onError })
    return (_ctx, _cache) => h({ blur, data }, _cache)
  }
}
</script>

<style>
div#editor {
  outline: none;
}
</style>
