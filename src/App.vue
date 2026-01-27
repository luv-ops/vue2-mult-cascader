<template>
  <div id="app">
    <VirtualList :items="a" :itemHeight="30" />
    <Casader :dataSourse="dataSourse" :drawer="drawer"
    :names="['level1', 'level2', 'level3']"
    :labels="['第一级', '第二级', '第三级']"
    @change="handleChange"
    @finish="handleFinish"
    @close="handleClose"

    />
    <button @click="()=>drawer=true">点击</button>
  </div>
</template>

<script>
import VirtualList from './components/VirtualList.vue';
import Casader from './components/MultCascader.vue';
export default {
  name: 'App',
  components:{
    VirtualList,
    Casader
  },
  data(){
    return{
      a:[],
      dataSourse : 
      [
        {
          id: '1',
          name: '第一级选项1',
          children: [
            {
              id: '1-1',
              name: '第二级选项1-1',
              children: [
                { id: '1-1-1', name: '第三级选项1-1-1' },
                { id: '1-1-2', name: '第三级选项1-1-2' },
                { id: '1-1-3', name: '第三级选项1-1-3' }
              ]
            },
            {
              id: '1-2',
              name: '第二级选项1-2',
              children: [
                { id: '1-2-1', name: '第三级选项1-2-1' },
                { id: '1-2-2', name: '第三级选项1-2-2' }
              ]
            }
          ]
        },
        {
          id: '2',
          name: '第一级选项2',
          children: [
            {
              id: '2-1',
              name: '第二级选项2-1',
              children: [
                { id: '2-1-1', name: '第三级选项2-1-1' },
                { id: '2-1-2', name: '第三级选项2-1-2' },
                { id: '2-1-3', name: '第三级选项2-1-3' },
                { id: '2-1-4', name: '第三级选项2-1-4' }
              ]
            }
          ]
        },
        {
          id: '3',
          name: '第一级选项3',
          children: [
            {
              id: '3-1',
              name: '第二级选项3-1',
              children: []
            },
            {
              id: '3-2',
              name: '第二级选项3-2',
              children: [
                { id: '3-2-1', name: '第三级选项3-2-1' }
              ]
            }
          ]
        }
      ],
      drawer:false,
      values:[]
    }
  },
  mounted(){
    for(let i=0;i<100;i++){
      this.a.push(i)
    }
  },
  methods:{
    
    handleFinish({values,selected}){

      this.values=values
      
      this.drawer=false
    },
    handleClose(){

      this.drawer=false
    },
    handleChange(selected){
      // console.log(selected);

    },
  }
  
}
</script>

<style>

</style>
