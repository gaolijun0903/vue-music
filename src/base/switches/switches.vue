<template>
	<ul class="switches">
		<li class="item" v-for="(item,index) in switches" :class="{'current':currentIndex===index}" @click="switchItem(index)">
			<span>{{item.text}}</span>
		</li>
	</ul>
</template>

<script>
export default{
	props:{
		switches:{
			type:Array,
			default:[]
		},
		currentIndex:{
			type:Number,
			default:0
		}
	},
	methods:{
		switchItem(index){
			this.$emit('switch',index)
		}
	}
}
</script>

<style>
.switches{
	display: flex;
	align-items: center;
	text-align: center;
	width: 240px;
	margin: 0 auto;
	border: 1px solid #333;
	border-radius: 5px;
}
.switches .item{
	flex: 1;
	padding: 8px;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.3);
}
.switches .item.current{
	color:#fff;
	background: #333;
}
</style>