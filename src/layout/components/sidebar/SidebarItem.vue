<template>
  <!-- 接收index里item数据来渲染侧边栏导航 -->
  <div v-if="!item.hidden">
    <!-- 导航一 -->
    <template
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title"
            :i18Key="onlyOneChild.meta.i18Key" />
        </el-menu-item>
      </app-link>
    </template>


    <!-- <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
          <template slot="title">
            <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
          </template> -->
    <!-- 组件调用自身 渲染侧边栏导航的子项 -->
    <!-- <sidebar-item
            v-for="child in item.children"
            :key="child.path"
            :is-nest="true"
            :item="child"
            :base-path="resolvePath(child.path)"
            class="nest-menu"
          />
        </el-submenu> -->
  </div>
</template>
<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import AppLink from './Link'
import item from './item.vue'
export default {
  name: 'SidebarItem',
  components: {
    AppLink,
    item
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    },
    isNest: {
        type: Boolean,
        default: false
      },
  },
  data() {
    this.onlyOneChild = null
    return {
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          //临时设置（如果只有一个显示的子项，将使用）
          this.onlyOneChild = item
        console.log( this.onlyOneChild," this.onlyOneChild")
          return true
        }
      })

      //当只有一个子路由器时，默认情况下会显示子路由器
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有要显示的子路由器，则显示父路由器
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }

}
</script>