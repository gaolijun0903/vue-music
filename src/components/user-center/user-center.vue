<template>
	<div class="user-center">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<div class="switches-wrapper">
			<switches :switches="switches"></switches>
		</div>
	</div>
</template>

<script>
import switches from 'base/switches/switches'	
	
export default{
	data(){
		return{
			switches:[
          {
            name: '我喜欢的'
          },
          {
            name: '最近听的'
          }]
		}
	},
	methods:{
		back(){
			
		}
	},
	components:{
		switches
	}
}
</script>

<style>
.user-center{
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	background: #222;
	z-index: 100;
}
</style>