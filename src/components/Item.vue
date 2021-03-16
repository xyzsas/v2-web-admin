<template>
  <div class="item">
    <span class="icon">
      <i class="mdi mdi-24px" :class="icon"></i>
    </span>
    <div class="content">
      <p style="margin: 1px;">
        {{ props.title }}
        <code v-if="props.id">{{ props.id }}</code>
      </p>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps(['title', 'type', 'id'])
const icon = computed(() => ({
  user: 'mdi-account',
  group: 'mdi-account-group',
  affair: 'mdi-package-variant-closed'
}[props.type]))
</script>

<style scoped>
div.item {
  display: flex;
  cursor: pointer;
}
div.content {
  margin: 0 10px;
}
code {
  margin-left: 5px;
  cursor: auto;
}
</style>