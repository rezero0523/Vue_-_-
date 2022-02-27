<template >
    <div>
        <div class="card_header">
        <span>{{title}}</span>
        <i class="el-icon-warning-outline"></i>
        </div>
        <div class="card_content">{{count}}</div>
        <div class="card_chart">
        <slot name='charts'></slot></div>
        <div class="card_footer">
        <slot name='footer'> </slot></div>
    </div>
</template>
<script>
export default {
    name:'Detail',
    props:['title','count']
}
</script>
<style scoped>
  .card_header{
    display: flex;
    justify-content: space-between;            
  }
  .card_content{
      font-size: 30px;
      padding: 10px 0;
  }
  .card_chart{
      height: 50px;
  }
  .card_footer{
      border-top: 1px solid #eee;
      padding-top: 10px;
  }
</style>