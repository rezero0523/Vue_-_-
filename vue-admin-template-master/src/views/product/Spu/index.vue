<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示SPU列表的结构 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table border style="width: 100%" :data="records">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前类spu的全部实例sku"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->, sizes,total"
          :total="total"
          align="center"
          @size-change="handleSizeChange"
          @current-change="getSpuList(page)"
        >
        </el-pagination>
      </div>

      <!-- 添加spu或修改spu -->
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"
        >添加spu或修改spu
      </SpuForm>
      <!-- 添加sku -->
      <SkuForm v-show="scene == 2" ref="sku" @changeScene2="changeScene2">
        添加sku
      </SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table v-loading="loading" :data="skuList" style="width: 100%" border>
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column  label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import getPageTitle from "@/utils/get-page-title";
import SpuForm from "@/views/product/Spu/spuForm";
import SkuForm from "@/views/product/Spu/skuForm";
import { done } from "nprogress";
export default {
  name: "spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      show: true,
      page: 1,
      limit: 3,
      total: 0,
      records: [],
      scene: 0,
      dialogTableVisible: false,
      spu:{},
      skuList:[],
      loading:true,
    };
  },
  methods: {
    //  handleSizeChange(page){
    //      this.page = page
    //      this.getSpuList()
    //  },
    //当分页器的某一个展示数据条数发生变化的回调
    handleSizeChange(limit) {
      //修改参数
      this.limit = limit;
      //再发请求
      this.getSpuList();
    },
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else if (level == 3) {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      //   console.log(result);
      if (result.code == 200) {
        this.records = result.data.records;
      }
    },
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    updateSpu(row) {
      this.scene = 1;
      // console.log(this.$refs.spu)
      this.$refs.spu.initSpuData(row);
    },
    async deleteSpu(row) {
      let result = await this.$API.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: " 删除成功" });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == "修改") this.getSpuList(this.page);
      if (flag == "添加") this.getSpuList();
    },
    changeScene2(scene) {
      this.scene = scene;
    },
    //查看当前类spu的全部实例sku
    async handler(spu){
      //点击这个按钮的时候，对话框可见的
      this.dialogTableVisible = true;
      //保存spu信息
      this.spu = spu;
      //获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        //loading隐藏
        this.loading = false;
      }
    },
    //关闭对话框回调
    close(){
      this.loading= true
      this.skuList = []
      done()
    }
  },
};
</script>
<style lang="less" scoped></style>
