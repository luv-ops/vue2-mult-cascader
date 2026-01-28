<template>

    <el-drawer

        :style="themeStyles"
        :visible.sync="drawer"
        direction="btt"
        size="60%"
        :before-close="()=>$emit('close',this.getCheckedIds())"  
        :close-on-press-escape="false"
        :with-header="false"
    >
            <el-tabs  v-model="activeName"  style="padding: 10px;">
                <el-tab-pane
                    v-for="item in filteredSourse"
                    :key="item.index"
                    :label="item.label"
                    :name="item.name"
                    
                >
                    <ul  v-if="mode==='single'">
                        <li 
                        :class="{'selected-text': selectedCache[item.index][ele[options.id]]}"
                        v-for="ele in item.data" :key="ele[options.id]" @click="clickLi(ele,item.index)">  <!-- key改用options.id -->
                            <span  >
                                {{ ele[options.name] }}  <!-- 显示名称改用options.name -->
                            </span>
                            <i v-if="selectedCache[item.index][ele[options.id]]" class="el-icon-check"></i>
                        </li>
                    </ul>
                    <ul v-else >
                        <li v-for="ele in item.data" :key="ele[options.id]">  <!-- key改用options.id -->
                            <span class="checkboxSpan" :class="{'selected-text': selectedCache[item.index][ele[options.id]]}">
                                <el-checkbox  v-model="selectedCache[item.index][ele[options.id]]" @change="handleChange($event,ele,item.index)" style="margin-right: 40px;"></el-checkbox>
                                <span @click="clickLi(ele,item.index)" >{{ ele[options.name] }}</span>  <!-- 显示名称改用options.name -->
                            </span>
                        </li>
                    </ul>
                </el-tab-pane>
            </el-tabs>

    </el-drawer>

