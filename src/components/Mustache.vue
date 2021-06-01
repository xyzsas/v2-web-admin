<template>
  <div :mustache-start="props.d || ''" contenteditable="false" class="is-inline-block box m-1 p-1 pl-2 pr-2">
    <b>{{ props.d }}</b>
    <div mustache-end></div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps(['d'])
</script>
