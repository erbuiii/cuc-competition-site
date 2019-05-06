<template>
  <div id="app">
		<!-- <v-header></v-header>
		<navbar></navbar>
    <div class="content-wrapper flex-col">
      <div class="content width_1000">
				<transition name="move" mode="out-in">
					<keep-alive> -->
						<router-view></router-view>
					<!-- </keep-alive>
				</transition>
			</div>
    </div>
		<v-footer></v-footer> -->
	</div>
</template>

<script>
import vHeader from '@/components/common/Header';
import vFooter from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
export default {
  name: 'App',
	components: {
    vHeader, vFooter, Navbar
	}
}
</script>

<style scoped>
.main-wrapper {
  width: 100vw;
  min-height: 100vh;
}
.content-wrapper {
  flex: 1;
  padding: 18px 0;
}
</style>