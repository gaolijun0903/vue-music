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
			<div class="middle">
				<div class="middle-l">
					<div class="cd-wrapper" ref="cdWrapper">
						<div class="cd" :class="cdCls">
							<img class="image" :src="currentSong.image"/>
						</div>
					</div>
				</div>
				<!--<div class="middle-r">
					歌词
				</div>-->
			</div>
			<div class="bottom">
				<!--<div class="dot-wrapper">
					
				</div>-->
				<div class="progress-wrapper">
					<span class="time time-l">{{_formatTime(currentTime)}}</span>
					<div class="progress-bar-wrapper">
						<progress-bar :percent="percent" @percentChange="onPercentChange"></progress-bar>
					</div>
					<span class="time time-r">{{_formatTime(currentSong.duration)}}</span>
				</div>
				<div class="operators">
					<div class="icon i-left" :class="disableCls" @click="changeMode">
						<i :class="iconMode"></i>
					</div>
					<div class="icon i-left" @click="prev" :class="disableCls">
						<i class="icon-prev"></i>
					</div>
					<div class="icon i-center" @click="togglePlay" :class="disableCls">
						<i :class="playIcon"></i>
					</div>
					<div class="icon i-right" @click="next" :class="disableCls">
						<i class="icon-next"></i>
					</div>
					<div class="icon i-right" :class="disableCls">
						<i class="icon icon-not-favorite"></i>
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
			<div class="control">
				<i class="icon-playlist"></i>
			</div>
		</div>
	</transition>
	<audio ref="audio" :src="currentSong.url" @canplay="songReady" @error="songError" @timeupdate="updateTime" @ended="songEnd"></audio>
</div>
</template>

<script>
import animations from 'create-keyframe-animation'
import progressBar from 'base/progress-bar/progress-bar'
import progressCircle from 'base/progress-circle/progress-circle'
import {mapGetters} from 'vuex'
import {mapMutations} from 'vuex'
import {prefixStyle} from 'common/js/dom'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

const transform = prefixStyle('transform');

export default{
	props:{
		
	},
	data(){
		return {
			songIsReady:false,
			currentTime:0,
			radius:32
		}
	},
	computed:{
		iconMode(){
			return this.mode===playMode.sequence ? 'icon-sequence' : this.mode===playMode.loop ? 'icon-loop' : 'icon-random';
		},
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
			'playList',
			'sequenceList',
			'currentSong',
			'playing',
			'currentIndex',
			'mode'
		])
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
		},
		updateTime(e){
			this.currentTime = e.target.currentTime;
		},
		onPercentChange(percent){
			this.$refs.audio.currentTime = this.currentSong.duration * percent;
			if(!this.playing){
				this.togglePlay();
			}
		},
		changeMode(){//播放模式切换
			const mode = (this.mode + 1) % 3;
			this.setPlayMode(mode);
			//修改歌曲列表
			let list = null;
			if(mode === playMode.random){
				list = shuffle(this.sequenceList);
			}else{
				list = this.sequenceList;
			}
			this.setPlayList(list);
			//设置currentIndex
			this._resetCurrentIndex(list);
		},
		togglePlay(){
			this.setPlayingState(!this.playing);
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
			let index = this.currentIndex + 1;
			if(index === this.playList.length){
				index = 0
			}
			this.setCurrentIndex(index);
			if(!this.playing){
				this.togglePlay()
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
			return `${minute}:${second}`
		},
		_resetCurrentIndex(list){
			let index = list.findIndex((item)=>{        //----ES6语法！！！！
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index);
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
			setFullScreen:'SET_FULLSCREEN',
			setPlayingState:'SET_PLAYING_STATE',
			setCurrentIndex: 'SET_CURRENTINDEX',
			setPlayMode:'SET_PLAY_MODE',
			setPlayList:'SET_PLAYLIST'
		})
	},
	watch:{
		currentSong(newSong,oldSong){
			if(newSong.id===oldSong.id){
				return
			}
			this.$nextTick(()=>{
				this.$refs.audio.play()
			})
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
		progressCircle
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
	white-space: normal;
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
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	border:10px solid rgba(255, 255, 255, 0.1);
	border-radius: 50%;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd.play{ 
	animation: rotate 20s linear infinite;
}
 @keyframes rotate{
 	from {
 		transform: rotate(0)
 	}
    to {
    	transform: rotate(360deg)
    }
 }
.player .normal-player .middle .middle-l .cd-wrapper .cd.pause{ 
	animation-play-state:paused;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd .image{ 
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
.player .normal-player .middle .middle-r{
	display: inline-block;
	vertical-align: top;
	width: 100%;
	height:100%;
	overflow: hidden;
}


.player .normal-player .bottom{
	position: absolute;
	bottom: 50px;
	width: 100%;
}
.player .normal-player .bottom .dot-wrapper{
	
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