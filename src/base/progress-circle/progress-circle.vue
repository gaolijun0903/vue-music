<template>
<div class="progress-circle">
	<svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
		<circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
		<circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
	</svg>
	<slot></slot>
</div>
</template>

<script>
export default{
	props:{
		radius:{
			type:Number,
			default:100
		},
		percent:{
			type:Number,
			default:0
		}
	},
	data(){
		return {
			dashArray:Math.PI*100
		}
	},
	computed:{
		dashOffset(){
			return (1-this.percent) * this.dashArray
		}
	}
}
</script>

<style>
.progress-circle{
	position: relative;
}	
.progress-circle circle{
	stroke-width: 8px;
	transform-origin: center;
}
.progress-circle circle.progress-background{
	transform:scale(0.9);
	stroke: rgba(255, 205, 49, 0.5);
}
.progress-circle circle.progress-bar{
	transform:scale(0.9) rotate(-90deg);
	stroke: #ffcd32;
}
</style>