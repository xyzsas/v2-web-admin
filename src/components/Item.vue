<template>
  <div class="item" @click="go">
    <span class="icon">
      <i class="mdi mdi-24px" :class="icon"></i>
    </span>
    <div class="content">
      <p style="margin: 1px;">
        <slot></slot>
      </p>
    </div>
    <div class="space">&nbsp;</div>
    <code v-if="props.type != 'group'">{{ props.id }}</code>
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

const go = () => {
  const r = `/${props.type}/${encodeURIComponent(props.id)}`
  window.open('./#' + r, r, 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=360,height=600,top=10000,left=10000')
}
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