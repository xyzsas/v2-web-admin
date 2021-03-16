<template>
  <div class="container">
    <h1 class="title is-spaced">您好，管理员{{ SS.name }}</h1>
    <p class="subtitle is-6">用户组：<code>{{SS.group}}</code></p>
    <search></search>
    <nav class="panel">
      <p class="panel-heading">
        <span class="icon">
          <i class="mdi mdi-24px mdi-account"></i>
        </span>
        用户管理
      </p>
      <div class="panel-block buttons">
        <button class="button is-primary">用户组</button>
        <button class="button">添加用户</button>
        <button class="button">...</button>
      </div>
    </nav>
    <nav class="panel">
      <p class="panel-heading">
        <span class="icon">
          <i class="mdi mdi-24px mdi-package-variant-closed"></i>
        </span>
        事务管理
      </p>
      <item type="affair" id="test" title="一个事务" class="panel-block"></item>
      <item type="affair" title="两个事务" class="panel-block"></item>
    </nav>
  </div>
</template>

<script setup>
import Search from '../components/Search.vue'
import Item from '../components/Item.vue'

const SS = window.sessionStorage
if (!SS.token) window.location.href = '/#/login?c=/admin/'
if (SS.role != 'ADMIN') window.location.href = '/#/'
</script>

<style scoped>
div.container {
  padding: 5%;
}
</style>