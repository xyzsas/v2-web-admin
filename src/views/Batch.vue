<template>
  <textarea class="textarea" v-model="input"></textarea>
</template>

<script setup>
import { watchEffect } from 'vue'

ref: input = ''

watchEffect(() => {
  const rows = input.split('\n')
  for (const r of rows) console.log(r.split('\t'))
})
</script>