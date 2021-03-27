<template>
  <div class="is-flex" style="min-width: 900px; padding-top: 60px;">
    <div style="position: absolute; top: 10px; left: 15px;">
      <h1 class="title is-4 mb-1">事务 - {{ title }}</h1>
      <code>{{ id }}</code>
    </div>
    <div style="width: 300px;" class="p-4">
      <div class="buttons" v-if="affair">
        <button class="button is-small is-primary" :class="{ 'is-loading': loading }" @click="submit">提交事务信息</button>
        <button class="button is-small is-danger" :class="{ 'is-loading': loading }" @click="remove">删除事务</button>
      </div>
      <affair-info v-if="affair" v-model="affair" :data="data"></affair-info>
    </div>
    <affair-content style="flex-grow: 1;"  v-if="affair" v-model="affair"></affair-content>
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { affairs, token } from '../plugins/state.js'
import axios from '../plugins/axios.js'
import { md5 } from '../plugins/convention.js'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()
import AffairInfo from '../components/AffairInfo.vue'
import AffairContent from '../components/AffairContent.vue'

ref: affair = null
ref: data = null
ref: loading = false
const id = computed(() => route.params.id == 'NEW' ? md5(Math.random()) : route.params.id)
const title = computed(() => route.params.id == 'NEW'
  ? '创建新事务'
  : affair ? affair.title : '正在载入...'
)
watchEffect(() => {
  if (!affair) return
  if (!affair.start) delete affair.start
  if (!affair.end) delete affair.end
  if (!affair.duration) delete affair.duration
  if (!affair.anonymous) delete affair.anonymous
})

const catchErr = async e => {
  console.log(e)
  await Swal.fire('错误', e.response ? e.response.data : e.toString(), 'error')
  window.close()
}

function getAffair () {
  axios.get('/affair?affair=' + id.value, token())
    .then(({ data }) => {
      affair = data
      affair.groups = affair.groups.split(',')
    })
    .catch(catchErr)
  axios.get('/data?affair=' + id.value, token())
    .then(res => { data = res.data })
    .catch(catchErr)
}

if (route.params.id != 'NEW') getAffair()
else affair = {}
</script>