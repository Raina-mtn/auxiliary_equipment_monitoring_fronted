<script setup lang="ts">
import { reactive, ref, watch, } from 'vue'
import { userStore } from '@/store/index'
import { router } from "@/router";
const useUserStore = userStore();



// 获取所有路由
const { routes } = useUserStore.route.auth
const navItems = reactive(routes)
const currentRoute = ref({})
const rootRoute = ref({
  path: ''
})
const secoundRouters = ref([])

watch(
  () => router.currentRoute.value,
  (val) => {
    setRoute(val)
    // switchFirst(navItems[0])
  },
)

const setRoute = (route: { path: string }) => {
  const root = navItems.find(item => route.path.includes(item.path))
  currentRoute.value = route
  // rootRoute.value = root;
  if (root?.children && root.children.length > 0) {
    // root.children = root.children.filter((item) => {
    //   return !item.hidden
    // })
    secoundRouters.value = root.children.filter((item) => {
      return !item.hidden
    })
  } else {
    secoundRouters.value = []
  }
  rootRoute.value = root;
}

setRoute(router.currentRoute.value);

const switchFirst = (item: { children: any[], path: string }) => {
  const { children, path: firstPath } = item
  if (children && children.length > 0) {
    const { path: secondPath } = children[0]
    // console.log(`/${firstPath}/${secondPath}`)
    router.push({ path: `/home/${firstPath}/${secondPath}` })
  } else {
    router.push({ path: `/home/${firstPath}` })
  }
}

const switchSecond = (item: { path: string }) => {
  const { path: secondPath } = item
  const firstPath = rootRoute.value.path
  router.push({ path: `/home/${firstPath}/${secondPath}` })

  // const { children, path: secondPath } = item
  // if (children.length > 0) {
  //     // const { path: secondPath } = children[0]
  //     // console.log(`/${firstPath}/${secondPath}`)
  //     router.push({ path: `/home/${firstPath}/${secondPath}`})
  // }
}
</script>

<template>
  <div class="header-nav">
    <div class="header-nav__first">
      <div
        :class="['nav-first-item', 'max-center', currentRoute.path.includes(item.path) ? 'nav-first-item__active' : '']"
        v-for=" (item, index) in navItems" :key="index" @click="switchFirst(item)">
        <div class="background-img"></div>
        <span class="title">{{ item.label }}</span>
      </div>
    </div>
    <div class="header-nav__second mt-16px">
      <div @click="switchSecond(item)" v-for="(item, index) in secoundRouters" :key="index"
        :class="['nav-second-item', currentRoute.path.includes(item.path) ? 'nav-second-item__active' : '']">{{
          item.label
        }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-nav {
  position: absolute;
  z-index: 100;
  width: calc(100% - 24px * 2);
  display: flex;
  top: 44px;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  &__first {
    width: 100%;
    display: flex;

    .nav-first-item {
      height: 44px;
      width: 160px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      cursor: pointer;

      .title {
        font-size: 20px;
        color: #FFFFFFFF;
        z-index: 2;
        font-weight: 400;
      }

      .background-img {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url(@/assets/images/header_nav_first.png);
        background-size: cover;
        z-index: 0;
        margin-left: -15px;
      }

      &:nth-child(6) {
        margin-left: 5 * 160px
      }

      &:nth-child(n + 6) {
        .background-img {
          transform: scaleX(-1);
          margin-left: 0;
          margin-right: -15px;
        }
      }
    }

    .nav-first-item__active {
      .background-img {
        background-image: url(@/assets/images/header_nav_first_selected.png);
      }

      .title {
        color: #0AF0FD;
        font-weight: 600;
      }
    }
  }

  &__second {
    width: 100%;
    display: flex;
    justify-content: center;

    .nav-second-item {
      height: 26px;
      background-image: url(@/assets/images/header_nav_second.png);
      min-width: 126px;
      width: fit-content;
      background-size: 100% 14px;
      background-repeat: no-repeat;
      background-position: bottom center;
      color: #FFFFFFCC;
      font-size: 16px;
      font-weight: 400;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 8px;

      &__active {
        color: #0AF0FD;
        font-weight: 600;
        background-image: url(@/assets/images/header_nav_second_selected.png);
      }
    }
  }


}
</style>