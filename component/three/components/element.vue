<template>
    <div class="element" :style="style">
        <div class="number"></div>
        <div class="symbol"></div>
        <div class="details"></div>
    </div>
</template>

<script>
export default {
    data() {
        const alpha=Math.random() * 0.5 + 0.25;
        return {
            style:{
                backgroundColor: `rgba(0, 127, 127, ${alpha})`
            }
        }
    },
}
</script>

<style lang="scss" scoped>

</style>