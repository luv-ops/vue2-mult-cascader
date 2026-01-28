import MultCascader from "./MultCascader.vue";
const components = [MultCascader];
const install = function (Vue) {
    components.forEach((component) => {
        Vue.component(component.name, component);
    });
};
export default install;