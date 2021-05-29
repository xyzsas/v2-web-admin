<template>
  <div class="p-4" style="min-width: 360px; flex-grow: 1;">
    <h1 class="title is-4 mb-5" style="margin-bottom: 5px;">用户组</h1>
    <div v-for="i in items" class="is-flex mb-2 is-align-items-center" :style="levelStyle(i)">
      <span class="icon" @click="expand[i.group] = !expand[i.group]">
        <i v-if="expand[i.group]" class="mdi mdi-24px mdi-chevron-down"></i>
        <i v-else class="mdi mdi-24px mdi-chevron-right"></i>
      </span>
      <code>{{ i.group }}</code>
      <button class="button is-small is-light ml-2" @click="select = i.number && i.group">
        <span class="icon">
          <i class="mdi mdi-18px mdi-account"></i>
        </span>
        <b>{{ i.number }}</b>
      </button>
      <button class="button is-small is-light is-danger ml-2" @click="remove(i.group)" :class="{ 'is-loading': removeLoading[i.group] }">
        <span class="icon">
          <i class="mdi mdi-18px mdi-delete"></i>
        </span>
      </button>
    </div>
    <div class="modal" :class="{ 'is-active': select }">
      <div class="modal-background" @click="select = ''"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <div class="title is-6 mb-1">用户组 <code>{{ select }}</code></div>
          <div style="font-size: 0.7rem;">点击对话框外侧关闭</div>
          <item class="mt-2" v-for="(name, u) in userdata[select]" type="user" :id="u">{{ name }}</item>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, defineProps } from 'vue'
import { GS, userdata, token } from '../plugins/state.js'
import axios from '../plugins/axios.js'
import Item from '../components/Item.vue'
const { p } = defineProps(['p'])
const root = p.id
const rootLevel = (root.match(/\//g) || []).length

watch(() => GS.value[root], v => {
  if (!v) setTimeout(window.close, 2000)
})

ref: expand = {}
ref: select = ''

for (const g in GS.value) expand[g] = true

const items = computed(() => {
  const res = []
  let lastClose = '~'
  for (const g in GS.value) {
    if (g.indexOf(root) || !g.indexOf(lastClose)) continue
    res.push({
      group: g,
      number: userdata.value[g] ? Object.keys(userdata.value[g]).length : 0,
      level: (g.match(/\//g) || []).length - rootLevel
    })
    if (!expand[g]) lastClose = g
  }
  return res
})

const levelStyle = i => `margin-left: ${i.level * 18}px;`

ref: removeLoading = {}
const remove = async g => {
  const res = await Swal.fire({
    title: '危险操作',
    html: `删除用户组<code>${g}</code>?<br>子用户组和用户都会被删除`,
    icon: 'warning',
    focusCancel: true,
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消'
  })
  if (!res.isConfirmed) return
  removeLoading[g] = true
  await axios.delete('/user/?group=' + g, token())
    .then(({ data }) => {
      Swal.fire('成功', data, 'success')
      // clean local data
      for (const gr in userdata.value) {
        if (!gr.indexOf(g)) delete userdata.value[gr]
      }
    })
    .catch(e => { Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error') })
  delete removeLoading[g]
}
</script>
