<template>
<div class="song-list">
	<ul>
		<li class="item" v-for="(song,index) in songs" @click="selectSong(song,index)">
			<div class="ranknum" v-show="rank">
				<span :class="getRankCls(index)" v-html="getRankText(index)"></span>
			</div>
			<div class="content">
				<h2 class="name">{{song.name}}</h2>
				<p class="desc">{{getDesc(song)}}</p>
			</div>
		</li>
	</ul>
</div>
</template>

<script>
export default{
	props:{
		songs:{
			type:Array,
			default:[]
		},
		rank:{
			type:Boolean,
			default:false
		}
	},
	methods:{
		getRankCls(index){
			if(index<=2){
				return `icon icon${index}`
			}else{
				return 'text'
			}
		},
		getRankText(index){
			if(index>2){
				return index+1
			}else{
				return ''
			}
		},
		getDesc(song){
			return `${song.singer}-${song.album}`;
		},
		selectSong(item,index){
			this.$emit('select',item,index);
		}
	}
}
</script>

<style>
.song-list .item{
	display: flex;
	align-items: center;
	font-size: 14px;
	height: 64px;
	box-sizing: border-box;
}
.song-list .item .ranknum{
	flex:0 0 25px;
	width: 25px;
	margin-right: 30px;
	text-align: center;
}
.song-list .item .ranknum .text{
	font-size: 18px;
	color: #FFFFFF;
}
.song-list .item .ranknum .icon{
	display: inline-block;
	width: 25px;
	height: 24px;
	background-size: 25px 24px;
}
.song-list .item .ranknum .icon0{
	background-image:url(first@2x.png);
}
.song-list .item .ranknum .icon1{
	background-image:url(second@2x.png);
}
.song-list .item .ranknum .icon2{
	background-image:url(third@2x.png);
}

.song-list .item .content{
	flex:1;
	line-height: 30px;
	overflow: hidden;
}
.song-list .item .content .name{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: #FFFFFF;
}
.song-list .item .content .desc{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-top: 4px;
	color: rgba(255, 255, 255, 0.3);
}
</style>