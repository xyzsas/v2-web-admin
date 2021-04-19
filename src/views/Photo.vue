<template>
  <div class="p-4" style="min-width: 650px; max-width: 800px;">
    <h1 class="title is-4" style="margin-bottom: 5px;">批量下载用户照片</h1>
    <label class="label mt-2">用户组：</label>
    <group-selector v-model="groups"></group-selector>
    <div class="panel-block buttons" style="margin: 0;">
      <button class="button" @click="batch()" :disabled="!groups" style="width: 100px;">
        <img src="/img/logo.svg" style="width: 30px;" v-if="loading.batch"/>
        <span v-else>照片预览</span>
      </button>
      <button class="button" @click="download()" :disabled="!groups" style="width: 100px;">
        <img src="/img/logo.svg" style="width: 30px;" v-if="loading.download"/>
        <span v-else>下载照片</span>
      </button>
    </div>
    <div style="width: 100%;">
      <div v-for="p in photos" :key="p" style="margin: 10px; display: inline-block;">
        <img :src="p[2]" onerror="this.src = '/img/logo.svg'" alt="照片" width="130" height="182" style="object-position: center;">
        <h3>{{ p[0] }}</h3>
      </div>
    </div>
  </div>
</template>
<script setup>
import GroupSelector from '../components/GroupSelector.vue'
import Loading from '../components/Loading.vue'
import axios from '../plugins/axios.js'
import { GS, US, token } from '../plugins/state.js'
import { getUrl } from '../plugins/convention.js'
import JSZip from "jszip"
import FileSaver from "file-saver"

ref: groups = []
ref: photos = {}
ref: loading = { batch: false, download: false}
ref: displayGroups = []

for (const g in GS.value) {
  groups.push(g)
}
groups = groups.join(',')

async function getPhotos() {
  photos = []
  for (const g of groups.split(',')) {
    const { data } = await axios.get('/store/photo/?group=' + g, token())
    for (const u in data.data) {
      photos[u] = US.value[u]
      photos[u].push(getUrl(`photo/${u}`, data.data[u], data.template))
    }
  }
}
async function batch() {
  loading.batch = true
  displayGroups = groups
  await getPhotos()
  loading.batch = false
}

//获取文件blob
function getImgArrayBuffer(url) {
  return new Promise((resolve, reject) => {
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.open("GET", url, true)
    xmlhttp.responseType = "blob"
    xmlhttp.onload = function() {
      if (this.status == 200) {
        resolve(this.response)
      } else {
        reject(this.status)
      }
    }
    xmlhttp.send()
  })
}

async function download() {
  loading.download = true
  if (displayGroups !== groups) await getPhotos()
  let zip = new JSZip()
  let cache = {}
  let promises = []
  const filename = "photo"

  for (const i in photos) {
    const item = photos[i]
    const promise = getImgArrayBuffer(item[2]).then(data => {
      // 下载文件, 并存成ArrayBuffer对象(blob)
      zip.file(item[0] + '.jpg', data, { binary: true }) // 逐个添加文件
      cache[item[0]] = data
    })
    promises.push(promise)
  }
  Promise.all(promises)
    .then(() => {
      zip.generateAsync({ type: "blob" }).then(content => {
        // 生成二进制流
        FileSaver.saveAs(content, filename) // 利用file-saver保存文件  自定义文件名
      })
    })
    .catch((err) => {
      swal.fire("文件压缩失败", '', 'error')
    })
  loading.download = false
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
