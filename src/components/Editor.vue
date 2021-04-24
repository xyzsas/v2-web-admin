<script>
import { compile, ref } from 'vue'

import { LS, A } from '../plugins/state.js'
import Piece from '../pieces/Piece.vue'
import Mustache from '../pieces/Mustache.vue'

function onError (e) {
  Swal.fire('错误', '事务信息错误', 'error')
  console.error(e)
}

export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  components: {
    Piece, Mustache
  },
  setup: (props, ctx) => {
    const content = ref(props.modelValue)
    const data = {}

    const clean = html => html
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/<!--(.*?)-->/g, '') // clean comment
      .replace(/<span(.*?)>/g, '').replace(/<\/span>/g, '') // clean span

    function recoverPieces (html) { // recover pieces
      const raw = html.match(/<div piece-start="(.*?)"(.*?)<div piece-end=""(.*?)><\/div><\/div>/g)
      if (!raw) return html
      let res = html
      for (const rp of raw) {
        const id = rp.match(/piece-start="(.*?)"/)[1]
        const regex = new RegExp(`<${id}(\\s.*?)?>`)
        const m = content.value.match(regex)
        const p = (m && id[0] == '_') ? m[0] : ''
        res = res.replace(rp, p)
      }
      return res
    }

    function recoverMustache (html) {
      const raw = html.match(/<div mustache-start="(.*?)"(.*?)<div mustache-end=""(.*?)><\/div><\/div>/g)
      if (!raw) return html
      let res = html
      for (const rd of raw) {
        const d = rd.match(/mustache-start="(.*?)"/)[1]
        res = res.replace(rd, `{{ ${d} }}`)
      }
      return res
    }

    function blur () {
      let html = document.getElementById('editor').innerHTML
      html = clean(html)
      html = recoverPieces(html)
      html = recoverMustache(html)
      ctx.emit('update:modelValue', html)
      if (LS.developer) console.log(html)
    }

    function collect () {
      const html = content.value
      // check exist
      for (const p in A.value.pieces) {
        const regex = new RegExp(`<${p}(\\s.*?)?>`)
        if (!html.match(regex)) delete A.value.pieces[p]
      }
      // find all model="_piece"
      const raw = html.match(/model="data\._(.*?)"/g) || []
      for (const rp of raw) {
        const id = rp.substr(12, rp.length - 13)
        A.value.pieces[id] = { T: 'simple' }
      }
    }
    collect()

    function render () {
      let res = clean(content.value)
      res = res.replace(/\{\{/g, '<mustache d="').replace(/\}\}/g, '"/>')
      const raw = res.match(/<_[^\s]*?(\s.*?)?>/g)
      if (!raw) return res
      for (const rp of raw) {
        const id = rp.match(/<(_[^\s]*?)(\s.*?)?>/)[1]
        const piece = rp.replace('<' + id, `<piece id="${id}"`).replace().replace(/>$/, '/>')
        res = res.replace(rp, piece)
      }
      console.log(res)
      return res
    }

    const h = compile(`<div id="editor" class="content editor" contenteditable="true" @blur="blur">${render()}</div>`, { onError })
    
    return (_ctx, _cache) => h({ blur, data }, _cache)
  }
}
</script>

<style>
div#editor {
  outline: none;
}
</style>
