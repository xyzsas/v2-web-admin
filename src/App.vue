<template>
  <router-view></router-view>
</template>

<script setup>
window.localStorage['web-admin-version'] = import.meta.env.VITE_VERSION.substr(0, 7)
console.log('web-admin-version: ' + import.meta.env.VITE_VERSION)
</script>

<style>
.yml {
  background-color: #eee;
  font-family: monospace;
  font-weight: bold;
  outline: none;
  border: none;
  padding: 8px;
  width: 100%;
  font-size: 0.75rem;
}
.yml::placeholder {
  color: #aaa;
}
</style>
