<template>
Page for group {{ route.params.id }}
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter(), route = useRoute()
</script>
