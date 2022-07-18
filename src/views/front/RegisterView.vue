<template lang="pug">
v-row#register
  v-col(cols='12')
    h1.text-center 註冊
  v-divider
  v-col(cols='12')
    v-form(v-model='valid' @submit.prevent='register')
      //- 用rules做驗證 用couter跟maxlength做長度限制
      v-text-field(
        type='email'
        label='信箱'
        v-model='form.email'
        :rules='rules.email'
      )
      v-text-field(
        type='text'
        label='帳號'
        v-model='form.account'
        :rules='rules.account'
        counter='20'
        maxlength="20"
      )
      v-text-field(
        type='password'
        label='密碼'
        v-model='form.password'
        :rules='rules.password'
        counter='20'
        maxlength="20"
      )
      //- +loading讓他送出時有再轉的那個效果
      v-btn.mx-auto(color='success' type='submit' :loading='loading') 註冊
</template>

<script setup>
import { reactive, ref } from 'vue'
import { isEmail } from 'validator'
// 本來是 import axios from 'axios' 去新增一個axios修改他的參數 這樣後面的code比較短
import { api } from '@/plugins/axios'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const valid = ref(false)
const loading = ref(false)

const form = reactive({
  email: '',
  account: '',
  password: ''
})

// 用validator的isEmail來做信箱驗證
// 這邊寫驗證規則
const rules = reactive({
  email: [
    v => !!v || '信箱必填',
    v => isEmail(v) || '信箱格式錯誤'
  ],
  account: [
    v => !!v || '帳號必填',
    v => (v.length >= 4 && v.length <= 20) || '帳號長度為 4 到 20 個字',
    v => /^[a-zA-Z0-9]+$/.test(v) || '帳號只能由英數字組成'
  ],
  password: [
    v => !!v || '密碼必填',
    v => (v.length >= 4 && v.length <= 20) || '密碼長度為 4 到 20 個字',
    v => /^[a-zA-Z0-9]+$/.test(v) || '密碼只能由英數字組成'
  ]
})

const register = async () => {
  if (!valid.value) return
  loading.value = true
  try {
    // 如果這邊env有斜線就不用加斜線 這段本來要寫很長 因為修改了參數讓他變短
    // 這邊的api因為有axios的修改 是後端的網址
    await api.post('/users', form)
    await Swal.fire({
      icon: 'success',
      title: '成功',
      text: '註冊成功'
    })
    router.push('/')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: (error.isAxiosError && error.response.data) ? error.response.data.message : '發生錯誤'
    })
  }
  loading.value = false
}
</script>
