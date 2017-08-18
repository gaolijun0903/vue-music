<template>
<div class="history-list" v-show="searches.length">
	<transition-group name="list" tag="ul">
		<li :key="item" class="search-item" v-for="item in searches" @click="selectItem(item)">
			<span class="text">{{item}}</span>
			<span class="icon" @click.stop="deleteOne(item)">
				<i class="icon-delete"></i>
			</span>
		</li>
	</transition-group>
</div>
</template>

<script>
export default{
	props:{
		searches:{
			type:Array,
			default:[]
		}
	},
	methods:{
		selectItem(item){
			this.$emit('select',item)
		},
		deleteOne(item){
			this.$emit('delete',item)
		}
	}
}
</script>

<style>
.history-list .search-item{
	display: flex;
	align-items: center;
	height: 40px;
	overflow: hidden;
}
.history-list .search-item.list-enter-active,.history-list .search-item.list-leave-active{
	transition: all 0.1s;
}
.history-list .search-item.list-enter,.history-list .search-item.list-leave-to{
	height: 0;
}
.history-list .search-item .text{
	flex: 1;
	color: rgba(255, 255, 255, 0.5);
}
.history-list .search-item .icon{
	position: relative;
}
.history-list .search-item .icon:before{
	content:'';
	position: absolute;
	top: -10px;
	left: -10px;
	right: -10px;
	bottom: -10px;
}
.history-list .search-item .icon .icon-delete{
	font-size: 12px;
	color:rgba(255, 255, 255, 0.3);
}
</style>