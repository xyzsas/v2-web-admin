<template>
  <nav class="navbar is-justify-content-space-between mb-2 is-fixed-top pr-3" role="navigation" aria-label="main navigation" style="display: flex;">
    <div class="navbar-brand">
      <div class="navbar-item" @click="emits('home')">
        <img src="/img/logo.svg" alt="logo" height="28">
        <h1 class="title">XYZSAS</h1>
      </div>
    </div>
    <div class="buttons">
      <h2 class="button is-white m-0 pr-1 pl-1">
        <strong>{{ U.name }}</strong>
      </h2>
      <p class="button is-white m-0 pl-1 pr-1">
        用户组：<code>{{ U.group }}</code>
      </p>
    </div>
  </nav>
</template>

<script setup>
import { defineEmit } from 'vue'
import { U } from '../plugins/state.js'

const emits = defineEmit(['home'])

</script>