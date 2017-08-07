<template>
<div class="song-list">
	<ul>
		<li class="item" v-for="song in songs">
			<div class="rank">
				
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
		}
	},
	methods:{
		getDesc(song){
			return `${song.singer}-${song.album}`
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
.song-list .item .rank{
	flex:0 0 25px;
	width: 25px;
	margin-right: 30px;
	text-align: center;
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