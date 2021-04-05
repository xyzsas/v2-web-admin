<template>
  <textarea v-model="input"></textarea>
</template>

<script setup>
import { watch } from 'vue'
ref: input = window.initialCode || ''
window.updateCode = c => { input = c }
watch($input, v => {
  if (!window.opener) window.close()
  else window.opener.updateCode(v)
})
</script>

<style scoped>
textarea {
  background-color: #eee;
  font-family: monospace;
  font-weight: bold;
  outline: none;
  border: none;
  width: 100%;
  min-height: 99vh;
}
</style>