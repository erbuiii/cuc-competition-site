<template>
	<div>
		<v-header></v-header>
		<navbar></navbar>
    <div class="content-wrapper">
      <div class="content">
				<transition name="move" mode="out-in">
					<keep-alive>
						<router-view></router-view>
					</keep-alive>
				</transition>
			</div>
    </div>
		<v-footer></v-footer>
	</div>
</template>

<script>
import vHeader from './Header';
import vFooter from './Footer';
import Navbar from './Navbar';
export default {
	components: {
    vHeader, vFooter, Navbar
	}
}
</script>

<style scoped>

</style>
