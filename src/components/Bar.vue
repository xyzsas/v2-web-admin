<template>
  <nav class="navbar is-flex is-justify-content-space-between is-fixed-top is-align-items-center p-0 box" style="height: 3.25rem;" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item" style="cursor: pointer;" @click="home">
        <img src="/img/logo.svg" alt="logo">
        <h1 class="title">XYZSAS</h1>
      </div>
    </div>
    <div class="buttons m-0">
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
import { U } from '../plugins/state.js'

function home () {
  window.show('home')
}
</script>