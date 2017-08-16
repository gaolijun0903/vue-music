<template>
<div class="rank" ref="rank">
	<scroll class="rank-list-wrapper" ref="rankListWrapper" :data="topList">
		<ul class="rank-list">
			<li class="rank-item" v-for="item in topList" @click="selectItem(item)">
				<div class="img-wrapper">
					<img width="100" height="100" v-lazy="item.picUrl"/>
				</div>
				<div class="text-wrapper">
					<div class="text" v-for="(song,index) in item.songList">
						{{index+1}} {{song.songname}}--{{song.singername}}
					</div>
				</div>
			</li>
		</ul>
		<div class="loading-wrapper" v-show="!topList.length">
			<loading></loading>
		</div>
	</scroll>
	<router-view></router-view>
</div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getRankList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
	
export default{
	mixins:[playlistMixin],
	data(){
		return{
			topList:[]
		}
	},
	created(){
		this._getRankList();
	},
	methods:{
		handlePlaylist(playlist){
			let bottom = playlist.length ? '60px' : '';
			this.$refs.rank.style.bottom = bottom;
			this.$refs.rankListWrapper.refresh();
		},
		selectItem(item){
			this.$router.push({
				path:`/rank/${item.id}`
			})
			this.setToplist(item)
		},
		_getRankList(){
			getRankList().then((res)=>{
				if(res.code===ERR_OK){
					this.topList = res.data.topList;
				}
			})
		},
		...mapMutations({
			setToplist : 'SET_TOPLIST'
		})
	},
	components:{
		Scroll,
		Loading
	}
}
</script>

<style>
.rank{
	position: fixed;
	top: 88px;
	bottom: 0;
	width: 100%;
}
.rank .rank-list-wrapper{
	height: 100%;
	overflow: hidden;
}
.rank .rank-list-wrapper .rank-list .rank-item{
	display: flex;
	margin:0 20px;
	padding-top: 20px;
	height: 100px;
}
.rank .rank-list-wrapper .rank-list .rank-item:last-child{
	padding-bottom: 20px;
}
.rank .rank-list-wrapper .rank-list .rank-item .img-wrapper{
	flex:0 0 100px;
	width: 100px;
	height: 100px;	
}
.rank .rank-list-wrapper .rank-list .rank-item .img-wrapper .img{
	width: 100px;
	height: 100px;
}
.rank .rank-list-wrapper .rank-list .rank-item .text-wrapper{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0px 20px;
	height: 100px;
	overflow: hidden;
	background: #333;
	font-size: 12px;
	color: rgba(255, 255, 255, 0.3);
}
.rank .rank-list-wrapper .rank-list .rank-item .text-wrapper .text{
	line-height: 26px;
	white-space: nowrap;
	overflow:hidden;
	text-overflow: ellipsis;
}
.rank .rank-list-wrapper .loading-wrapper{
	position: absolute;
	top: 50%;
	width: 100%;
	transform: translateY(-50%);
}
</style>