<template>
<transition name="slide">
	<div class="user-center">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<div class="switches-wrapper">
			<switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
		</div>
		<div class="play-btn" @click="random">
			<i class="icon-play"></i>
			<span class="text">随机播放全部</span>
		</div>
		<div class="list-wrapper" ref="listWrapper">
			<scroll ref="favoritelist" class="list-scroll" v-if="currentIndex===0" :data="favouriteList">
				<div class="list-inner">
					<song-list :songs="favouriteList" @select="selectSong"></song-list>
				</div>
			</scroll>
			<scroll ref="playhistory" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
				<div class="list-inner">
					<song-list :songs="playHistory" @select="selectSong"></song-list>
				</div>
			</scroll>
		</div>
		<div class="no-result-wrapper" v-show="noResult">
			<no-result :title="noResultDesc"></no-result>
		</div>
	</div>
</transition>
</template>

<script>
import switches from 'base/switches/switches'	
import Scroll from 'base/scroll/scroll'
import songList from 'base/song-list/song-list'
import noResult from 'base/no-result/no-result'
import Song from 'common/js/song'
import {mapGetters,mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

	
export default{
	mixins:[playlistMixin],
	data(){
		return{
			switches:[{text: '我喜欢的'},{text: '最近听的'}],
			currentIndex:0
		}
	},
	computed:{
		noResult(){
			if(this.currentIndex === 0){
				return !this.favouriteList.length;
			}else{
				return !this.playHistory.length;
			}
		},
		noResultDesc(){
			if(this.currentIndex === 0){
				return '暂无收藏歌曲';
			}else{
				return '您还没有听过歌曲';
			}
		},
		...mapGetters([
			'playHistory',
			'favouriteList'
		])
	},
	methods:{
		handlePlaylist(playlist){
			let bottom = playlist.length>0? '60px':'';
			this.$refs.listWrapper.style.bottom = bottom;
			if(this.currentIndex===0){
				this.$refs.favoritelist.refresh();
			}else{
				this.$refs.playhistory.refresh();
			}
		},
		back(){
			this.$router.back();
		},
		selectSong(song){
			this.insertSong(new Song(song));
		},
		switchItem(index){
			this.currentIndex = index;
		},
		random(){
			let list = this.currentIndex===0? this.favouriteList: list = this.playHistory
			if(list.length===0){
				return
			}
			list.map((song)=>{
				return new Song(song);
			})
			this.randomPlay({
				list
			})
		},
		...mapActions([
			'insertSong',
			'randomPlay'
		])
	},
	components:{
		switches,
		Scroll,
		noResult,
		songList
	}
}
</script>

<style>
.user-center{
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	background: #222;
	z-index: 100;
}
.user-center.slide-enter-active, .user-center.slide-leave-active{
	transition: all 0.3s;
}
.user-center.slide-enter, .user-center.slide-leave-to{
	transform: translate3d(100%, 0, 0);
}
.user-center .back{
	position: absolute;
	left: 6px;
	top: 0;
	z-index: 50;
}
.user-center .back .icon-back{
	display: inline-block;
	padding: 10px;
	font-size: 22px;
	color: #ffcd32;
}
.user-center .switches-wrapper{
	margin: 10px 0 30px 0;
}
.user-center .play-btn{
	box-sizing: border-box;
	width: 135px;
	padding: 7px 0;
	margin: 0 auto;
	text-align: center;
	border: 1px solid rgba(255, 255, 255, 0.5);
	border-radius: 100px;
	font-size: 0;
	color: rgba(255, 255, 255, 0.5);
}
.user-center .play-btn .icon-play{
	display: inline-block;
	vertical-align: middle;
	margin-right: 6px;
	font-size: 16px;
}
.user-center .play-btn .text{
	display: inline-block;
	vertical-align: middle;
	font-size: 12px;
}

.user-center .list-wrapper{
	position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
}
.user-center .list-wrapper .list-scroll{
	height: 100%;
    overflow: hidden;
}
.user-center .list-wrapper .list-scroll .list-inner{
	padding: 20px 30px;
}

.user-center .no-result-wrapper{
	position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}
</style>