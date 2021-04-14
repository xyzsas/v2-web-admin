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

    async function input () {
      const html = document.getElementById('editor').innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<!--(.*?)-->/g, '')
      ctx.emit('update:modelValue', html)
      innerText.value = html
    }

    const h = compile(`<div id="editor" class="content editor" contenteditable="true" @blur="input">${innerText.value}</div>`, { onError })
    return (_ctx, _cache) => h({ input }, _cache)
  }
}
</script>

<style>
div#editor {
  padding: 10px;
}
</style>
