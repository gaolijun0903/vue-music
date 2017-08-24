<template>
<div class="player" v-show="playList.length>0">
	<transition name="normal"
		@enter="enter"
		@after-enter="afterEnter"
		@leave="leave"
		@after-leave="afterLeave">
		<div class="normal-player" v-show="fullScreen">
			<div class="background">
				<img width="100%" height="100%" :src="currentSong.image" />
			</div>
			<div class="top">
				<div class="back" @click="back">
					<i class="icon-back"></i>
				</div>
				<h1 class="title" v-html="currentSong.name"></h1>
				<h2 class="subtitle" v-html="currentSong.singer"></h2>
			</div>
			<div class="middle"
				@touchstart="middleTouchStart"
				@touchmove="middleTouchMove"
				@touchend="middleTouchEnd">
				<div class="middle-l" ref="middleL">
					<div class="cd-wrapper" ref="cdWrapper">
						<div class="cd" :class="cdCls">
							<img class="image" :src="currentSong.image"/>
						</div>
					</div>
					<div class="playing-lyric-wrapper">
						<div class="playing-lyric">{{playingLyric}}</div>
					</div>
				</div>
				<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
					<div class="lyric-wrapper">
						<div v-if="currentLyric">
							<p class="text" 
								:class="{'current':currentLineNum===index}" 
								ref="lyricLine" 
								v-for="(line,index) in currentLyric.lines"
								>{{line.txt}}</p>
						</div>
					</div>
				</scroll>
			</div>
			<div class="bottom">
				<div class="dot-wrapper">
					<span class="dot" :class="{'active':currentShow==='cd'}"></span>
					<span class="dot" :class="{'active':currentShow==='lyric'}"></span>
				</div>
				<div class="progress-wrapper">
					<span class="time time-l">{{_formatTime(currentTime)}}</span>
					<div class="progress-bar-wrapper">
						<progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
					</div>
					<span class="time time-r">{{_formatTime(currentSong.duration)}}</span>
				</div>
				<div class="operators">
					<div class="icon i-left" :class="disableCls">
						<i :class="iconMode" @click="changeMode"></i>
					</div>
					<div class="icon i-left" :class="disableCls">
						<i class="icon-prev" @click="prev"></i>
					</div>
					<div class="icon i-center" :class="disableCls">
						<i :class="playIcon" @click="togglePlay"></i>
					</div>
					<div class="icon i-right" :class="disableCls">
						<i class="icon-next" @click="next"></i>
					</div>
					<div class="icon i-right" :class="disableCls">
						<i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavourite(currentSong)"></i>
					</div>
				</div>
			</div>
		</div>
	</transition>
	<transition name="mini">
		<div class="mini-player" v-show="!fullScreen" @click="open">
			<div class="icon">
				<img :class="cdCls" width="40" height="40" :src="currentSong.image"/>
			</div>
			<div class="text">
				<h2 class="name" v-html="currentSong.name"></h2>
				<p class="desc" v-html="currentSong.singer"></p>
			</div>
			<div class="control">
				<progress-circle :radius="radius" :percent="percent">
					<i class="icon-mini" :class="miniIcon" @click.stop="togglePlay"></i>
				</progress-circle>
			</div>
			<div class="control" @click.stop="showPlaylist">
				<i class="icon-playlist"></i>
			</div>
		</div>
	</transition>
	<playlist ref="playlist"></playlist>
	<audio ref="audio" :src="currentSong.url" @play="songReady" @error="songError" @timeupdate="timeUpdate" @ended="songEnd"></audio>
</div>
</template>

<script>
import animations from 'create-keyframe-animation'
import progressBar from 'base/progress-bar/progress-bar'
import progressCircle from 'base/progress-circle/progress-circle'
import Scroll from 'base/scroll/scroll'
import playlist from 'components/playlist/playlist'
import {mapGetters,mapActions,mapMutations} from 'vuex'
import {prefixStyle} from 'common/js/dom'
import {playMode} from 'common/js/config'
import {playerMixin} from 'common/js/mixin'
import Lyric from 'lyric-parser'

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transitionDuration');

