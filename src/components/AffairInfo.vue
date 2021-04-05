<template>
  <div class="tile is-ancestor">
    <div class="tile is-6 is-vertical is-parent">
      <div class="tile is-child box">
        <h2 class="title is-5">基本信息</h2>
        <label class="label">标题：</label>
        <input v-model="a.title" class="input is-small">
        <label class="label mt-2">用户组：</label>
        <group-selector v-if="!a.anonymous" v-model="a.groups"></group-selector>
        <label class="checkbox" :style="{ color: a.anonymous ? 'red' : 'black' }">
          <input v-model="a.anonymous" type="checkbox">
          允许匿名访问
        </label>
        <label class="label mt-2">开始时间：</label> 
        <input v-model="a.start" class="input is-small" placeholder="无限制">
        <label class="label mt-2">结束时间：</label> 
        <input v-model="a.end" class="input is-small" placeholder="无限制">
        <label class="label mt-2">允许时长（秒）：</label> 
        <input v-model="a.duration" class="input is-small" placeholder="无限制">
      </div>
      <div class="tile is-child box">
        <h2 class="title is-5">事务数据</h2>
        <item v-for="d in props.data" :id="d" type="data">{{ d.replace(`${a.id}.P:`, '组件 ') }}</item>
      </div>
    </div>
    <div class="tile is-6 is-vertical is-parent">
      <div class="tile is-child box">
        <affair-preset :affair="a"></affair-preset>
      </div>
      <div class="tile is-child box">
        <h2 class="title is-5">事务变量</h2>
        <textarea rows="10" class="yml" v-model="a.variables" placeholder="无变量"></textarea>
        <p style="font-size: 0.7rem;">变量名必须为英文！</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { groups } from '../plugins/state.js'
import Item from '../components/Item.vue'
import AffairPreset from '../components/AffairPreset.vue'
import GroupSelector from '../components/GroupSelector.vue'

const props = defineProps(['affair', 'data'])
const a = props.affair
</script>
