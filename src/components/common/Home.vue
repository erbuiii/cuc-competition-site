<template>
	<div>
		<v-header></v-header>
		<navbar></navbar>
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