export default{
	mixins:[playerMixin],
	data(){
		return {
			songIsReady:false,
			currentTime:0,
			radius:32,
			currentLyric:null,
			currentLineNum:0,
			currentShow:'cd',
			playingLyric:''
		}
	},
	computed:{
		playIcon(){
			return this.playing ? 'icon-pause' : 'icon-play' ;
		},
		miniIcon(){
			return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
		},
		cdCls(){
			return this.playing ? 'play' : 'pause'
		},
		disableCls(){
			return this.songIsReady ? '' : 'disabled'
		},
		percent(){
			return this.currentTime / this.currentSong.duration;
		},
		...mapGetters([
			'fullScreen',
			'playing',
			'currentIndex'
		])
	},
	created(){
		this.touch = {}
	},
	methods:{
		back(){
			this.setFullScreen(false)
		},
		open(){
			this.setFullScreen(true)
		},
		songReady(){
			this.songIsReady = true;
			this.savePlayHistory(this.currentSong);
		},
		songError(){
			this.songIsReady = true;
		},
		songEnd(){
			if(this.mode === playMode.loop){
				this.loop()
			}else{
				this.next()
			}
		},
		loop(){
			this.$refs.audio.currentTime = 0;
			this.$refs.audio.play();
			if(this.currentLyric){
				this.currentLyric.seek(0);
			}
		},
		timeUpdate(e){
			this.currentTime = e.target.currentTime;
		},
		onProgressBarChange(percent){
			const currentTime = this.currentSong.duration * percent;
			this.$refs.audio.currentTime = currentTime;
			if(!this.playing){
				this.togglePlay();
			}
			if(this.currentLyric){
				this.currentLyric.seek(currentTime*1000);
			}
		},
		togglePlay(){
			if(!this.songIsReady){
				return
			}
			this.setPlayingState(!this.playing);
			if(this.currentLyric){
				this.currentLyric.togglePlay();
			}
		},
		prev(){
			if(!this.songIsReady){
				return
			}
			let index = this.currentIndex - 1;
			if(index === -1){
				index = this.playList.length-1
			}
			this.setCurrentIndex(index);
			if(!this.playing){
				this.togglePlay()
			}
			this.songIsReady = false;
		},
		next(){
			if(!this.songIsReady){
				return
			}
			if(this.playList.length === 1){
				this.loop();
				return
			}else{
				let index = this.currentIndex + 1;
				if(index === this.playList.length){
					index = 0
				}
				this.setCurrentIndex(index);
				if(!this.playing){
					this.togglePlay()
				}
			}
			this.songIsReady = false;
		},
		enter(el,done){
			const {x,y,scale} = this._getPosAndScale();
			let animation = {
				0:{
					transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
				},
				'60%':{
					transform:`translate3d(0,0,0) scale(1.1)`
				},
				'100%':{
					transform:`translate3d(0,0,0) scale(1)`
				}
			}
			animations.registerAnimation({
				name:'move',
				animation,
				presets:{
					duration:400,
					easing:'linear'
				}
			})
			animations.runAnimation(this.$refs.cdWrapper,'move',done);
		},
		afterEnter(el){
			animations.unregisterAnimation('move');
			this.$refs.cdWrapper.style.animation = '';
		},
		leave(el,done){
			const {x,y,scale} = this._getPosAndScale();
			this.$refs.cdWrapper.style.transition = `all 0.4s`;
			this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
			this.$refs.cdWrapper.addEventListener('transitionend',done);
		},
		afterLeave(el){
			this.$refs.cdWrapper.style.transition = '';
			this.$refs.cdWrapper.style[transform] = '';
		},
		getLyric(){
			this.currentSong.getLyric().then((lyric)=>{
				if(this.currentSong.lyric !== lyric){
					return   //保证快速切换时歌词不会乱掉
				}
				this.currentLyric = new Lyric(lyric,this.handleLyric);
				if(this.playing){
					this.currentLyric.play();
				}
			}).catch(()=>{
				this.currentLyric = null;
				this.playingLyric = '';
				this.currentLineNum = 0;
			})
		},
		handleLyric({lineNum,txt}){
			this.currentLineNum = lineNum;
			if(lineNum>5){
				let lineEl = this.$refs.lyricLine[lineNum-5];
				this.$refs.lyricList.scrollToElement(lineEl,800);
			}else{
				this.$refs.lyricList.scrollTo(0,0,800);
			}
			this.playingLyric = txt
		},
		middleTouchStart(e){
			this.touch.initiated = true;
			// 用来判断是否是一次移动
        	this.touch.moved = false
			const touch = e.touches[0];
			this.touch.startX = touch.pageX;
			this.touch.startY = touch.pageY;
		},
		middleTouchMove(e){
			if(!this.touch.initiated){
				return
			}
			const touch = e.touches[0];
			const deltaX = touch.pageX - this.touch.startX;
			const deltaY = touch.pageY - this.touch.startY;
			if(Math.abs(deltaY) > Math.abs(deltaX)){
				return
			}
			if (!this.touch.moved) {
	          this.touch.moved = true
	        }
			const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
			const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left+deltaX)); //距离右边界的距离
			this.touch.percent = Math.abs(offsetWidth/window.innerWidth);
			this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
			this.$refs.lyricList.$el.style[transitionDuration] = 0;
			this.$refs.middleL.style.opacity = 1-this.touch.percent;
			this.$refs.middleL.style[transitionDuration] = 0;
		},
		middleTouchEnd(){
			if (!this.touch.moved) {
	          return
	        }
			let offsetWidth
			let opacity
			if(this.currentShow === 'cd'){
				if(this.touch.percent>0.1){
					offsetWidth = -window.innerWidth;
					this.currentShow = 'lyric';
					opacity = 0
				}else{
					offsetWidth = 0;
					opacity = 1;
				}
			}else{
				if(this.touch.percent<0.9){
					offsetWidth = 0;
					this.currentShow = 'cd';
					opacity = 1;
				}else{
					offsetWidth = -window.innerWidth;
					opacity = 0;
				}
			}
			const time = 300;
			this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
			this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
			this.$refs.middleL.style.opacity = opacity;
			this.$refs.middleL.style[transitionDuration] = `${time}ms`;
		},
		showPlaylist(){
			this.$refs.playlist.show();
		},
		_getPosAndScale(){
			const targetWidth = 40;
			const paddingLeft = 40;
			const paddingBottom = 30;
			const paddingTop = 80;
			const width = window.innerWidth*0.8;
			const scale = targetWidth/width;
			const x = -(window.innerWidth/2 - paddingLeft);
			const y = window.innerHeight-paddingBottom- paddingTop-width/2;
			return {
				x,
				y,
				scale
			}
		},
		_formatTime(time){
			time = time | 0;
			const minute = time/60 | 0;
			const second = this._pad(time%60);
			return `${minute}:${second}`;
		},
		_pad(num,n=2){  //补0函数
			let len = num.toString().length;
			while(len<n){
				num = '0'+num;
				len++
			}
			return num
		},
		...mapMutations({
			setFullScreen:'SET_FULLSCREEN'
		}),
		...mapActions([
			'savePlayHistory'
		])
	},
	watch:{
		currentSong(newSong,oldSong){
			if(!newSong.id){//清空播放列表时newSong为空对象，不执行以下程序
				return
			}
			if(newSong.id===oldSong.id){//切换播放模式时，currentSong会变化
				return
			}
			if(this.currentLyric){
				this.currentLyric.stop();
			}
			clearTimeout(this.timer)
			this.timer = setTimeout(()=>{
				this.$refs.audio.play()
				this.getLyric();
			},1000)
		},
		playing(newPlaying){
			const audio = this.$refs.audio;
			this.$nextTick(()=>{
				newPlaying ? audio.play() : audio.pause();
			})
		}
	},
	components:{
		progressBar,
		progressCircle,
		Scroll,
		playlist
	}
}
</script>

