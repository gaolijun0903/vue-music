<template>
<div class="music-list">
	<div class="back" @click="back">
		<i class="icon-back"></i>
	</div>
	<h1 class="title" v-html="title"></h1>
	<div class="bg-image" ref="bgImage" :style="bgStyle">
		<div class="play-wrapper">
			<div class="play" v-show="songs.length>0" ref="playBtn"  @click="random">
				<i class="icon-play"></i>
				<span class="text">随机播放全部</span>
			</div>
		</div>
		<div class="filter" ref="filter"></div>
	</div>
	<div class="bg-layer" ref="bgLayer"></div>
	<scroll class="list" ref="list" :data="songs" @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll">
		<div class="song-list-wrapper">
			<song-list :songs="songs" @select="selectSong" :rank="rank"></song-list>
		</div>
		<div class="loading-wrapper" v-show="!songs.length">
			<loading></loading>
		</div>
	</scroll>
</div>

</template>

<script>
import Scroll from 'base/scroll/scroll'
import songList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {prefixStyle} from 'common/js/dom'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const TITLE_HEIGHT = 30
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
	mixins:[playlistMixin],
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
		},
		rank:{
			type:Boolean,
			default:false
		}
	},
	data(){
		return {
			scrollY:0
		}
	},
	computed:{
		bgStyle(){
			return `background-image:url(${this.bgImage})`;
		}
	},
	created(){
		this.probeType = 3;
		this.listenScroll = true;
	},
	mounted(){
		this.imageHeight = this.$refs.bgImage.clientHeight;
		this.minTranslateY = -(this.imageHeight-TITLE_HEIGHT);
		this.$refs.list.$el.style.top = `${this.imageHeight}px`; //因为list是scroll组件，所以要用$el获取元素
	},
	methods:{
		handlePlaylist(playlist){
			const bottom = playlist.length>0 ? '60px' : ''
			this.$refs.list.$el.style.bottom = bottom;
			this.$refs.list.refresh()
		},
		scroll(pos){
			this.scrollY = pos.y;
		},
		back(){
			this.$router.back();
		},
		selectSong(song,index){
			this.selectPlay({
				list:this.songs,
				index:index
			})
		},
		random(){
			this.randomPlay({
				list:this.songs
			})
		},
		...mapActions([
			'selectPlay',
			'randomPlay'
		])
	},
	watch:{
		scrollY(newY){
			let zindex = 0;
			let scale = 1;
			let blur = 0;
			let translateY = Math.max(newY,this.minTranslateY);
			this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`;
			
			const percent = Math.abs(newY/this.imageHeight);
			if(newY>0){
				scale = 1 + percent;
				zindex = 10;
			}else{
				blur = Math.min(20*percent, 20);
			}
			this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
			
			if(newY <= this.minTranslateY){
				this.$refs.bgImage.style.paddingTop = 0;
				this.$refs.bgImage.style.height = `${TITLE_HEIGHT}px`;
				this.$refs.playBtn.style.display = 'none';
				zindex = 10
			}else {
				this.$refs.bgImage.style.paddingTop = '70%';
				this.$refs.bgImage.style.height = 0;
				this.$refs.playBtn.style.display = '';
			}
			this.$refs.bgImage.style.zIndex = zindex;
			this.$refs.bgImage.style[transform] = `scale(${scale})`;
		}
	},
	components:{
		Scroll,
		songList,
		Loading
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
.music-list .bg-image .play-wrapper{
	position: absolute;
	bottom: 20px;
	z-index: 50;
	width: 100%;
}
.music-list .bg-image .play-wrapper .play{
	width: 135px;
	padding: 7px 0;
	margin:0 auto;
	border-radius: 100px;
	font-size:0;
	text-align: center;
	color: #ffcd32;
	border: 1px solid #ffcd32;
}
.music-list .bg-image .play-wrapper .play .icon-play{
	display: inline-block;
	vertical-align: middle;
	margin-right: 6px;
	font-size: 16px;	
}
.music-list .bg-image .play-wrapper .play .text{
	display:inline-block;
	vertical-align: middle;
	font-size: 12px;
}
.music-list .bg-image .filter{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
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
.music-list .list .song-list-wrapper{
	padding: 20px 30px;
}
.music-list .list .loading-wrapper{
	position: absolute;
	top: 50%;
	width:100%;
	transform:translateY(-50%);
}




















</style>