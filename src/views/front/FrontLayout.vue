<template lang="pug">
v-app-bar(color='primary')
  v-app-bar-title 購物網
  template(#append)
    //- 用v-if='!isLogin' v-if='isLogin'來判斷是不是登入跟顯示要的按鈕
    v-btn(v-if='!isLogin' to='/register' prepend-icon='mdi-plus') 註冊
    v-btn(v-if='!isLogin' to='/login' prepend-icon='mdi-login') 登入
    v-btn(v-if='isLogin' to='/cart' prepend-icon='mdi-cart')
      //- v-badge 套件
      v-badge(color='error' dot floating v-if='cart > 0') 購物車
      span(v-else) 購物車
    v-btn(v-if='isLogin' to='/order' prepend-icon='mdi-format-list-bulleted') 訂單
    //- 加上isAdmin 用管理員身分才看的到
    v-btn(v-if='isLogin && isAdmin' to='/admin' prepend-icon='mdi-account') 管理
    v-btn(v-if='isLogin' prepend-icon='mdi-logout' @click='logout') 登出
v-main
  v-container
    router-view
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const { logout } = user
const { isLogin, isAdmin, cart } = storeToRefs(user)
</script>
