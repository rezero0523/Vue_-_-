<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="Spu名称">
        <el-input placeholder="Spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="spu描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <!-- 上传图片 -->
      <el-form-item>
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" >
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option :label='unselect.name' :value="`${unselect.id}:${unselect.name}`" v-for="(unselect, index) in unSelectSaleAttr" :key="unselect.id">{{unselect.name}} </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSavaAttr">添加销售属性</el-button>
        <el-table border style="width: 100%" :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">
              {{ tag.saleAttrValueName }}
              <!-- {{tag}} -->
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" 
              @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)">
              </el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)" >
              添加 
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" @click="spu.spuSaleAttrList.splice(index,1)"></el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdate">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Row } from "element-ui";

export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: '',
        spuImageList: [
          //   {
          //     id: 0,
          //     imgName: "string",
          //     imgUrl: "string",
          //     spuId: 0,
          //   },
        ],
        spuSaleAttrList: [
          //   {
          //     baseSaleAttrId: 0,
          //     id: 0,
          //     saleAttrName: "string",
          //     spuId: 0,
          //     spuSaleAttrValueList: [
          //       {
          //         baseSaleAttrId: 0,
          //         id: 0,
          //         isChecked: "string",
          //         saleAttrName: "string",
          //         saleAttrValueName: "string",
          //         spuId: 0,
          //       },
          //     ],
          //   },
        ],
      },
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
      attrIdAndAttrName:'',
    };
  },
  computed: {
      unSelectSaleAttr(){
          return this.saleAttrList.filter(item=>{
              return this.spu.spuSaleAttrList.every(item1=>{
                  return item.name != item1.saleAttrName
              })
          })
      }
  },
  methods: {
    handleRemove(file, fileList) {
    //   console.log(file, fileList);
         this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlerSuccess(repounse,file,fileList){
        this.spuImageList = fileList
    },
    //update之前初始化数据获取工作
    async initSpuData(spu) {
      //获取spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
    //   console.log(spuResult);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      // console.log(tradeMarkResult)
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取spu图片数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      // console.log(spuImageResult)
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      //获取平台的全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      // console.log(spuImageResult)
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //s属性列表值的添加按钮的回调
    addSaleAttrValue(row) {
      this.$set(row,'inputVisible',true)
      this.$set(row,'inputValue','')
    },
    //输入完毕，按确定或者失去焦点
    handleInputConfirm(row) {
      row.inputVisible = false
      const {baseSaleAttrId,inputValue} = row
      if(inputValue.trim() == '')
      {
          this.$message('属性值不能为空')
          return 
      }else if(row.spuSaleAttrValueList.some(item => item.saleAttrValueName == inputValue )){
          this.$message('属性值不能重复')
          return
      }
    //   console.log(row.spuSaleAttrValueList)
      let newSaleAttrValue ={baseSaleAttrId,SaleAttrValueName:inputValue}
      row.spuSaleAttrValueList.push(newSaleAttrValue)
    },
    //添加spu的属性值列表属性
    addSavaAttr(){
        const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':')
        let newSaleAttr ={baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
        this.spu.spuSaleAttrList.push(newSaleAttr)
        this.attrIdAndAttrName = ''
    },
    //保存添加或修改信息，向服务器发送请求
    async addOrUpdate(){
        this.spu.spuImageList= this.spuImageList.map(item =>{
            return {
                imgName:item.name,
                imgUrl:(item.response&&item.response.data)||item.url
            }
        })
        let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
        // console.log(result)
        if(result.code == 200){
          this.$message({type:'success',message:'保存成功'})
          this.$emit('changeScene', {scene:0,flag:this.spu.id?'添加':'修改'})
        }
        Object.assign(this._data,this.$options.data())
    },
    async addSpuData(category3Id){
      this.spu.category3Id = category3Id
       //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      // console.log(tradeMarkResult)
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取平台的全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      // console.log(spuImageResult)
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    cancel(){
      this.$emit('changeScene', {scene:0,flag:''})
      //this._data是存储的响应式数据对象，this.$options.data是当前的data函数，data函数一执行返回的是最初data存储的数据即为空对象，
      Object.assign(this._data,this.$options.data())
    }
  },
};
</script>
<style scoped></style>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
