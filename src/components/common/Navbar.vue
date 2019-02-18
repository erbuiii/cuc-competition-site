<template>
  <div class="flexbox col">
    <div class="nav-wrapper width_1000">
      <el-menu :default-active="onRoutes" class="el-menu-demo" router mode="horizontal" @select="handleSelect">
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

				<template v-else>
					<el-menu-item :index="item.meta.index" :key="item.meta.index">
						<span slot="title">
							{{ item.meta.title }}
						</span>
					</el-menu-item>
				</template>
			</template> 
        <!-- <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">新闻动态</el-menu-item>
        <el-submenu index="3">
          <template slot="title">竞赛信息</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu> -->
      </el-menu>  
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
			console.log(key, keyPath);
		}
  }
}
</script>

<style scoped>

</style>
<style>

</style>

