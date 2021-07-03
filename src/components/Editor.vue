<script>
import { compile, ref } from 'vue'

import { LS, A } from '../plugins/state.js'
import Mustache from './Mustache.vue'

function onError (e) {
  Swal.fire('错误', '事务信息错误', 'error')
  console.error(e)
}

export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  components: {
    Mustache
  },
  setup: (props, ctx) => {
    const content = ref(props.modelValue)
    const data = {}

    const clean = html => html
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/<!--(.*?)-->/g, '') // clean comment
      .replace(/<span(.*?)>/g, '').replace(/<\/span>/g, '') // clean span

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
      html = recoverMustache(html)
      ctx.emit('update:modelValue', html)
      if (LS.developer) console.log(html)
    }

    function collect () {
      const html = content.value
      // find all model="_piece"
      const pieces = {}
      let raw = html.match(/model="data\._(.*?)"/g) || []
      for (const rp of raw) {
        const id = rp.substr(12, rp.length - 13)
        pieces[id] = 1
      }
      raw = html.match(/model="data\['_(.*?)'\]"/g) || []
      for (const rp of raw) {
        const id = rp.substr(13, rp.length - 16)
        pieces[id] = 1
      }
      for (const id in A.value.pieces) {
        if (!pieces[id]) delete A.value.pieces[id]
      }
      for (const id in pieces) {
        if (!A.value.pieces[id]) A.value.pieces[id] = 'simple'
      }
    }
    collect()

    function render () {
      let res = clean(content.value)
      res = res.replace(/\{\{/g, '<mustache d="').replace(/\}\}/g, '"/>')
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
