<template>
  <nav class="navbar is-flex is-justify-content-space-between is-fixed-top is-align-items-center p-0 box" style="height: 3.25rem;" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item" style="cursor: pointer;" @click="home">
        <img src="/img/logo.svg" alt="logo">
        <h1 class="title">XYZSAS</h1>
      </div>
    </div>
    <div style="font-size: 0.8rem; margin-right: 8px;" v-if="U">
      <b>{{ U.name }}</b>&nbsp;<code>{{ U.group }}</code>
    </div>
  </nav>
</template>

<script setup>
import { U } from '../plugins/state.js'

function home () {
  window.show('home')
}
</script>