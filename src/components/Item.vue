<template>
  <div class="item">
    <span class="icon">
      <i class="mdi mdi-24px" :class="icon"></i>
    </span>
    <div class="content">
      <p style="margin: 1px;">
        <slot></slot>
      </p>
    </div>
    <div class="space">&nbsp;</div>
    <code v-if="props.id">{{ props.id }}</code>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps(['type', 'id'])
const icon = computed(() => ({
  user: 'mdi-account',
  group: 'mdi-account-group',
  affair: 'mdi-package-variant-closed'
}[props.type]))
</script>

<style scoped>
div.item {
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}
div.content {
  margin: 0 10px;
}
div.space {
  flex-grow: 1;
}
code {
  margin: 4px;
  cursor: auto;
}
</style>