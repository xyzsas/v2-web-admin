<template>
  <div class="is-flex">
    <textarea style="width: 50%; height: 100%; background-color: #eee;" v-model="test"></textarea>
    <div style="width: 50%;" v-html="test"></div>
  </div>
</template>

<script setup>
import { defineProps, defineEmit } from 'vue'
const props = defineProps(['modelValue'])
const emit  = defineEmit(['update:modelValue'])
ref: test = ''

import('https://xyzsas-data.oss-cn-shanghai.aliyuncs.com/preset/test?Expires=1616827185&OSSAccessKeyId=TMP.3Kj89c8Kf8SMgP6n7hWn5rGwmyuWBgGSvSb4H7zoDTj7BxxgzQPLmwxFVoffq7XGVSxQgNgHS2ES8pSA8Wi1wrmLXC1QD8&Signature=vuXSiNqdNHV%2BUapycAMdd%2FuCI%2Bw%3D').then(console.log)
</script>
