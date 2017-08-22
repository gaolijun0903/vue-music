<template>
<transition name="listFade">
	<div class="playlist" @click="hide" v-show="showFlag">
		<div class="list-wrapper" @click.stop>
			<div class="list-header">
				<div class="title">
					<i class="icon" :class="iconMode" @click.stop="changeMode"></i>
					<span class="text">{{modeText}}</span>
					<span class="clear" @click="showConfirm">
						<i class="icon-clear"></i>
					</span>
				</div>	
			</div>
			
			<scroll ref="listContent" class="list-content" :data="sequenceList">
				<transition-group ref="list" name="list" tag="ul">
					<li class="item" :key="song.id" v-for="(song,index) in sequenceList" @click="selectSong(song,index)">
						<i class="current" :class="getCurrentCls(song)"></i>
						<span class="text">{{song.name}}</span>
						<span class="like" @click.stop="toggleFavourite(song)">
							<i class=""></i>
						</span>
						<span class="delete" @click.stop="deleteOne(song)">
							<i class="icon-delete"></i>
						</span>
					</li>
				</transition-group>	
			</scroll>
			
			<div class="list-operate">
				<div class="add" @click="showAddSong">
					<i class="icon-add"></i>
					<span class="text">添加歌曲到队列</span>
				</div>
			</div>
			<div class="list-close" @click="hide">关闭</div>
		</div>
		<add-song ref="addSong"></add-song>
		<confirm ref="confirm" text="确定要清空播放列表" confirmBtnText="清空" @confirm="confirmClear"></confirm>
	</div>
</transition>	
</template>

<script>
import {mapGetters,mapActions,mapMutations} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Scroll from 'base/scroll/scroll'
import confirm from 'base/confirm/confirm'
import addSong from 'components/add-song/add-song'


export default{
	data(){
		return{
			showFlag:false
		}
	},
	computed:{
		modeText(){
			return this.mode===playMode.sequence ? '顺序播放' : this.mode===playMode.loop ? '单曲循环' : '随机播放';
		},
		iconMode(){
			return this.mode===playMode.sequence ? 'icon-sequence' : this.mode===playMode.loop ? 'icon-loop' : 'icon-random';
		},
		...mapGetters([
			'playList',
			'sequenceList',
			'currentSong',
			'mode'
		])
	},
	methods:{
		show(){
			this.showFlag = true;
			setTimeout(()=>{
				this.$refs.listContent.refresh();
				this.scrollToCurrent(this.currentSong);
			},20)
		},
		hide(){
			this.showFlag = false;
		},
		confirmClear(){
			this.clearSongList();
			this.hide();
		},
		getCurrentCls(item){
			return this.currentSong.id === item.id ? 'icon-play' : ''
		},
		scrollToCurrent(song){
			let index = this.sequenceList.findIndex((item)=>{
				return item.id === song.id
			})
			this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index],300);
		},
		selectSong(item,index){
			if(this.mode === playMode.random){
				index = this.playList.findIndex((song)=>{
					return song.id===item.id
				})
			}
			this.setCurrentIndex(index);
			this.setPlayingState(true);
		},
		changeMode(){//播放模式切换
			const mode = (this.mode + 1) % 3;
			this.setPlayMode(mode);
			//修改歌曲列表
			let list = null;
			if(mode === playMode.random){
				list = shuffle(this.sequenceList);
			}else{
				list = this.sequenceList;
			}
			//设置currentIndex
			this._resetCurrentIndex(list);//注意顺序，最后设置playlist
			this.setPlayList(list);
		},
		_resetCurrentIndex(list){
			let index = list.findIndex((item)=>{        //----ES6语法！！！！
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index);
		},
		toggleFavourite(item){
			
		},
		showConfirm(){
			this.$refs.confirm.show()
		},
		deleteOne(item){
			this.deleteSong(item)
		},
		showAddSong(){
			this.$refs.addSong.show();
		},
		...mapActions([
			'deleteSong',
			'clearSongList'
		]),
		...mapMutations({
			setCurrentIndex: 'SET_CURRENTINDEX',
			setPlayMode:'SET_PLAY_MODE',
			setPlayList:'SET_PLAYLIST',
			setPlayingState:'SET_PLAYING_STATE'
		})
	},
	watch:{
		currentSong(newSong,oldSong){
			if(!this.showFlag || newSong.id===oldSong.id){
				return
			}
			setTimeout(()=>{
				this.scrollToCurrent(newSong);
			},20)
		}
	},
	components:{
		Scroll,
		confirm,
		addSong
	}
}
</script>

