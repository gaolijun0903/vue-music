<template>
	<music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
</template>

<script>
import musicList from 'components/music-list/music-list'
import {getToplist} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from "common/js/song"
import {mapGetters} from 'vuex'

export default{
	data(){
		return{
			songs:[],
			rank:true
		}
	},
	computed:{
		title(){
			return this.toplist.topTitle
		},
		bgImage(){
			if(this.songs.length){
				return this.songs[0].image
			}
			return ''
		},
		...mapGetters([
			'toplist'
		])
	},
	created(){
		this._getToplist();
	},
	methods:{
		_getToplist(){
			if(!this.toplist.id){
				this.$router.push({path:'/rank'})
				return
			}
			getToplist(this.toplist.id,this.toplist.type).then((res)=>{
				if(res.code===ERR_OK){
					this.songs = this._normalizeSonglist(res.songlist);
				}
			})
		},
		_normalizeSonglist(list){
			let ret = [];
			list.forEach((item)=>{
				if(item.data.songid && item.data.songmid){
					ret.push(createSong(item.data))
				}
			})
			return ret
		}
	},
	components:{
		musicList
	}
}
</script>

<style>
</style>