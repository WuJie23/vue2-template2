<template>
  <div id="tags-view-container" class="tags-view-container">
    <ScrollPane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link v-for="tag in visitedViews" ref="tag" :key="tag.path" :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" tag="span" class="tags-view-item"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)">
        {{ $t(`route.${tag.meta.i18Key}`) }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </ScrollPane>
    <!-- 鼠标右点击触发tagview删除选项 -->
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <!-- <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li> -->
    </ul>
  </div>
</template>

<script>
// @ts-nocheck

import ScrollPane from "./ScrollPane.vue";
import path from "path";

export default {
  components: {
    ScrollPane,
  },
  data() {
    return {
      selectedTag: {},//右击选中的tag
      visible: false,
      top: 0,
      left: 0,
      affixTags: [], //页面挂载后 初始的固定tag（比如首页）
    };
  },
  computed: {
    visitedViews() {//获取tagsview 渲染
      return this.$store.state.tagsView.visitedViews;
    },
    routes() {
      //拿到用户角色权限的所有路由
      return this.$store.state.permission.routes;
    },
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
      console.log(this.visitedViews,"visitedViews")
    },
    visible(value) {

      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },

  mounted() {
    this.initTags(); //获取固定tag
    this.addTags(); //添加tag
  },
  methods: {
    initTags() {
      //初始化的tag
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes)); //过滤用户所有路由 得到需要初始化固定的tags
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch("tagsView/addVisitedView", tag);//添加tagsView
        }
      }
    },
    filterAffixTags(routes, basePath = "/") {
      let tags = [];
      routes.forEach((route) => {
        //过滤用户所有路由 添加需要固定的tag 用来初始化显示
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path);//获取路由标签的完整路径
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          });
        }
        if (route.children) {
          //如果该条为嵌套路由就递归 再次过滤
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    isAffix(tag) {
      //是否是固定tag
      return tag.meta && tag.meta.affix;
    },
    isActive(route) {
      //是否为选中tag
      return route.path === this.$route.path;
    },

    addTags() {
      //添加tag
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("tagsView/addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag); //tagsview选中时滚动条滚动到标签位置保证标签在可视范围内
            // 当查询不同时，更新
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("tagsView/updateVisitedView", this.$route);
            }
            break;
          }
        }
      });
    },
    openMenu(tag, e) {//右击元素后确定弹出选项框的位置
      const menuMinWidth = 105 //选项框的最小宽度，设置为 105。
      const offsetLeft = this.$el.getBoundingClientRect().left //获取元素相对于视口左边缘的水平距离。
      const offsetWidth = this.$el.offsetWidth // 元素的宽度
      const maxLeft = offsetWidth - menuMinWidth // 左边界
      const left = e.clientX - offsetLeft + 15 // 弹出选项框的左侧位置

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag//右击选中的tag
    },
    closeMenu() {
      this.visible = false;
    },
    handleScroll() {
      this.closeMenu();
    },

    refreshSelectedTag(view) {//清除缓存刷新路由（重定向再进入当前页）
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        console.log(view,"view")
        const { fullPath } = view//当前组件的路由路径
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },

    closeSelectedTag(view) {//右击删除选中的tagview
        this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view)
          }
        })
      },
      toLastView(visitedViews, view) {
        const latestView = visitedViews.slice(-1)[0]//获取最后一个元素
        if (latestView) {
          this.$router.push(latestView.fullPath)//有最后一个元素就跳去最后一个元素
        } else {
          // 现在默认情况是如果没有标签视图则重定向到主页，
          if (view.name === 'Dashboard') {
            // 要重新加载主页
            this.$router.replace({ path: '/redirect' + view.fullPath })
          } else {
            this.$router.push('/')
          }
        }
      },
  },

};
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
