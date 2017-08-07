<template>
<div class="music-list">
	<div class="back">
		<i class="icon-back"></i>
	</div>
	<h1 class="title" v-html="title"></h1>
	<div class="bg-image" ref="bgImage" :style="bgStyle">
		<div class="filter"></div>
	</div>
	<div class="bg-layer" ref="bgLayer"></div>
	<scroll class="list" ref="list" :data="songs" @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll">
		<div class="song-list-wrapper">
			<song-list :songs="songs"></song-list>
		</div>
	</scroll>
</div>

</template>

<script>
import Scroll from 'base/scroll/scroll'
import songList from 'base/song-list/song-list'
const TITLE_HEIGHT = 30

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
	data(){
		return {
			
			scrollY:0
		}
	},
	computed:{
		bgStyle(){
			return `background-image:url(${this.bgImage})`
		}
	},
	created(){
		this.probeType = 3;
		this.listenScroll = true;
	},
	mounted(){
		this.imageHeight = this.$refs.bgImage.clientHeight;
		this.minTranslateY = -(this.imageHeight-TITLE_HEIGHT);
		this.$refs.list.$el.style.top = `${this.imageHeight}px`;
	},
	methods:{
		scroll(pos){
			this.scrollY = pos.y
		}
	},
	watch:{
		scrollY(newY){
			let zindex = 0;
			let translateY = Math.max(newY,this.minTranslateY);
			this.$refs.bgLayer.style['transform'] = `translate3d(0,${translateY}px,0)`
			this.$refs.bgLayer.style['webkit-transform'] = `translate3d(0,${translateY}px,0)`
			if(newY <= this.minTranslateY){
				this.$refs.bgImage.style.paddingTop = 0;
				this.$refs.bgImage.style.height = `${TITLE_HEIGHT}px`;
				zindex = 10
			}else {
				this.$refs.bgImage.style.paddingTop = '70%';
				this.$refs.bgImage.style.height = 0;
			}
			this.$refs.bgImage.style.zIndex = zindex;
		}
	},
	components:{
		Scroll,
		songList
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
	z-index: 40;
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
	padding-top: 70%;
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
.music-list .bg-layer{
	position: relative;
	height: 100%;
	background: #222;
}
.music-list .list{
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	background:#222;
}





















</style>