<template>
  <div :piece-start="props.id || ''" contenteditable="false" class="box is-flex">
    <img src="/img/logo.svg" class="mr-2">
    <div>
      <h1 class="title is-5">Piece <code>{{ props.id }}</code></h1>
      <p class="subtitle is-6">and it is not contenteditable inside</p>
    </div>
    <div piece-end></div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps(['id'])
</script>
