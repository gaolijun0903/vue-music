<template>
<div class="tab">
	<router-link tag="div" class="tab-item" to="/recommend">
		<span class="tab-link">推荐</span>
	</router-link>
	<router-link tag="div" class="tab-item" to="/singer">
		<span class="tab-link">歌手</span>
	</router-link>
	<router-link tag="div" class="tab-item" to="/rank">
		<span class="tab-link">排行</span>
	</router-link>
	<router-link tag="div" class="tab-item" to="/search">
		<span class="tab-link">搜索</span>
	</router-link>
</div>
</template>

<script>
export default{}
</script>

<style>
.tab{
	display: flex;
	height: 44px;
	line-height: 44px;
	font-size: 14;
}
.tab .tab-item{
	flex: 1;
	text-align: center;
}
.tab .tab-item .tab-link{
	padding-bottom: 5px;
	color: rgba(255, 255, 255, 0.5);
}
.tab .tab-item.router-link-active .tab-link{
	color: #ffcd32;
	border-bottom: 2px solid #ffcd32;
}
</style>