<template>
<scroll class="suggest">
	<ul class="suggest-list">
		<li class="suggest-item" v-for="item in suggestList">
			<div class="icon" :class="getIconCls(item)">
				<i></i>
			</div>
			<div class="name">
				<p class="text"v-html="getDisplayName(item)"></p>
			</div>
		</li>
	</ul>
	<!--<div class="noresult-wrapper" v-show="!suggestList.length">
		
	</div>-->
</scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

const TYPE_SINGER = 'singer'
	
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
			page:1
		}
	},
	methods:{
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
		_search(query){
			search(query,this.page,this.showSinger).then((res)=>{
				if(res.code === ERR_OK){
					console.log(res.data)
					this.suggestList = this._genResult(res.data)
				}
			})
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
		}
	},
	watch:{
		query(newQuery){
			this._search(newQuery);
		}
	},
	components:{
		Scroll
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
	top: 50%;
	width: 100%;
	transform: translateY(-50%);
}









</style>