<template>
<div class="music-list">
	<div class="back">
		<i class="icon-back"></i>
	</div>
	<h1 class="title" v-html="title"></h1>
	<div class="bg-image" ref="bgImage">
		<div class="filter"></div>
	</div>
	<scroll class="list" :data="songs">
		<ul>
			<li></li>
		</ul>
	</scroll>
</div>

</template>

<script>
import Scroll from 'base/scroll/scroll'
export default {
	props:{
		songs:{
			type:Array,
			default:[]
		},
		bgImage:{
			type:String,
			default:''
		},
		title:{
			type:String,
			default:''
		}
	},
	components:{
		Scroll
	}
}
</script>

<style>
.music-list{
	position: fixed;
	z-index: 100;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background:#222;
}
.music-list .back{
	position: absolute;
	top: 0;
	left: 6px;
	z-index: 50;
}
.music-list .back .icon-back{
	display: block;
	font-size: 22px;
	padding: 6px;
	color: #ffcd32;
}
.music-list .title{
	position: absolute;
	top: 0;
	left: 10%;
	width: 80%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: center;
	font-size: 18px;
	line-height: 40px;
	color: #FFFFFF;
}
.music-list .bg-image{
	position: relative;
	width: 100%;
	height: 0;
	padding: 70%;
	transform-origin: top;
	background-size: cover;
}
.music-list .bg-image .filter{
	position: absolute;
	top: 0;
	left: 0;
	width: 100;
	height: 100%;
	background: rgba(7, 17, 27, 0.4);
}
.music-list .list{
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	background:#222;
}





















</style>