<template>
  <div class="nav-wrapper flex-col">
    <el-menu :default-active="onRoutes" class="width_1000" router mode="horizontal" @select="handleSelect">
      <template v-for="item in newRouter[0].children">
      
      <template v-if="item.subs">
        <el-submenu :index="item.meta.index" :key="item.meta.index">
          <template slot="title">
            <span slot="title">{{ item.meta.title }}</span>
          </template>
          <el-menu-item v-for="(subItem,i) in item.subs" :index="subItem.index" :key="i">
            {{ subItem.title }}
          </el-menu-item>
        </el-submenu>
      </template>

      <template v-else-if="item.meta.title">
        <el-menu-item :index="item.path" :key="item.meta.index">
          <span slot="title">
            {{ item.meta.title }}
          </span>
        </el-menu-item>
      </template>
    </template> 
    </el-menu>  
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
      
		}
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    },
    ...mapGetters([
      'newRouter'
    ])
  },
	methods: {
		handleSelect(key, keyPath) {
			// console.log(key, keyPath);
		}
  }
}
</script>

<style scoped>
.nav-wrapper {
  width: 100%;
  box-shadow: 0 4px 5px -3px #eee; 
}
</style>
<style>
.nav-wrapper .el-menu.el-menu--horizontal {
  border-bottom: none;
}
</style>

