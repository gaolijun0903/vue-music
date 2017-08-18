<template>
	<div class="no-result">
		<div class="no-result-icon"></div>
		<p class="no-result-text" v-html="title"></p>
	</div>
	
</template>

<script>
export default{
	props:{
		title:{
			type:String,
			default:''
		}
	}
}
</script>

<style>
.no-result{
	text-align: center;
}
.no-result .no-result-icon{
	width: 86px;
	height: 90px;
	margin:0 auto;
	background-image:url(no-result@2x.png);
	background-size:86px 90px;
}
.no-result .no-result-text{
	margin-top: 30px;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.3);
}
</style>