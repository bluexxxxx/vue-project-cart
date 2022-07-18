import { defineStore } from 'pinia'
import { api, apiAuth } from '@/plugins/axios'
import Swal from 'sweetalert2'
// 在 pinia 這樣寫 useRouter() 會是 undefined
// import { useRouter } from 'vue-router'
import router from '@/router'

export const useUserStore = defineStore({
  id: 'user',
  state () {
    return {
      token: '',
      account: '',
      role: 0,
      cart: 0
    }
  },
  getters: {
    isLogin () {
      return this.token.length !== 0
    },
    isAdmin () {
      return this.role === 1
    },
    avatar () {
      return 'https://source.boringavatars.com/beam/120/' + this.account
    }
  },
  actions: {
    // 用loginview的form抓登入
    async login (form) {
      try {
        const { data } = await api.post('/users/login', form)
        this.token = data.result.token
        this.account = data.result.account
        this.role = data.result.role
        this.cart = data.result.cart
        Swal.fire({
          icon: 'success',
          title: '成功',
          text: '登入成功'
        })
        router.push('/')
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '失敗',
          text: (error.isAxiosError && error.response.data) ? error.response.data.message : '發生錯誤'
        })
      }
    },
    async logout () {
      try {
        // 原本要這樣寫 axios那邊寫好攔截了 直接套
        // await api.delete('/users/logout', {
        //   headers: {
        //     authorization: `Bearer ${this.token}`
        //   }
        // })
        await apiAuth.delete('/users/logout')
        router.push('/')
        Swal.fire({
          icon: 'success',
          title: '成功',
          text: '登出成功'
        })
        // 登出不做錯誤處理 一樣讓他登出(都清空)
      } catch (_) {
      }
      this.token = ''
      this.account = ''
      this.role = 0
      this.cart = 0
    },
    async addCart (data) {
      if (this.token.length === 0) {
        Swal.fire({
          icon: 'error',
          title: '失敗',
          text: '請先登入'
        })
        router.push('/login')
        return
      }
      if (data.quantity <= 0) {
        Swal.fire({
          icon: 'error',
          title: '失敗',
          text: '數量必須大於 0'
        })
        return
      }
      try {
        // 解構後重新命名成resData
        const { data: resData } = await apiAuth.post('/users/cart', data)
        this.cart = resData.result
        Swal.fire({
          icon: 'success',
          title: '成功',
          text: '加入購物車成功'
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '失敗',
          text: '加入購物車失敗'
        })
      }
    },
    async updateCart (data) {
      try {
        await apiAuth.patch('/users/cart', data)
        return true
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '失敗',
          text: '更新購物車失敗'
        })
        return false
      }
    },
    async checkout () {
      try {
        // 直接post orders結帳
        await apiAuth.post('/orders')
        this.cart = 0
        Swal.fire({
          icon: 'success',
          title: '成功',
          text: '結帳成功'
        })
        router.push('/order')
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '失敗',
          text: '結帳失敗'
        })
      }
    },
    // 抓後端 controller的 getUser拿 token
    async getUser () {
      if (this.token.length === 0) return
      try {
        const { data } = await apiAuth.get('/users')
        this.account = data.result.account
        this.role = data.result.role
        this.cart = data.result.cart
      } catch (error) {
        this.logout()
      }
    }
  },
  // 改 pinia+這個把token存在LocalStorage
  // 再把 token放到App.vue(最外層)
  persist: {
    key: 'vite-shop',
    paths: ['token']
  }
})
