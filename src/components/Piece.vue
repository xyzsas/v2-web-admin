<template>
  <div :piece-start="props.id || ''" contenteditable="false" class="piece box m-2 p-2 is-light is-primary">
    <div class="is-flex">
      <img style="width: 20px;" src="/img/logo.svg" class="mr-2">
      <p v-if="!id" style="color: red; font-size: 0.6rem;">此组件缺少id<br>下次渲染将自动删除</p>
      <p v-else class="subtitle is-5">组件 <code>{{ props.id }}</code></p>
    </div>
    <div piece-end></div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps(['id'])
ref: id = props.id
</script>

<style scoped>
div.piece {
  display: inline-block;
  cursor: pointer;
}
</style>
