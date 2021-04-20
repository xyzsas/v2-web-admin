<template>
  <div class="p-4" style="min-width: 650px; max-width: 800px;">
    <h1 class="title is-4" style="margin-bottom: 5px;">批量下载用户照片</h1>
    <label class="label mt-2">用户组：</label>
    <group-selector v-model="groups"></group-selector>
    <div class="panel-block buttons" style="margin: 0;">
      <button class="button" :class=" loading.batch && 'is-loading'" @click="batch" :disabled="!groups">
        照片预览
      </button>
      <button class="button" :class=" loading.download && 'is-loading'" @click="download" :disabled="!groups || groups !== displayGroups">
        下载照片
      </button>
    </div>
    <div style="width: 100%;">
      <div v-for="p in photos" class="m-2 is-inline-block;">
        <img :src="p[2]" alt="无照片" width="130" height="182" style="object-position: center;">
        <p>{{ p[0] }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import JSZip from "jszip"
import FileSaver from "file-saver"
import axios from '../plugins/axios.js'
import { SS, GS, US, token } from '../plugins/state.js'
import { getUrl } from '../plugins/convention.js'
import GroupSelector from '../components/GroupSelector.vue'

ref: groups = SS.group
ref: photos = {}
ref: loading = { batch: false, download: false }
ref: displayGroups = ''
ref: blobs = []

async function getPhotos() {
  photos = {}
  try {
    for (const g of groups.split(',')) {
      const { data } = await axios.get('/store/photo/?group=' + g, token())
      for (const u in data.data) {
        photos[u] = US.value[u] ? JSON.parse(JSON.stringify(US.value[u])): [u, g]
        photos[u].push(getUrl(`photo/${u}`, data.data[u], data.template))
        await axios.get(photos[u][2], { responseType: 'blob' })
         .then( res => {
           blobs.push([res.data, photos[u][0]])
         })
         .catch (err => {})
      }
    }
  } catch {
    swal('拉取照片失败', '', 'error')
  }
}

async function batch() {
  loading.batch = true
  displayGroups = groups
  await getPhotos()
  loading.batch = false
}

async function download() {
  loading.download = true
  let zip = new JSZip()
  const filename = "photo"

  if (!blobs || blobs.length === 0) {
    swal.fire("没有可以下载的文件", '', 'error')
    return
  }
  try {
    for (const b of blobs) {
      zip.file(b[1] + '.png', b[0], { binary: true })
    }
    zip.generateAsync({ type: "blob" }).then(content => {
      FileSaver.saveAs(content, filename)
    })
  } catch {
    swal.fire("文件压缩失败", '', 'error')
  }
  loading.download = false
}
</script>

<style scoped />
