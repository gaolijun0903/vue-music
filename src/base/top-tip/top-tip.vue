<template>
<transition name="drop">
	<div class="top-tip" v-show="showFlag" @click.stop="hide">
		<slot></slot>
	</div>
</transition>
</template>

<script>
	export default{
		props:{
			delay:{
				type:Number,
				default:2000
			}
		},
		data(){
			return {
				showFlag:false
			}
		},
		methods:{
			show(){
				this.showFlag = true;
				clearTimeout(this.timer);
				this.timer = setTimeout(()=>{
					this.hide();
				},this.delay)
			},
			hide(){
				this.showFlag = false;
			}
		}
	}
</script>

<style>
.top-tip{
	position: fixed;
	top: 0;
	width: 100%;
	background: #666;
	z-index: 500;
}
.top-tip.drop-enter-active, .top-tip.drop-leave-active{
	transition: all .3s;
}
.top-tip.drop-enter, .top-tip.drop-leave-to{
	transform: translate3d(0, -100%, 0);
}
</style>