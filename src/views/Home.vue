<template>
  <div class="container">
    <h1 class="title is-spaced">您好，管理员{{ SS.name }}</h1>
    <p class="subtitle is-6">用户组：<code>{{SS.group}}</code></p>
    <nav class="panel">
      <p class="panel-heading">
        <span class="icon is-left">
          <i class="mdi mdi-24px mdi-magnify"></i>
        </span>
        全局搜索
      </p>
      <div class="panel-block">
        <input class="input is-primary" type="text" v-model="query" placeholder="事务，姓名，用户名，用户组 ...">
      </div>
    </nav>
    <nav class="panel">
      <p class="panel-heading">
        <span class="icon">
          <i class="mdi mdi-24px mdi-account"></i>
        </span>
        用户管理
      </p>
      <div class="panel-block buttons" style="margin: 0;">
        <button class="button is-primary">用户组</button>
        <button class="button">添加用户</button>
        <button class="button">...</button>
      </div>
      <div class="panel-block">备注：用户默认密码为<code>XYZSAS</code></div>
    </nav>
    <nav class="panel">
      <p class="panel-heading">
        <span class="icon">
          <i class="mdi mdi-24px mdi-package-variant-closed"></i>
        </span>
        事务管理
      </p>
      <div class="panel-block dense">
        <item type="affair" id="test" title="一个事务" class="panel-block"></item>
      </div>
      <div class="panel-block dense">
        <item type="affair" title="两个事务" class="panel-block"></item>
      </div>
    </nav>
  </div>
</template>

<script setup>
import Item from '../components/Item.vue'

const SS = window.sessionStorage
if (!SS.token) window.location.href = '/#/login?c=/admin/'
else if (SS.role != 'ADMIN') window.location.href = '/#/'

ref: query
</script>

<style scoped>
div.container {
  padding: 5%;
}
.dense {
  margin: 0;
  padding: 0;
}
</style>