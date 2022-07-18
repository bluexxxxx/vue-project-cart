<template lang="pug">
v-app
  router-view
</template>

<script setup>
import { useUserStore } from '@/stores/user'
const user = useUserStore()
user.getUser()
</script>
