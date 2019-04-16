<template>
    <div class="footer">
      Copyright &copy; 2012-2017 izhonghong.com All rights Reserved 电话：0755--86102030 传真：0755-862542
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {

            }
        },
        computed:{

        },
        methods:{

        },
        mounted(){

        }
    }
</script>
<style scoped>
    .footer{
      width:100%;
      height:36px;
      line-height: 36px;
      text-align: center;
      background: #151515;
      position: absolute;
      bottom:0px;
      left:0px;
      z-index:10000;
      color:#dadae2;
      font-size:14px;
    }
</style>