<style>
	.normal-enter-active,.normal-leave-active{
		transition: all 0.4s; 
	}
	.normal-enter-active .top,.normal-enter-active .bottom,.normal-leave-active .top,.normal-leave-active .bottom{
		transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32); 
	}
	.normal-enter,.normal-leave-to{
		opacity: 0;
	}
	.normal-enter .top,.normal-leave-to .top{
		transform:translate3d(0,-100px,0);
	}
	.normal-enter .bottom,.normal-leave-to .bottom{
		transform:translate3d(0,100px,0);
	}
	
	
	
	
.player .normal-player{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 150;
	background:#222;
}

.player .normal-player .background{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index:-1;
	opacity: 0.6;
	filter: blur(20px);
}
.player .normal-player .top{
	position: relative;
	margin-bottom: 25px;
}
.player .normal-player .top .back{
	position: absolute;
	left: 6px;
	top: 0;
	z-index: 50px;
}
.player .normal-player .top .back .icon-back{
	display:block;
	padding: 9px;
	font-size: 22px;
	color: #ffcd32;
	transform:rotate(-90deg);
}

.player .normal-player .top .title{
	width: 70%;
	margin: 0 auto;
	font-size: 18px;
	color: #FFFFFF;
	line-height: 40px;
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.player .normal-player .top .subtitle{
	font-size: 16px;
	color: #FFFFFF;
	line-height: 20px;
	text-align: center;
}
.player .normal-player .middle{
	position: absolute;
	top: 80px;
	bottom: 170px;
	width:100%;
	white-space: nowrap;
	font-size: 0;
}
.player .normal-player .middle .middle-l{ 
	display: inline-block;
	vertical-align:top;
	position: relative;
	width: 100%;
	height: 0;
	padding-top: 80%;
}
.player .normal-player .middle .middle-l .cd-wrapper{ 
	position: absolute;
	top: 0;
	left: 10%;
	width: 80%;
	height: 100%;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd{ 
	position: relative;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	border:10px solid rgba(255, 255, 255, 0.1);
	border-radius: 50%;
	overflow: hidden;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd.play{ 
	animation: rotate 20s linear infinite;
}
 @keyframes rotate{
 	0% {
 		transform: rotate(0);
 	}
    100% {
    	transform: rotate(360deg);
    }
 }
.player .normal-player .middle .middle-l .cd-wrapper .cd.pause{ 
	animation-play-state:paused;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd .image{ 
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
.player .normal-player .middle .middle-l .playing-lyric-wrapper{
	width: 80%;
	margin: 30px auto 0 auto;
	text-align: center;
	overflow: hidden;
}
.player .normal-player .middle .middle-l .playing-lyric-wrapper .playing-lyric{
	height: 20px;
	line-height: 20px;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.5);
}

.player .normal-player .middle .middle-r{
	display: inline-block;
	vertical-align: top;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.player .normal-player .middle .middle-r .lyric-wrapper{
	width: 80%;
	margin: 0 auto;
	text-align: center;
	overflow: hidden;
}
.player .normal-player .middle .middle-r .lyric-wrapper .text{
	line-height: 32px;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.5);
}
.player .normal-player .middle .middle-r .lyric-wrapper .text.current{
	color: #fff;
}

.player .normal-player .bottom{
	position: absolute;
	bottom: 50px;
	width: 100%;
}
.player .normal-player .bottom .dot-wrapper{
	text-align: center;
	font-size: 0;
}
.player .normal-player .bottom .dot-wrapper .dot{
	display: inline-block;
	vertical-align: middle;
	width: 8px;
	height: 8px;
	margin: 0 4px;
	border-radius: 5px;
	background:rgba(255, 255, 255, 0.5);
}
.player .normal-player .bottom .dot-wrapper .dot.active{
	width: 20px;
	background:rgba(255, 255, 255, 0.8);
}
.player .normal-player .bottom .progress-wrapper{
	display: flex;
	align-items: center;
	width: 80%;
	margin: 0 auto;
	padding: 10px 0;
}
.player .normal-player .bottom .progress-wrapper .time{
	flex: 0 0 30px;
	width: 30px;
	color: #FFFFFF;
	font-size: 12px;
	line-height: 30px;
}
.player .normal-player .bottom .progress-wrapper .time-l{
	text-align: left;
}
.player .normal-player .bottom .progress-wrapper .time-r{
	text-align: right;
}
.player .normal-player .bottom .progress-wrapper .progress-bar-wrapper{
	flex: 1;
}




.player .normal-player .bottom .operators{
	display: flex;
	align-items: center;
}
.player .normal-player .bottom .operators .icon{
	flex: 1;
	color: #ffcd32;
}
.player .normal-player .bottom .operators .icon.disable{
	color: rgba(255, 205, 49, 0.5);
}
.player .normal-player .bottom .operators .i-left{
	text-align: right;
}
.player .normal-player .bottom .operators .i-center{
	padding: 0 20px;
	text-align: center;
}
.player .normal-player .bottom .operators .icon.i-center i{
	font-size: 40px;
}
.player .normal-player .bottom .operators .i-right{
	text-align: left;
}
.player .normal-player .bottom .operators .icon i{
	font-size: 30px;
}
.player .normal-player .bottom .operators .icon .icon-favorite{
	color: #d93f30;
}

.player .mini-player{
	display: flex;
	align-items: center;
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 60px;
	z-index: 150;
	background:#333;
	
}
.player .mini-player .icon{
	flex: 0 0 40px;
	width: 40px;
	padding: 0 10px 0 20px ;
}
.player .mini-player .icon img{
	border-radius: 50%;	
}
.player .mini-player .icon img.play{
	animation: rotate 10s linear infinite;	
}
.player .mini-player .icon img.pause{
	animation-play-state: paused;	
}
.player .mini-player .text{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	line-height: 20px;
	overflow: hidden;
}
.player .mini-player .text .name{
	margin-bottom: 2px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 14px;
	color: #FFFFFF;
}
.player .mini-player .text .desc{
	font-size: 12px;
	color: rgba(255, 255, 255, 0.3);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.player .mini-player .control{
	flex: 0 0 30px;
	width: 30px;
	padding: 0 10px;
}
.player .mini-player .control .icon-playlist,.player .mini-player .control .icon-play-mini,.player .mini-player .control .icon-pause-mini{
	font-size: 30px;
	color:rgba(255, 205, 49, 0.5);
}
.player .mini-player .control .icon-mini{
	font-size: 32px;
	position: absolute;
	top: 0;
	left: 0;
}












</style>