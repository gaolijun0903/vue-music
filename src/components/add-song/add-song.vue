<template>
<transition name="slide">
	<div class="add-song" v-show="showFlag" @click.stop>
		<div class="header">
			<h1 class="title">添加歌曲到列表</h1>
			<div class="close" @click="hide">
				<i class="icon-close"></i>
			</div>
		</div>
		<div class="search-box-wrapper">
			<search-box ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange"></search-box>
		</div>
		<div class="shortcut" v-show="!query">
			<switches :current-index="currentIndex" :switches="switches" @switch="switchItem"></switches>
			<div class="switch-list-wrapper">
				<scroll ref="playhistory" class="list-scroll" v-show="currentIndex===0" :data="playHistory">
					<div class="list-inner">
						<song-list :songs="playHistory" @select="selectSong"></song-list>
					</div>
				</scroll>
				<scroll ref="searchhistory" class="list-scroll" v-show="currentIndex===1" :data="searchHistory" :refreshDelay="refreshDelay">
					<div class="list-inner">
						<search-history-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-history-list>
					</div>
				</scroll>
			</div>
		</div>
		<div class="search-result" v-show="query">
			<suggest :query='query' :showSinger="showSinger" @beforeListScroll="blurInput" @select="selectSuggest"></suggest>
		</div>
		<top-tip ref="toptip">
			<div class="tip-title">
				<i class="icon-ok"></i>
				<span class="text">1首歌曲已经添加到播放列表</span>
			</div>
		</top-tip>
	</div>
</transition>
</template>

<script>
import searchBox from 'base/search-box/search-box'
import suggest from 'components/suggest/suggest'
import scroll from 'base/scroll/scroll'
import switches from 'base/switches/switches'
import songList from 'base/song-list/song-list'
import searchHistoryList from 'base/search-history-list/search-history-list'
import topTip from 'base/top-tip/top-tip'
import {mapGetters,mapActions} from 'vuex'
import Song from 'common/js/song'
import {searchMixin} from 'common/js/mixin'

export default{
	mixins:[searchMixin],
	data(){
		return{
			showFlag:false,
			switches:[{text:'最近播放'},{text:'搜索历史'}],
			currentIndex:0,
			showSinger:false,
			refreshDelay:100
		}
	},
	computed:{
		...mapGetters([
			'playHistory'
		])
	},
	methods:{
		show(){
			this.showFlag = true;
			setTimeout(()=>{
				if(this.currentIndex===0){
					this.$refs.playhistory.refresh();
				}else{
					this.$refs.searchhistory.refresh();
				}
			},20)
		},
		hide(){
			this.showFlag = false;
		},
		switchItem(index){
			this.currentIndex = index;
		},
		selectSong(song,index){
			if(index !== 0){
				this.insertSong(new Song(song));
				this.$refs.toptip.show();
			}
		},
		selectSuggest(){
			this.saveSearch();
			this.$refs.toptip.show();
		},
		...mapActions([
			'insertSong'
		])
	},
	components:{
		searchBox,
		suggest,
		scroll,
		switches,
		songList,
		searchHistoryList,
		topTip
	}
}
</script>

<style>
.add-song{
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	z-index: 200;
	background: #222;
}
.add-song.slide-enter-active, .add-song.slide-leave-active{
	transition: all 0.3s ease;
}	
.add-song.slide-enter, .add-song.slide-leave-to{
	transform: translate3d(100%,0,0);
}
.add-song .header{
	position: relative;
	height: 44px;
	text-align: center;
}
.add-song .header .title{
	font-size: 18px;
	line-height: 44px;
	color: #fff;
}
.add-song .header .close{
	position: absolute;
	right: 8px;
	top: 0;
}
.add-song .header .close .icon-close{
	display: block;
	padding: 12px;
	font-size: 20px;
	color: #ffcd32;
}
.add-song .search-box-wrapper{
	margin: 20px;
}
.add-song .shortcut{
	
}
.add-song .shortcut .switch-list-wrapper{
	position: absolute;
	top: 165px;
	bottom: 0;
	width: 100%;
	
}
.add-song .shortcut .switch-list-wrapper .list-scroll{
	height: 100%;
	overflow: hidden;
}
.add-song .shortcut .switch-list-wrapper .list-scroll .list-inner{
	padding: 20px 30px;
}
.add-song .tip-title{
	text-align: center;
	padding: 18px 0;
	font-size: 0;
}
.add-song .tip-title .icon-ok{
	margin-right: 4px;
	font-size: 14px;
	color: #ffcd32;
}
.add-song .tip-title .text{
	font-size: 14px;
	color: #fff;
}
</style>