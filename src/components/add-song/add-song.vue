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
			<search-box placeholder="搜索歌曲" @query="onQueryChange"></search-box>
		</div>
		<div class="shortcut">
			<switches :current-index="currentIndex" :switches="switches" @switch="switchItem"></switches>
			<div class="switch-list-wrapper">
				<div class="list-scroll" v-show="currentIndex===0">
					<div class="list-inner">
						<song-list :songs="playHistory" @select=""></song-list>
					</div>
				</div>
				<div class="list-scroll" v-show="currentIndex===1">
					最近搜索列表
				</div>
			</div>
		</div>
		<div class="search-result">
			
		</div>
	</div>
</transition>
</template>

<script>
import searchBox from 'base/search-box/search-box'
import suggest from 'components/suggest/suggest'
import scroll from 'base/scroll/scroll'
import switches from 'base/switches/switches'
import songList from 'base/song-list/song-list'
import {mapGetters} from 'vuex'

export default{
	data(){
		return{
			showFlag:false,
			switches:[{text:'最近播放'},{text:'搜索历史'}],
			currentIndex:0
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
		},
		hide(){
			this.showFlag = false;
		},
		onQueryChange(query){
			console.log(query)
		},
		switchItem(index){
			this.currentIndex = index;
		}
	},
	components:{
		searchBox,
		suggest,
		scroll,
		switches,
		songList
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


</style>