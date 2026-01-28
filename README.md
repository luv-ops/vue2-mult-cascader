# Vue2 MultCascader

Vue2 多级选择器组件，支持单选和多选模式。

## 安装

```bash
npm install vue2-mult-cascader --save
```

## 使用



### 组件使用
```html
<template>
  <div>
    <el-button @click="drawer = true">打开选择器</el-button>
    <vue2-mult-cascader
      :drawer.sync="drawer"
      :data-sourse="dataSourse"
      :names="['level1', 'level2', 'level3']"
      :labels="['一级', '二级', '三级']"
      :mode="'multiple'"
      :color="'#67C23A'"
      :options="{ id: 'id', name: 'name', children: 'children' }"
      @close="handleClose"
    ></vue2-mult-cascader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      dataSourse: [
        {
          id: 1,
          name: '选项1',
          children: [
            {
              id: 11,
              name: '选项1-1',
              children: [
                { id: 111, name: '选项1-1-1' },
                { id: 112, name: '选项1-1-2' }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleClose(selectedIds) {
      console.log('选中的ID:', selectedIds)
    }
  }
}
</script>
```

## API

### Props

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| drawer | Boolean | 控制抽屉是否显示 | false |
| data-sourse | Array | 数据源 | [] |
| names | Array | 选项卡名称 | [] |
| labels | Array | 选项卡显示文本 | [] |
| mode | String | 选择模式：'single' 或 'multiple' | 'single' |
| color | String | 主题颜色 | '#67C23A' |
| options | Object | 字段映射配置 | { id: 'id', name: 'name', children: 'children' } |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| close | 关闭选择器时触发 | 选中的ID数组 |
| change | 选择项变化时触发 | 选中的项数组 |
| finish | 选完最后一级时触发 | 选中的值和项数组 |

## 发布步骤



```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/luv-ops/vue2-mult-cascader.git
git push -u origin master
```


## License

MIT