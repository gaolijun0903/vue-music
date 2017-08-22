<template>
<scroll class="suggest" 
	ref="suggest"
	:data="suggestList" 
	:pullup="pullup" 
	:beforeScroll="beforeScroll"
	@scrollNearEnd="searchMore" 
	@beforeScrollStart="beforeListScroll">
	<ul class="suggest-list">
		<li class="suggest-item" v-for="item in suggestList" @click="selectItem(item)">
			<div class="icon" :class="getIconCls(item)">
				<i></i>
			</div>
			<div class="name">
				<p class="text"v-html="getDisplayName(item)"></p>
			</div>
		</li>
		<loading title="" v-show="hasMore"></loading>
	</ul>
	<div class="noresult-wrapper" v-show="!hasMore && !suggestList.length">
		<no-result title="抱歉，暂无搜索结果"></no-result>
	</div>
</scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import noResult from 'base/no-result/no-result'
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {createSinger} from 'common/js/singer'
import {mapMutations,mapActions} from 'vuex'

const TYPE_SINGER = 'singer'
const perpage = 20
	
export default{
	props:{
		query:{
			type:String,
			default:''
		},
		showSinger:{
			type:Boolean,
			default:true
		}
	},
	data(){
		return{
			suggestList:[],
			page:1,
			pullup:true,
			beforeScroll:true,
			hasMore:true
		}
	},
	methods:{
		selectItem(item){
			if(item.type === TYPE_SINGER){
				this.$router.push({
					path:`/search/${item.singermid}`
				})
				this.setSinger(createSinger(item))
			}else{
				this.insertSong(item)
			}
			this.$emit('select',item)
		},
		getIconCls(item){
			if(item.type === TYPE_SINGER){
				return 'icon-mine'
			}
			return 'icon-music'
		},
		getDisplayName(item){
			if(item.type === TYPE_SINGER){
				return item.singername
			}else{
				return `${item.name}-${item.singer}`
			}
		},
		beforeListScroll(){
			this.$emit('beforeListScroll');
		},
		searchMore(){
			if(!this.hasMore){
				return
			}
			this.page++
			search(this.query,this.page,this.showSinger,perpage).then((res)=>{
				if(res.code === ERR_OK){
					this.suggestList = this.suggestList.concat(this._genResult(res.data));
					this._checkMore(res.data.song);
				}
			})
		},
		refresh(){
			this.$refs.suggest.refresh();
		},
		_search(query){
			this.page = 1;
			this.hasMore = true;
			this.$refs.suggest.scrollTo(0,0);
			search(query,this.page,this.showSinger,perpage).then((res)=>{
				if(res.code === ERR_OK){
					this.suggestList = this._genResult(res.data);
					this._checkMore(res.data.song);
				}
			})
		},
		_checkMore(song){
			if(!song.list.length || song.totalnum < (song.curnum + song.curpage*perpage)){
				this.hasMore = false;
			}
		},
		_genResult(data){
			let ret = [];
			if(data.zhida && data.zhida.singerid){
				ret.push({...data.zhida,...{type:TYPE_SINGER}})   //对象扩展运算符ES6
			}
			if(data.song){
				ret = ret.concat(this._normalizeSongs(data.song.list));
			}
			return ret
		},
		_normalizeSongs(list){
			let ret = [];
			list.forEach((musicData)=>{
				if(musicData.songid && musicData.songmid){
					ret.push(createSong(musicData))
				}
			})
			return ret
		},
		...mapMutations({
			setSinger:'SET_SINGER'
		}),
		...mapActions([
			'insertSong'
		])
	},
	watch:{
		query(newQuery){
			this._search(newQuery);
		}
	},
	components:{
		Scroll,
		Loading,
		noResult
	}
}
</script>

<style>
.suggest{
	height: 100%;
	overflow: hidden;
}
.suggest .suggest-list{
	padding: 0 30px;
}
.suggest .suggest-list .suggest-item{
	display: flex;
	align-items: center;
	padding-bottom: 20px;
}
.suggest .suggest-list .suggest-item .icon{
	flex:0 0 30px;
	width: 30px;
	font-size:14px;
	color:rgba(255, 255, 255, 0.3);
}

.suggest .suggest-list .suggest-item .name{
	flex: 1;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}
.suggest .suggest-list .suggest-item .name .text{
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
.suggest .noresult-wrapper{
	position: absolute;
	top: 40%;
	width: 100%;
	transform: translateY(-50%);
}









</style>