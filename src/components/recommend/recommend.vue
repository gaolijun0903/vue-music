<template>
<div class="recommend">
	<scroll ref="scroll" class="recommend-content" :data="discList">
		<div>
			<div class="slider-wrapper" v-if="recommends.length">
				<slider>
					<div v-for="item in recommends">
						<a :href="item.linkUrl">
							<img class="needsclick" @load="loadImage" :src="item.picUrl" />
						</a>
					</div>
				</slider>
			</div>
			<div class="recommend-list">
				<h1 class="list-title">热门歌单推荐</h1>
				<ul>
					<li class="list-item" v-for="item in discList">
						<div class="icon">
							<img v-lazy="item.imgurl" width="60"  height="60"/>
						</div>
						<div class="text">
							<h2 class="name">{{item.creator.name}}</h2>
							<p class="desc">{{item.dissname}}</p>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="loading-container" v-show="!discList.length">
			<loading></loading>
		</div>
	</scroll>
</div>
</template>

<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getRecommend,getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'

export default{
	data(){
		return{
			recommends: [],
			discList: []
		}
	},
	created(){
		this._getRecommend();
		this._getDiscList();
	},
	methods:{
		_getRecommend(){
			getRecommend().then((res)=>{
				if(res.code === ERR_OK){
					this.recommends = res.data.slider;
				}
			})
		},
		_getDiscList(){
			getDiscList().then((res)=>{
				if(res.code === ERR_OK){
					this.discList = res.data.list;
				}
			})
		},
		loadImage(){
			if (!this.checkLoaded){
				this.$refs.scroll.refresh();
				this.checkLoaded = true;
			}
		}
	},
	components:{
		Slider,
		Scroll,
		Loading
	}
}
</script>

<style>
.recommend{
	position: fixed;
	width: 100%;
	top: 88px;
	bottom: 0;
}
.recommend .recommend-content{
	height: 100%;
	overflow: hidden;
}
.recommend .slider-wrapper{
	position: relative;
	width: 100%;
    overflow: hidden;
}
.recommend .recommend-list{
	width: 100%;
    overflow: hidden;
}
.recommend .recommend-list .list-title{
	height: 65px;
	line-height: 65px;
	text-align: center;
	font-size: 14px;
	color: #ffcd32;
}	
.recommend .recommend-list .list-item{
	display: flex;
	box-sizing: border-box;
	align-items: center;
	padding: 0 20px 20px 20px;
}	
.recommend .recommend-list .list-item .icon{
	flex: 0 0 60px;
	width: 60px;
	padding-right: 20px;
}
.recommend .recommend-list .list-item .text{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-size: 14px;
	line-height: 20px;
	overflow: hidden;
}	
.recommend .recommend-list .list-item .text .name{
	margin-bottom: 10px;
	color: #FFFFFF;
}
.recommend .recommend-list .list-item .text .desc{
	color: rgba(255, 255, 255, 0.3);
}
.recommend .loading-container{
	position: absolute;
	width: 100%;
	top: 50%;
	transform: translateY(-50%);
}
</style>