</template>
<script>
    export default {
        name:'MultCascader',
        data(){
            return{
                selectedCache: {  },
                selectedLi: [], 

                activeName: this.names[0],
                dataSourseLevel:0,
            }
        },

        props:{
            mode: {
                type: String,
                default: 'single' // 默认为单选模式
            },
            drawer: {
                type: Boolean,
                default: false
            },
            dataSourse: {
                type: Array,

                default: () => []
            },
            names: {
                type: Array,
                default: () => [] 
            },
            labels: {
                type: Array,
                required: true,
                default: () => []
            },
            color: {
                type: String,
                default: '#67C23A'
            },
            options: {
                type: Object,
                default: () => ({
                    id: 'id',       // ID字段名
                    name: 'name',   // 名称字段名
                    children: 'children' // 子节点字段名
                })
            },
        },

        beforeMount(){


            this.dataSourseLevel = this.getDataSourseLeval(this.dataSourse);


            // 新增：初始化 selectedCache
            this.initSelectedCache();

            if(this.names.length!=this.dataSourseLevel|| this.labels.length!=this.dataSourseLevel){
                throw new Error('names和labels的长度必须与dataSourse的层级数相同');
            }

        },

        computed:{
            // 优化：添加缓存机制，避免重复计算
            forEachSourse(){
                // 缓存检查
                const currentSelectedLi = JSON.stringify(this.selectedLi);
                const currentAreaOptions = JSON.stringify(this.dataSourse);

                if (this._cachedSourse && 
                    currentSelectedLi === this._cachedSelectedLi &&
                    currentAreaOptions === this._cachedAreaOptions) {
                    return this._cachedSourse;
                }
                const result = this.names.map((name, index) => {
                    const level = index + 1; // 层级从1开始（index0=第1级）
                    const label = this.labels[index] || `层级${level}`; // 显示文本（默认值容错）

                    // 动态计算当前层级的数据源：
                    // - 第1级（index=0）：用顶层数据 dataSourse
                    // - 第n级（index≥1）：用 selectedLi 中第 index-1 项的 children
                    const data = index === 0 
                        ? this.dataSourse // 第一级数据固定为 props.dataSourse
                        : (this.selectedLi.length >= index 
                            ? this.selectedLi[index - 1]?.[this.options.children] || [] // 上一级选中项的子项
                            : []);

                    return {
                        index: level, // 层级编号（1,2,3...）
                        name: name,   // 选项卡标识（来自 props.names）
                        label: label, // 显示文本（来自 props.labels）
                        data: data    // 数据源（动态计算）
                    };
                });

                // 更新缓存
                this._cachedSourse = result;
                this._cachedSelectedLi = currentSelectedLi;
                this._cachedAreaOptions = currentAreaOptions;

                return result;
            },
            themeStyles() {
                return {
                    '--theme-color': this.color // 核心：将 props.color 赋值给 CSS 变量
                };
            },
            filteredSourse(){
                return this.forEachSourse.filter(item=>item.data&&item.data.length>0)
            }
        },
        methods:{
            // 新增：初始化 selectedCache 方法
            initSelectedCache() {
                this.selectedCache = {};
                // 根据实际层级数生成对应的缓存对象

                //应该使用$set来初始化确保响应式,不然checkbox不会响应式更新
                for (let i = 1; i <= this.dataSourseLevel; i++) {
                    this.$set(this.selectedCache, i, {});
                }
            },
            getDataSourseLeval(item, currentLevel = 0) {
                if (!Array.isArray(item) || item.length <= 0) {
                    return currentLevel;
                }
                let maxLeval = currentLevel;
                for (const ele of item) {
                // 替换children字段
                    const childLevel = this.getDataSourseLeval(ele[this.options.children], currentLevel + 1);  // 改为options.children
                    if (childLevel > maxLeval) {
                        maxLeval = childLevel;
                    }
                }
                return maxLeval;
            },         
            clickLi(item,index){

                if(this.mode=='single'){
                    if(this.selectedLi.length>index-1){
                        // 关键：先清空当前层级及后续层级的选中状态（因为选择低级会重置高级）
                        for (let i = index; i <= this.dataSourseLevel; i++) {
                            this.selectedCache[i] = {};

                            if(this.selectedLi.length>i-1){
                                this.selectedLi.splice(i-1,this.selectedLi.length-i+1)
                            }
                        }



                    }

                    this.selectedLi.push(item)


                    // 标记当前层级的当前item为选中
                    this.selectedCache[index][item[this.options.id]] = true;



                    if(index>=this.dataSourseLevel){
                        this.values=this.selectedLi.map(ele=>ele.name)
                        this.$emit('finish',{values:this.values,selected:this.selectedLi})
                    }else{

                        this.activeName=this.names[index]
                    }

                    this.$emit('change',this.selectedLi)

                    return;
                }
                //多选
                if(this.selectedLi.length>index-1){
                    // 优化：清空当前层级及后续层级的选中状态
                    for (let i = index; i <= this.dataSourseLevel; i++) {


                        if(this.selectedLi.length>i-1){
                            this.selectedLi.splice(i-1,this.selectedLi.length-i+1)
                        }
                    }
                }

                this.selectedLi.push(item)

                if(index>=this.dataSourseLevel){
                    this.values=this.selectedLi.map(ele=>ele.name)

                }else{
                    this.activeName=this.names[index]
                }
            },


            // 优化：使用迭代替代递归，避免栈溢出
            handleChange(checked,item,index){
                const startTime = performance.now(); // 性能监控



                // this.selectedCache[index][item[this.options.id]]=checked;
                this.$set(this.selectedCache[index], item[this.options.id], checked);

                // 迭代选中所有子项
                if (item[this.options.children] && item[this.options.children].length > 0) {  // 改为options.children
                    this.iterativeCheck(index + 1, checked, item[this.options.children]);  // 传入子节点时用options.children
                }


                // 检查父级选中状态
                this.checkParentSelection(index);

                // 性能监控输出
                const endTime = performance.now();
                if (endTime - startTime > 100) { // 超过100ms警告
                    console.warn(`handleChange执行时间较长: ${endTime - startTime}ms`);
                }
            },

            // 优化：迭代算法替代递归
            iterativeCheck(level, checked, children) {
                // 如果没有子项（children 为空或长度为 0），直接退出方法，不需要处理。
                if (!children || children.length === 0) return;
                // 优化：使用数组模拟栈，避免递归深度问题
                const stack = [];
                //统计处理数量
                let processedCount = 0;
                const MAX_PROCESS_COUNT = 10000; // 防止无限循环

                // 初始化栈，把当前层级的所有子项（children）放进栈里，每个子项都包装成一个对象
                children.forEach(child => {
                    stack.push({ child, currentLevel: level });
                });

                // 迭代处理
                while (stack.length > 0 && processedCount < MAX_PROCESS_COUNT) {
                    //出栈
                    const { child, currentLevel } = stack.pop();
                    // 统计处理数量+1
                    processedCount++;
                    // 检查 selectedCache 中当前层级（currentLevel）是否有记录
                    // 如果没有，初始化一个空对象
                    if (!this.selectedCache[currentLevel]) {
                        this.$set(this.selectedCache, currentLevel, {});
                    }



                    this.$set(this.selectedCache[currentLevel], child[this.options.id], checked);


                    // 处理子节点
                    if (child[this.options.children] && child[this.options.children].length > 0) {  // 改为options.children
                        child[this.options.children].forEach(grandChild => {  // 改为options.children
                            stack.push({ child: grandChild, currentLevel: currentLevel + 1 });
                        });
                    }
                }

                // 性能保护警告
                if (processedCount >= MAX_PROCESS_COUNT) {
                    console.warn('处理数量超过限制，可能存在性能问题');
                }
            },

            // 优化：改进父级检查逻辑
            checkParentSelection(currentLevel) {
                if (currentLevel <= 1) return;
                //父层级
                const parentLevel = currentLevel - 1;
                //父级数据
                const parentData = this.selectedLi[parentLevel - 1];

                if (!parentData || !parentData[this.options.children]) return;  // 改为options.children

    // 检查所有子节点是否被选中（替换children和id字段）
                const allChildrenSelected = parentData[this.options.children].every(child => {  // 改为options.children
                    const levelCache = this.selectedCache[currentLevel];
                    return levelCache && levelCache[child[this.options.id]] === true;  // 改为options.id
                });
                // 更新父节点选中状态（替换id字段）
                if (allChildrenSelected) {
                    this.selectedCache[parentLevel][parentData[this.options.id]] = true;  // 改为options.id
                } else {
                    this.selectedCache[parentLevel][parentData[this.options.id]] = false;  // 改为options.id
                }

                // 递归检查更高级别的父级
                this.checkParentSelection(parentLevel);
            },


// 修改checkParentSelection方法

            getCheckedIds(){


                const ids=[]

                for(let id in this.selectedCache[this.dataSourseLevel]){
                    if(this.selectedCache[this.dataSourseLevel][id]){
                        ids.push(id)
                    }
                }

                return ids
            },

        },
        // 生命周期优化
        beforeDestroy() {
            // 清理缓存

            this._cachedSourse = null;
            this._cachedSelectedLi = '';
            this._cachedAreaOptions = null;
        },



    }
</script>
<style scoped>
    .el-checkbox >>> .el-checkbox__inner {
        border-color: var(--theme-color) !important;
    }
    .el-tabs >>> .el-tabs__item.is-active {
        color: var(--theme-color) !important;
    }

    /* 修改激活标签的下划线颜色和高度 */
    .el-tabs >>> .el-tabs__active-bar {
        background-color: var(--theme-color) !important;
    }

    .selected-text {
        color: var(--theme-color) !important;
    }
    ul {
        padding: 0;
        margin: 0;
        border:none;
        width: 100%;

    }

/* 列表项样式 */
    li {
        padding: 12px 16px;
        margin: 8px 0;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.04);
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>