<template>
<div class="search">
	<div class="search-box-wrapper">
		<search-box ref="searchBox" @query="onQueryChange"></search-box>
	</div>
	<div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
		<scroll ref="shortcut" class="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
			<div>
				<div class="hotkeys">
					<h3 class="title">热门搜索</h3>
					<ul>
						<li class="key" @click="addQuery(item.k)" v-for="item in hotkeys">
							<span>{{item.k}}</span>
						</li>
					</ul>
				</div>
				<div class="search-history" v-show="searchHistory.length">
					<div class="title">
						<span class="text">搜索历史</span>
						<span class="clear" @click="showConfirm">
							<i class="icon-clear"></i>
						</span>
					</div>
					<search-history-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-history-list>
				</div>
			</div>
		</scroll>
	</div>
	<div class="search-result" v-show="query" ref="searchresult">
		<suggest ref="searchlist" :query="query" @beforeListScroll="blurInput" @select="saveSearch"></suggest>
	</div>
	<confirm ref="confirm" text="是否清空所有搜索历史" confirm-btn-text="清空" @confirm="clearSearchHistory"></confirm>
	<router-view></router-view>
</div>
</template>

<script>
import searchBox from 'base/search-box/search-box'
import suggest from 'components/suggest/suggest'
import Scroll from 'base/scroll/scroll'
import searchHistoryList from 'base/search-history-list/search-history-list'
import Confirm from 'base/confirm/confirm'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import {mapActions} from 'vuex'
import {playlistMixin,searchMixin} from 'common/js/mixin'


export default {
	mixins:[playlistMixin,searchMixin],
	data(){
		return {
			hotkeys:[],
			refreshDelay:100
		}
	},
	computed:{
		shortcut(){
			return this.hotkeys.concat(this.searchHistory)
		}
	},
	created(){
		this._getHotKey();
	},
	methods:{
		handlePlaylist(playlist){
			let bottom = playlist.length > 0 ? '60px' : '';
			this.$refs.searchresult.style.bottom = bottom;
			this.$refs.searchlist.refresh();
			this.$refs.shortcutWrapper.style.bottom = bottom;
			this.$refs.shortcut.refresh();
		},
		showConfirm(){
			this.$refs.confirm.show();
		},
		_getHotKey(){
			getHotKey().then((res)=>{
				if(res.code === ERR_OK){
					this.hotkeys = res.data.hotkey.slice(0,10);
				}
			})
		},
		...mapActions([
			'clearSearchHistory'
		])
	},
	watch:{
		query(newQuery){
			if(!newQuery){
				setTimeout(()=>{
					this.$refs.shortcut.refresh();
				},20)
			}
		}
	},
	components:{
		searchBox,
		Scroll,
		suggest,
		searchHistoryList,
		Confirm
	}
}
</script>

<style>
.search{
	/*position: fixed;
	top: 88px;
	bottom: 0;
	width: 100%;
	overflow: hidden;*/
}
.search .search-box-wrapper{
	margin: 20px;
}
.search .shortcut-wrapper{
	position: fixed;
	top: 178px;
	bottom: 0;
	width: 100%;
	overflow: hidden;
}
.search .shortcut-wrapper .shortcut{	
	height:100%;
	overflow: hidden;
}
.search .shortcut-wrapper .shortcut .hotkeys{
	margin: 0 20px 20px 20px;
}
.search .shortcut-wrapper .shortcut .hotkeys .title{
	margin-bottom: 20px;
	font-size: 14px;
	color:rgba(255, 255, 255, 0.5);
}
.search .shortcut-wrapper .shortcut .hotkeys .key{
	display: inline-block;
	margin:  0 20px 10px 0;
	padding: 5px 10px;
	border-radius: 6px;
	background:#333;
	color: rgba(255, 255, 255, 0.3);
	font-size: 14px;
}
.search .shortcut-wrapper .shortcut .search-history{
	position: relative;
	margin: 0 20px;
}
.search .shortcut-wrapper .shortcut .search-history .title{
	display: flex;
	align-items: center;
	height: 40px;
	margin-bottom: 20px;
	font-size: 14px;
	color:rgba(255, 255, 255, 0.5);
}
.search .shortcut-wrapper .shortcut .search-history .title .text{
	flex: 1;
}
.search .shortcut-wrapper .shortcut .search-history .title .clear{
	position: relative;
}
.search .shortcut-wrapper .shortcut .search-history .title .clear:before{
	content: '';
	position: absolute;
	top: -10px;
	left: -10px;
	right: -10px;
	bottom: -10px;
}
.search .shortcut-wrapper .shortcut .search-history .title .clear .icon-clear{
	font-size: 14px;
	color: rgba(255, 255, 255, 0.3);
}
.search .search-result{
	position: fixed;
	top: 178px;
	bottom: 0;
	width: 100%;
	overflow: hidden;
}

</style>