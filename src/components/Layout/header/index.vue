<template>
  <div class="header">
    <div class="header-title title" :style="{height: `${height}px`}">
      <div class="header-title__left">
        <div class="left-logo"></div>
      </div>
      <div class="header-title__center text-center">
        220KV新城变辅助设备管控系统
        <img src="~@/assets/images/header_title_bg.png" class="header-title__bg">
      </div>
      <div class="header-title__right">
        {{ username }}<el-icon class="cursor-pointer ml-4" @click="logout" ><SwitchButton /></el-icon>
      </div>
    </div>
    <HeaderNav/>
  </div>
</template>

<script lang="ts">
import HeaderNav from './HeaderNav.vue'
import {defineComponent, watch, ref} from 'vue'
import { SwitchButton } from '@element-plus/icons-vue'
import { useRouter} from 'vue-router'
import { userStore } from '@/store'
import { ElMessageBox as createMessage } from 'element-plus'

export default defineComponent({
    components:{
      HeaderNav,
      SwitchButton
    },
    setup(){
      const router = useRouter()
      let height = ref(115)
      const useUserStore = userStore()
      const username = useUserStore.userInfo.userName
      // 监听当前路由
      watch(
        () => router.currentRoute.value,
        (newValue: any) => {
          if(newValue.path === '/home/index'){
            height.value = 115
          }else{
            height.value = 130
          }
        },
        { immediate: true }
      )

      function logout(){
        createMessage.confirm('确认退出登录吗？', '提示').then(()=>{
          useUserStore.logout()
        })

        
      }

      return {
        height,
        username,
        logout
      }
    }
})


</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  position: relative;
  padding: 0 24px;
  box-sizing: border-box;

  .header-title {
    width: 100%;
    display: flex;
    z-index: 99;
    position: relative;
    min-height: 115px;

    &__center {
      height: 100%;
      background: linear-gradient(180deg, #EAF9FF 0%, #9FC7FF 53%, #0086E5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: bold;
      line-height: 42px;
      letter-spacing: 4px;
      font-size: 36px;
      padding-top: 18px;
      color: #0086E5FF;
      letter-spacing: -2px
    }

    &__bg {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      display: block;
      height: 85px;
      z-index: -1;
      width: 700px;
    }


    &__left,
    &__right {
      flex: 1;
      height: 42px;
      padding-top: 10px;
    }

    &__left {
      .left-logo {
        width: 92px;
        height: 28px;
        background-image: url(@/assets/images/header_logo.png);
        background-size: cover;
      }
    }

    &__right {
      display: flex;
      justify-content: end;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 16px;
      font-size: 14px;
    }
  }


}
</style>
