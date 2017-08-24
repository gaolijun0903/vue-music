<template>
<div class="search-box">
	<i class="icon-search"></i>
	<input type="text" v-model="query" class="box" :placeholder="placeholder" ref="input"/>
	<i class="icon-dismiss" v-show="query" @click="clear"></i>
</div>
</template>

<script>
import {debounce} from 'common/js/util'	
export default{
	props:{
		placeholder:{
			type:String,
			default:'搜索歌曲、歌手'
		}
	},
	data(){
		return {
			query:''
		}
	},
	created(){
		this.$watch('query',debounce((newQuery)=>{
			this.$emit('query',newQuery)   //debounce节流处理
		},200))
	},
	methods:{
		clear(){
			this.query = ''
		},
		setQuery(query){
			this.query = query;
		},
		blur(){
			this.$refs.input.blur();
		}
	}
}
</script>

<style>
.search-box{
	display: flex;
	align-items: center;
	width:100%;
	height: 40px;
	padding: 0 6px;
	box-sizing: border-box;
	background:#333;
	border-radius: 6px;
}
.search-box .icon-search{
	font-size: 24px;
	color:#222;	
}
.search-box .box{
	flex:1;
	margin:0 5px;
	font-size: 14px;
	line-height: 26px;
	background: #333;
	color:#fff;
}
.search-box .box::placeholder{
	color:rgba(255, 255, 255, 0.3);
}
.search-box .icon-dismiss{
	font-size: 16px;
	color: #222;
}
</style>