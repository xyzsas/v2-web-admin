<template>
  <div style="min-width: 650px; max-width: 800px;">
    <h1 class="title is-4" style="margin-bottom: 5px;">添加事务数据</h1>
    <input class="input is-small" type="text" v-model="name" placeholder="数据名称，请输入英文">
    <textarea class="textarea has-fixed-size is-small mt-3 mb-3" rows="3" v-model="input" placeholder="从Excel中复制的事务信息，包括表头" :disabled="loading"></textarea>
    <p v-if="error" class="tag is-danger is-light">{{ error }}</p>
    <button class="button is-primary is-small" :class="{ 'is-loading': loading }" @click="submit">提交</button>
  </div>
</template>
<script setup>
import { computed, defineProps, defineEmit } from 'vue'
import axios from '../../plugins/axios.js'
import { token } from '../../plugins/state.js'

const props = defineProps(['id'])
const emits = defineEmit(['update'])

ref: input = ''
ref: loading = false
ref: error = ''
ref: name = ''

const display = computed (() => {
  const res = {}
  error = ''
  const rows = input.split('\n')
  const labels = rows[0].split('\t')
  if (labels.length < 2) {
    error = '数据格式错误, 需要至少两列'
    return false
  }
  for (const r of rows) {
    const info = r.split('\t')
    const id = info[0].toUpperCase()
    if (info.length === 2) res[id] = info[1]
    else {
      const val = {}
      for (let i = 1; i < labels.length; i++)
        val[labels[i]] = info[i]
      res[id] = JSON.stringify(val)
    }
  }
  delete res[labels[0]]
  return res
})

async function submit () {
  if (!name) {
    error = '请输入名称'
    return
  }
  if (!display.value || display.value.length < 1) {
    error = '缺少数据'
    return
  }
  loading = true
  const res = await axios.post(`/data/${props.id}$${name}`, display.value, token())
    .then(() => true)
    .catch(e => {
      Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
      return false
    })
  loading = false

  if (!res) return
  Swal.fire('上传成功', 'success')
  emits('update', `$${name}`)
}

</script>

<style scoped>
</style>
