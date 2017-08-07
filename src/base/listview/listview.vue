<template>
<scroll class="listview" 
		ref="listview"
		:data="data" 
		:listen-scroll="listenScroll"
		:probe-type="probeType"
		@scroll="scroll">
	<ul>
		<li class="list-group" v-for="group in data" ref="listGroup">
			<h2 class="list-group-title">{{group.title}}</h2>
			<ul>
				<li class="list-group-item" v-for="item in group.items" @click="selectItem(item)">
					<img class="avatar" v-lazy="item.avatar"/>
					<span class="name">{{item.name}}</span>
				</li>
			</ul>
		</li>
	</ul>
	<div class="list-shortcut" 
		@touchstart="onShortcutTouchStart"
		@touchmove.stop.prevent="onShortcutTouchMove"
		@touchend.stop>
		<ul>
			<li class="item" 
				v-for="(item,index) in shortcutList" 
				:data-index="index"
				:class="{'current': currentIndex=== index}">{{item}}</li>
		</ul>
	</div>
	<div class="list-fixed" v-show="fixedTitle" ref="fixedTitle">
		<h1 class="fixed-title">{{fixedTitle}}</h1>
	</div>
	<div class="loading-container" v-show="!data.length">
		<loading></loading>
	</div>
</scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom'
const ANCHOR_HEIGHT = 18;
const FIXED_TITLE_HEIGHT = 30;

export default{
	props:{
		data:{
			type: Array,
			default: []
		}
	},
	data(){
		return{
			scrollY: -1,
			currentIndex: 0,
			diff: -1
		}
	},
	created(){
		this.touch = {};
		this.listenScroll = true;
		this.listHeight = [];
		this.probeType = 3;
	},
	computed:{
		shortcutList(){
			return this.data.map((group)=>{
				return group.title.substr(0,1);
			})
		},
		fixedTitle(){
			if(this.scrollY>0){
				return ''
			}
			return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
		}
	},
	methods:{
		selectItem(item){
			this.$emit('selectItem',item);
		},
		onShortcutTouchStart(e){
			let anchorIndex = getData(e.target,'index');
			let firstTouch = e.touches[0];
			this.touch.y1 = firstTouch.pageY;
			this.touch.anchorIndex = anchorIndex;
			this._scrollToEle(anchorIndex);
		},
		onShortcutTouchMove(e){
			let firstTouch = e.touches[0];
			this.touch.y2 = firstTouch.pageY;
			//滑动了多少个元素
			let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;  
			let anchorIndex = parseInt(this.touch.anchorIndex) + delta;  //滑动到元素的index
			this._scrollToEle(anchorIndex);
		},
		scroll(pos){
			this.scrollY = pos.y;
		},
		_scrollToEle(index){
			//右侧快速入口的上下有块空白区域，此处index=null，点击不做处理
			if(!index && index !== 0){
				return
			}
			//右侧快速入口的上下有块空白区域，滑动时到这个位置后index变成（负值/无穷大值），滑动到此处，不做处理
			if(index < 0){
				index = 0;
			}else if(index > this.listHeight.length-2){
				index = this.listHeight.length -2;
			}
			this.scrollY = -this.listHeight[index];
			this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0);
		},
		_calculateHeight(){
			this.listHeight = [];
			let list = this.$refs.listGroup;
			let height =0;
			this.listHeight.push(height);
			for(let i=0; i<list.length; i++){
				let item = list[i];
				height += item.clientHeight;
				this.listHeight.push(height);
			}
		}
	},
	watch:{
		data(){
			setTimeout(()=>{
				this._calculateHeight()
			},20)
		},
		scrollY(newY){
			const listHeight = this.listHeight;
			//当滚动到顶部，newY>0
			if(newY>0){
				this.currentIndex = 0;
				return
			}
			//在中间位置滚动
			for(let i=0; i<listHeight.length-1; i++){
				let height1 = listHeight[i];
				let height2 = listHeight[i+1];
				if(-newY>=height1 && -newY<height2){
					this.diff = height2 + newY;
					this.currentIndex = i;
					return
				}
			}
			//当滚动到底部，且-newY大于最后一个元素的上限
			this.currentIndex = listHeight.length-2;
		},
		diff(newDiff){
			let fixedTop = (newDiff>0 && newDiff <FIXED_TITLE_HEIGHT) ? newDiff-FIXED_TITLE_HEIGHT : 0
			//这样可以减少DOM操作频度
			if(this.fixedTop === fixedTop){
				return
			}
			this.fixedTop = fixedTop;
			this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`
		}
	},
	components:{
		Scroll,
		Loading
	}
}
</script>

<style>
.listview{
	position: relative;
	overflow: hidden;
	width: 100%;
	height: 100%;
}
.listview .list-group{
	padding-bottom: 30px;
}
.listview .list-group .list-group-title{
	padding-left: 20px;
	height: 30px;
	line-height: 30px;
	font-size: 12px;
	color: rgba(255, 255, 255, 0.5);
	background-color: #333;
}
.listview .list-group .list-group-item{
	display: flex;
	align-items: center;
	padding:20px 0 0 30px;
}
.listview .list-group .list-group-item .avatar{
	width: 50px;
	height: 50px;
	border-radius: 50%;
}
.listview .list-group .list-group-item .name{
	margin-left: 20px;
	font-size: 14px;
	color:rgba(255, 255, 255, 0.5);
}

.listview .list-shortcut{
	position: absolute;
	top: 50%;
	right: 0;
	transform:translateY(-50%);
	z-index: 30;
	width: 20px;
	padding: 20px 0;
	border-radius: 10px;
	text-align: center;
	background: rgba(0, 0, 0, 0.3);
	font-family: Helvetica;
}
.listview .list-shortcut .item{
	padding: 3px;
	font-size: 12px;
	color: rgba(255, 255, 255, 0.5);
}
.listview .list-shortcut .item.current{
	color: #ffcd32;
}

.listview .list-fixed{
	position: absolute;
	top: 0;
	height: 0;
	width: 100%;
}
.listview .list-fixed .fixed-title{
	padding-left: 20px;
	height: 30px;
	line-height: 30px;
	font-size: 12px;
	color: rgba(255, 255, 255, 0.5);
	background-color: #333;
}
.listview .loading-container{
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 100%;
}
      
</style>