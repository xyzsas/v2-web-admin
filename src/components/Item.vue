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
    <button v-if="type == 'user' && !set" class="button is-small is-warning" :class="{ 'is-loading': loading }" @click.stop="reset">重置密码</button>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

import axios from '../plugins/axios.js'
import { token } from '../plugins/state.js'

const { type, id } = defineProps(['type', 'id'])

const icon = computed(() => ({
  user: 'mdi-account',
  group: 'mdi-account-group',
  affair: 'mdi-package-variant-closed'
}[type]))

function go () {
  window.show(type, { id })
}

ref: loading = false
ref: set = false
async function reset () {
  loading = true
  await axios.post('/user/', { [id]: { password: 1 } }, token())
    .then(() => {
      Swal.fire('重置密码成功', '初始密码为XYZSAS', 'success')
      set = true
    })
    .catch(e => { Swal.fire('错误', e.response ? e.response.data : e, 'error') })
  loading = false
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