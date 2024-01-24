<template>
    <div class="box">
        <h4>{{$t("route.guide")}}</h4>
        <h5>{{$t("guide.admin")}}</h5>
    </div>
</template>

<script>
export default {
    data() {
        return {
            msg: ''
        }

    },

    mounted() { }

}

</script>

<style scoped>
.box{
    background-color: rgb(255, 255, 255);
    padding: 15px 15px;
    margin-top: 6px;
    box-shadow: 0  6px 6px #ededed;
}
</style>
