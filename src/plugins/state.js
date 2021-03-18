import { ref, computed, watch } from 'vue'

export const SS = window.sessionStorage
export const LS = window.localStorage
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
    const gr = userdata.value[g]
    for (let i = SS.group.length; i < gr.length; i++) {
      if (gr[i] == '/') res[group.substr(0, i)] = 1
    }
  }
  return res
})

// initialize from cache
userdata.value = LS.userdata ? JSON.parse(LS.userdata) : {}
affairs.value = LS.affairs ? JSON.parse(LS.affairs) : {}

// sync userdata and affairs across windows
const userdataString = computed(() => JSON.stringify(userdata.value))
const affairsString = computed(() => JSON.stringify(affairs.value))
watch(userdataString, s => {
  if (LS.userdata == s) return 
  else LS.userdata = s
  console.log('userdata updated')
})
watch(affairsString, s => {
  if (LS.affairs == s) return 
  else LS.affairs = s
  console.log('affairs updated')
})

// only called by other window
window.addEventListener('storage', e => {
  if (e.key == 'userdata') userdata.value = JSON.parse(e.newValue)
  if (e.key == 'affairs') affairs.value = JSON.parse(e.newValue)
})
