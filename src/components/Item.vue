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
    <button v-if="props.type == 'user' && !set" class="button is-small is-warning" :class="{ 'is-loading': loading }" @click.stop="reset">重置密码</button>
    <code class="advanced" v-if="props.type != 'group'">{{ props.id }}</code>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

import axios from '../plugins/axios.js'
const opt = { headers: { token: window.sessionStorage.token } }

const props = defineProps(['type', 'id'])
const icon = computed(() => ({
  user: 'mdi-account',
  group: 'mdi-account-group',
  affair: 'mdi-package-variant-closed'
}[props.type]))

const go = () => {
  const r = `/${props.type}/${encodeURIComponent(props.id)}`
  const left = window.screenLeft > 400 ? window.screenLeft - 380 : 10000
  window.open('./#' + r, r, 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=360,height=600,top=10000,left=' + left)
}

ref: loading = false
ref: set = false
async function reset () {
  loading = true
  await axios.post('/user', { [props.id]: { password: 1 } }, opt)
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
@media (max-width: 400px) {
  .advanced {
    display: none;
  }
}
</style>