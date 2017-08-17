<template>
<div class="search">
	<div class="search-box-wrapper">
		<search-box ref="searchBox" @query="onQueryChange"></search-box>
	</div>
	<div class="shortcut-wrapper" v-show="!query">
		<scroll class="shortcut" :data="hotkeys">
			<div class="hotkeys">
				<h3 class="title">热门搜索</h3>
				<ul>
					<li class="key" @click="addQuery(item.k)" v-for="item in hotkeys">
						<span>{{item.k}}</span>
					</li>
				</ul>
			</div>
			<div class="search-history">
				<div class="title">
					<span class="text">搜索历史</span>
					<span class="clear">
						<i class="icon-clear"></i>
					</span>
				</div>
				<ul>
					<li class="key" href="" v-for="item in hotkeys">
						<span>{{item.k}}</span>
					</li>
				</ul>
			</div>
		</scroll>
			
	</div>
		
	<div class="search-result" v-show="query">
		<suggest :query="query"></suggest>
	</div>
</div>
</template>

<script>
import searchBox from 'base/search-box/search-box'
import suggest from 'components/suggest/suggest'
import Scroll from 'base/scroll/scroll'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'


export default {
	data(){
		return {
			hotkeys:[],
			query:''
		}
	},
	created(){
		this._getHotKey();
	},
	methods:{
		onQueryChange(newQuery){
			this.query = newQuery
		},
		addQuery(k){
			this.$refs.searchBox.setQuery(k)
		},
		_getHotKey(){
			getHotKey().then((res)=>{
				if(res.code === ERR_OK){
					this.hotkeys = res.data.hotkey.slice(0,10);
				}
			})
		}
	},
	components:{
		searchBox,
		Scroll,
		suggest
	}
}
</script>

<style>
.search{
	position: fixed;
	top: 88px;
	bottom: 0;
	width: 100%;
	overflow: hidden;
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