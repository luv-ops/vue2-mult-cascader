# Vue2 MultCascader

### 📧 联系与反馈
如果使用过程中遇到问题、有功能建议，欢迎通过邮箱联系我:3110940369@qq.com

# Vue2 多级选择器组件，支持单选和多选模式。

# 适配移动端和桌面端

此组件依赖element-ui,只是el-drawer,el-tabs,el-tab-pane,el-checkbox
你可以按需引入，不必像下列例子那样引入所有的element-ui

## 安装

```
依赖element-ui
npm install element-ui
核心库
npm install mult-cascader
```

## 使用

在vue2入口文件中引入这些

```
import MultCascader from 'mult-cascader'
import 'mult-cascader/mult-cascader.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.use(MultCascader)
```

### 组件使用

```
    <template>
      <div id="app">
        <MultCascader
          ref="cascaderRef"
          :drawer="showMultCascader"
          :dataSourse="treeData"
          :names="tabNames"
          :labels="tabLabels"
          mode="multiple"
          :color="themeColor"
          :options="customOptions"
          @close="handleClose"

        />
        <button @click="showMultCascader = true">打开多选选择器</button>
        <div>已选择(最后一级个数)：{{ checkedIds.length }}</div>
        <MultCascader
          ref="cascaderRef"
          :drawer="showSingleCascader"
          :dataSourse="treeData"
          :names="tabNames"
          :labels="tabLabels"
          mode="single"
          :color="themeColor"
          :options="customOptions"
          @close="handleClose2"
          @finish="handleFinish"
          @change="handleChange"
        />
        <button @click="showSingleCascader = true">打开单选选择器</button>
      </div>
    </template>

    <script>

    export default {
      name: 'App',
      data() {
        return {
          // 控制选择器显隐
          showMultCascader: false,
          showSingleCascader: false,

          // 主题色（自定义）
          themeColor: '#409EFF',
          // 自定义字段映射（适配你的数据源字段名）
          customOptions: {
            id: 'id',       // 数据源中ID字段名
            name: 'label',  // 数据源中名称字段名
            children: 'children' // 数据源中子节点字段名
          },
          // 选项卡标识（需和层级数一致）
          tabNames: ['level1', 'level2', 'level3'],
          // 选项卡显示标签（需和层级数一致）
          tabLabels: ['一级分类', '二级分类', '三级分类'],
          // 核心：层级数据源（树形结构）
          treeData: [
            {
              id: 1,
              label: '电子产品',
              children: [
                {
                  id: 11,
                  label: '手机',
                  children: [
                    { id: 111, label: '苹果手机' },
                    { id: 112, label: '华为手机' }
                  ]
                },
                {
                  id: 12,
                  label: '电脑',
                  children: [
                    { id: 121, label: '笔记本' },
                    { id: 122, label: '台式机' }
                  ]
                }
              ]
            },
            {
              id: 2,
              label: '生活用品',
              children: [
                {
                  id: 21,
                  label: '洗漱用品',
                  children: [
                    { id: 211, label: '牙膏' },
                    { id: 212, label: '牙刷' }
                  ]
                }
              ]
            }
          ],
          // 选中结果存储
          checkedIds: [],
          selectedResult: null

        }
      },
      methods: {
        // 选择器关闭时触发（返回最终选中的ID列表）
        handleClose(ids) {
          this.showMultCascader = false
          this.checkedIds = ids
          console.log('选择器关闭，最终选中ID：', ids)
        },
        handleClose2() {
          this.showSingleCascader = false

        },
        // 单选模式下选完最后一级触发（返回完整选中数据）
        handleFinish(res) {
          this.showSingleCascader = false
          this.selectedResult = res
          console.log('单选完成，选中数据：', res)
        },

        // 单选 选中项变化时触发（实时返回选中的层级数据）
        handleChange(selectedLi) {
          console.log('选中项变化，当前层级数据：', selectedLi)
        }
      }
    }
    </script>
```

| 参数          | 类型      | 说明                         | 默认值                                              |
| ----------- |:------- | -------------------------- | ------------------------------------------------ |
| drawer      | Boolean | 控制抽屉是否显示                   | false                                            |
| data-sourse | Array   | 数据源                        | []                                               |
| names       | Array   | 选项卡名称                      | []                                               |
| labels      | Array   | 选项卡显示文本                    | []                                               |
| mode        | String  | 选择模式：'single' 或 'multiple' | 'single'                                         |
| color       | String  | 主题颜色                       | '#67C23A'                                        |
| options     | Object  | 字段映射配置                     | { id: 'id', name: 'name', children: 'children' } |

### Events

| 事件名    | 说明          | 回调参数     | 模式              |
| ------ | ----------- | -------- | --------------- |
| close  | 关闭选择器时触发    | 选中的ID数组  | single/multiple |
| change | 选择项变化时触发    | 选中的项数组   | single          |
| finish | 选完最后一级时触发关闭 | 选中的值和项数组 | single          |

```
注意异步打开此组件时，需要先有数据源，否则会报错
推荐在组件data中再定义一个变量判断数据源是否准备好然后v-if
     <MultCascader
      v-if="ready"
      ref="cascaderRef"
      :drawer="showSingleCascader"
      :dataSourse="treeData"
      :names="tabNames"
      :labels="tabLabels"
      mode="single"
      :color="themeColor"
      :options="customOptions"
      @close="handleClose2"
      @finish="handleFinish"
      @change="handleChange"
    />

比如:
data(){
    return {
        ready:false
    }
}

//开始异步请求
async openCascader() {
  const res=this.$http.get('...你的后端url')
  this.treeData=res.data
  this.ready=true
  // 打开选择器
  this.showSingleCascader = true
}
```

## License

MIT
