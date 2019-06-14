<template>
  <div class="app-container">
    <el-button type="warning" @click="returnDetail">返回订单详情</el-button>
    <!--<el-button type="warning" @click="resetDialogData">重置数据</el-button>-->
    <el-table
      :data="billItem"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="规格">
        <template slot-scope="scope">
          {{ scope.row.format }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="宽度(mm)">
        <template slot-scope="scope">
          {{ scope.row.width }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="高度(mm)">
        <template slot-scope="scope">
          {{ scope.row.height }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="选择">
        <template slot-scope="scope">
          <el-select v-model="currentOrderId" placeholder="请选择" @change="orderDetailChange">
            <el-option
              v-for="item in detailOption"
              :key="item.orderDetailId"
              :label="item.show"
              :value="item.orderDetailId">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="送货数量">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.remark" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="sumitBillItem"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="规格">
        <template slot-scope="scope">
          {{ scope.row.format }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="宽度(mm)">
        <template slot-scope="scope">
          {{ scope.row.width }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="高度(mm)">
        <template slot-scope="scope">
          {{ scope.row.height }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="面积(m²)">
        <template slot-scope="scope">
          {{ scope.row.area }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="单价(元)">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { manualInput } from '@/api/order'
import { findAll as formatFindAll } from '@/api/format'

export default {
  data() {
    return {
      billItem:[{
        orderDetailId:null,
        height:null,
        width:null,
        amount:null,
      }],
      currentOrderId:null,
      currentOrderDetail:null,
      order: null,
      orderDetailList:null,
      detailOption:null,
      sumitBillItem:[],
      deliveryData:{
        address:'',
      }

    }
  },
  created() {
    this.order = this.$route.query.order
    this.orderDetailList= this.$route.query.orderDetailList

    this.detailOption = this.orderDetailList.map((item,index)=>{
       return {
         show:item.format +'   '+item.height+'×'+item.width,
         orderDetailId:item.orderDetailId
       }
    })

  },
  methods: {
    submit(){

    },
    orderDetailChange(orderDetailId){
      let orderDetail = this.findDetailById(orderDetailId)
      this.currentOrderDetail= orderDetail
      this.billItem[0].orderDetailId = orderDetail.orderDetailId
      this.billItem[0].height = orderDetail.height
      this.billItem[0].width = orderDetail.width
      this.billItem[0].format = orderDetail.format

    },
    returnDetail() {
      this.$router.push({ path: '/order/detail', query: { order: this.order }})
    },
    deleteRow(row) {
      let index = 0
      this.deliveryData.list.map((item, i) => {
        if (item.key === row.key) {
          index = i
        }
      })
      this.addList.splice(index, 1)
    },
    findDetailById(id){
      return this.orderDetailList.find(item=>{
        return item.orderDetailId === id
      })
    }

  }
}
</script>
