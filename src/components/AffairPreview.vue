<template>
  <div class="preview box tile is-child">
    <h1 class="title">{{ a.title }}<span class="tag is-info is-light">预览</span></h1>
    <p>Under development</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps(['affair'])
const a = props.affair
</script>

<style scoped>
.preview {
  border: none;
  outline: none;
  position: relative;
}
span.tag {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
