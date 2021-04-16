import { ref, computed, watch, watchEffect } from 'vue'

export const SS = window.sessionStorage
export const LS = window.localStorage
export const PS = ref({})
export const token = () => ({ headers: { token: SS.token } })

export const userdata = ref({})
export const affairs = ref({})

// computed
export const users = computed(() => {
  const res = {}
  for (const g in userdata.value) {
    for (const u in userdata.value[g]) {
      res[u] = [userdata.value[g][u], g]
    }
  }
  return res
})
export const groups = computed(() => {
  if (!SS.group) return {}
  const res = { [SS.group]: 1 }
  for (const g in userdata.value) {
    if (!Object.keys(userdata.value[g]).length) continue
    for (let i = SS.group.length; i < g.length; i++) {
      if (g[i] == '/') res[g.substr(0, i + 1)] = 1
    }
  }
  return res
})

// initialize from cache
userdata.value = LS.userdata ? JSON.parse(LS.userdata) : {}
affairs.value = LS.affairs ? JSON.parse(LS.affairs) : {}

// sync among windows and tabs
watchEffect(() => {
  const s = JSON.stringify(userdata.value)
  if (LS.userdata == s) return
  else LS.userdata = s
  console.log('userdata updated')
})
watchEffect(() => {
  const s = JSON.stringify(affairs.value)
  if (LS.affairs == s) return
  else LS.affairs = s
  console.log('affairs updated')
})

// only called by other window
window.addEventListener('storage', e => {
  if (e.key == 'userdata') userdata.value = JSON.parse(e.newValue)
  if (e.key == 'affairs') affairs.value = JSON.parse(e.newValue)
})