<style>
.playlist{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 200;
	background: rgba(0, 0, 0, 0.3);
}
.playlist.listFade-enter-active,.playlist.listFade-leave-active{
	transition: opacity 0.3s;
}
.playlist.listFade-enter-active .list-wrapper,.playlist.listFade-leave-active .list-wrapper{
	transition: all 0.3s;
}
.playlist.listFade-enter,.playlist.listFade-leave-to{
	opacity: 0;
}
.playlist.listFade-enter .list-wrapper,.playlist.listFade-leave-to .list-wrapper{
	transform:translate3d(0,100%,0);
}
.playlist .list-wrapper{
	position: absolute;
	bottom: 0;
	width: 100%;
	background-color:#333;
}
.playlist .list-wrapper .list-header{
	position: relative;
	padding: 20px 30px 10px 20px;
	
}
.playlist .list-wrapper .list-header .title{
	display: flex;
	align-items: center;
}
.playlist .list-wrapper .list-header .title .icon{
	margin-right: 10px;
	font-size: 30px;
	color: rgba(255, 205, 49, 0.5);
}
.playlist .list-wrapper .list-header .title .text{
	flex: 1;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.5);
}
.playlist .list-wrapper .list-header .title .clear{
	position: relative;
}
.playlist .list-wrapper .list-header .title .clear:before,.playlist .list-wrapper .list-content .item .like:before,.playlist .list-wrapper .list-content .item .delete:before{
	content: '';
	position: absolute;
	top: -10px;
	left: -10px;
	right: -10px;
	bottom: -10px;
}
.playlist .list-wrapper .list-header .title .clear .icon-clear{
	font-size: 14px;
	color: rgba(255, 255, 255, 0.5);
}

.playlist .list-wrapper .list-content{
	max-height: 240px;
	overflow: hidden;
}
.playlist .list-wrapper .list-content .item{
	display: flex;
	align-items: center;
	padding: 0 30px 0 20px;
	height: 40px;
	overflow: hidden;
}
.item.list-enter-active, .item.list-leave-active{
	transition: all 0.1s;
}
.item.list-enter, .playlist .list-wrapper .list-content .item.list-leave-to{
	height:0;
}
.playlist .list-wrapper .list-content .item .current{
	flex: 0 0 20px;
	width: 20px;
	font-size: 12px;
	color: rgba(255, 205, 49, 0.5);
}
.playlist .list-wrapper .list-content .item .text{
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.3);
}
.playlist .list-wrapper .list-content .item .like{
	position: relative;
}
.playlist .list-wrapper .list-content .item .delete{
	position: relative;
}
.playlist .list-wrapper .list-content .item .delete .icon-delete{
	color:#ffcd32;
	font-size: 12px;
}

.playlist .list-wrapper .list-operate{
	width: 140px;
	margin: 20px auto 30px auto;
}
.playlist .list-wrapper .list-operate .add{
	display: flex;
	align-items: center;
	padding: 8px 16px;
	border: 1px solid  rgba(255, 255, 255, 0.5);
	border-radius: 100px;
	color: rgba(255, 255, 255, 0.5);
}
.playlist .list-wrapper .list-operate .add .icon-add{
	margin-right: 5px;
	font-size: 10px;
}
.playlist .list-wrapper .list-operate .add .text{
	font-size: 12px;
}
.playlist .list-wrapper .list-close{
	text-align: center;
	line-height: 50px;
	font-size: 16px;
	color: rgba(255, 255, 255, 0.5);
	background: #222;
}
</style>