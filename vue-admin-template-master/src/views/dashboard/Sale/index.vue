<template>
  <el-card class="box-card">
    <!-- 头部区域 -->
    <div slot="header" class="clearfix">
      <!-- <el-tabs v-model="activeName" @tab-click="handleClick"></el-tabs> -->
      <el-tabs class="tab" v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="销售额" name="sale" ></el-tab-pane>
        <el-tab-pane label="访问量" name="visit" ></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="16">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="8" class="cright">
          <h3>门店{{title}}排名</h3>
          <ul>
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">4</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">5</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span class="rindex">6</span>
              <span>肯德基</span>
              <span class="rvalue">123456</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>
<script>
import * as echarts from "echarts";
import dayjs from 'dayjs'
import { mapState } from "vuex";
export default {
  name: "sale",
  data() {
    return {
      activeName: "sale",
      myCharts:null,
      date:['','']
    };
  },
  computed: {
      title(){
          return this.activeName == 'sale' ? '销售额':'访问量'
      },
     ...mapState({
       listState: state =>state.home.list
     })
  },
  methods: {
      tabClick(tab){
          this.myCharts.setOption({
              title:{
                  text:this.title
              },
              xAxis:{
                data:this.title=='销售额'?this.listState.orderFullYearAxis:this.listState.userFullYearAxis
              }
          })
      },
      setDay(){
          const day = dayjs().format('YYYY-MM-DD')
          this.date=[day,day]
        // this.$set(this,'date',[day,day])
      },
      setWeek(){
          const day1 = dayjs().day(1).format('YYYY-MM-DD')
          const day2 = dayjs().day(7).format('YYYY-MM-DD')
          this.date=[day1,day2]
      },
      setMonth(){
          const day1 = dayjs().startOf('month').format('YYYY-MM-DD')
          const day2 = dayjs().endOf('month').format('YYYY-MM-DD')
          this.date=[day1,day2]
      },
      setYear(){
          const day1 = dayjs().startOf('year').format('YYYY-MM-DD')
          const day2 = dayjs().endOf('year').format('YYYY-MM-DD')
          this.date=[day1,day2]
      }
            
    },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts);
    this.myCharts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
  
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
          color: "yellowgreen",
        },
      ],
    });
  },
};
</script>
<style scoped>
div >>> el-card_header {
  border-bottom: none;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.date {
  width: 250px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
.cright span {
  margin: 0 20px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px;
}
.rindex {
  float: left;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>
