<template>
    <div >
        <n-button  @click="show('grid')">showGrid</n-button>
        <n-button  @click="show('three')">showThree</n-button>
        <component :is="presentComponents"></component>
    </div>
    
</template>

<script>
import grid from './component/grid/index'
import three from './component/three/index'

export default {
    components: {
        grid,
        three
    },
    data() {
        return {
            presentComponents: 'grid'
        }
    },
    methods: {
        show(name) {
            const vm = this;
            vm.presentComponents=name
        }
    },
}
</script>

<style lang="scss" scoped>
</style>