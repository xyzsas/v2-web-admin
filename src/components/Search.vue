<template>
  <nav class="panel">
    <p class="panel-heading">全局搜索</p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input is-primary" type="text" placeholder="Search" v-model="query">
        <span class="icon is-left">
          <i class="mdi mdi-24px mdi-search"></i>
        </span>
      </p>
    </div>
  </nav>
</template>

<script setup>
ref: query
</script>
