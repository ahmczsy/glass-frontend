<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-upload"
        @click="dialogFormVisible=true"
      >上传订单详情
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="dialogOrderStatus=true"
      >修改订单状态
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="manualAddInit"
      >手动添加
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="成品名称">
        <template slot-scope="scope">
          {{ scope.row.endProductName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="宽度">
        <template slot-scope="scope">
          {{ scope.row.width }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="高度">
        <template slot-scope="scope">
          {{ scope.row.height }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="面积">
        <template slot-scope="scope">
          {{ scope.row.area }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="周长">
        <template slot-scope="scope">
          {{ scope.row.girth }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="导入类型">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderDetailType | statusFilter">{{ scope.row.orderDetailType |
            statusNameFilter }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible" title="导入数据">
      <el-upload
        drag
        action=""
        accept=".xlsx"
        :show-file-list="false"
        name="file"
        :data="uploadData"
        :http-request="startUpload"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传xlsx类型文件</div>
      </el-upload>
    </el-dialog>

    <el-dialog :visible.sync="dialogOrderStatus" title="修改订单状态">
      <el-radio-group v-model="order.orderStatus">
        <el-radio :label="1">进行中</el-radio>
        <el-radio :label="3">已完成</el-radio>
        <el-radio :label="2">已关闭</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOrderStatus = false">取消</el-button>
        <el-button type="primary" @click="updateOrderStatus()">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogManualAdd" title="添加订单详情">
      <el-button type="warning" @click="resetDialogData">重置数据</el-button>
      <vxe-table
        ref="refTable"
        border
        show-all-overflow
        :data.sync="addList"
        :edit-rules="addRules"
        :mouse-config="{selected: true}"
        :keyboard-config="{isArray: true, isTab: true, isEdit: true}"
        :edit-config="{key: 'key', trigger: 'click', mode: 'cell'}"
        @edit-actived="editActived"
        @edit-closed="editClosed"
      >
        <vxe-table-column prop="height" label="长" :edit-render="{name: 'input'}" />
        <vxe-table-column prop="width" label="宽" :edit-render="{name: 'input'}" />
        <vxe-table-column prop="amount" label="数量" :edit-render="{name: 'input'}" />
        <vxe-table-column prop="formatId" label="规格ID" :edit-render="{name: 'input'}" width="60" />
        <vxe-table-column prop="format" label="规格" />
        <vxe-table-column prop="price" label="单价" :edit-render="{name: 'input'}" />
        <vxe-table-column prop="remark" label="备注" :edit-render="{name: 'input'}" />
        <vxe-table-column v-slot="{ row }" label="操作">
          <template>
            <vxe-button @click="deleteRow(row)">删除</vxe-button>
          </template>
        </vxe-table-column>
      </vxe-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogManualAdd = false">取消</el-button>
        <el-button type="primary" @click="manualSumbit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDetail, detailExcelInput, updateOrder } from '@/api/order'
import { findAll as formatFindAll } from '@/api/format'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'info',
        2: 'success'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        1: 'excel',
        2: '手动'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      order: null,
      uploadData: null,
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogOrderStatus: false,
      dialogManualAdd: false,
      addList: [{ key: new Date() }],
      formatList: [],
      addRules: {
        height: [
          { required: true, message: '长度必须填写' },
          { type: 'number', message: '必须为数字' }],
        width: [
          { required: true, message: '宽度必须填写' },
          { type: 'number', message: '必须为数字' }],
        amount: [
          { required: true, message: '数量必须填写' },
          { type: 'number', message: '必须为数字' }],
        // format:[
        //   {required: true, message: '规格ID错误' }],
        price: [
          { required: true, message: '单价必须填写' },
          { type: 'number', message: '必须为数字' }]
      }

    }
  },
  created() {
    this.order = this.$route.query.order
    const id = this.order.orderId
    this.uploadData = { orderId: id }

    getDetail({ orderId: id }).then(res => {
      this.list = res.data
      this.listLoading = false
    })
  },
  methods: {
    startUpload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('orderId', this.uploadData.orderId)
      detailExcelInput(formData).then(res => {
        this.$router.go(0)
      })
    },
    updateOrderStatus() {
      updateOrder({ orderId: this.order.orderId, orderStatus: this.order.orderStatus }).then(res => {
        this.dialogOrderStatus = false
      })
    },
    manualAddInit() {
      // formatFindAll().then(res=>{
      //     this.formatList = res.data
      //   this.dialogManualAdd=true
      // })
      this.$router.push({ path: '/order/manualAdd', query: { order: this.order }})
    },
    manualSumbit() {
      this.$refs.xTable.validate(valid => {
        console.log(valid)
      })
    },
    editActived(event) {
      // let records = this.$refs.refTable.getRecords()
      // console.log(records.length-1 +"  "+event.rowIndex)
      // if (event.rowIndex === this.addList.length - 1) {
      if (event.rowIndex === (this.addList.length - 1)) {
        this.addList.push({ key: new Date().getTime() })
        // this.$refs.refTable.insertAt({index:new Date()},-1)
      }
    },
    deleteRow(row) {
      this.addList.splice(row.index - 1, 1)
      // this.addList.map((v,i)=>{
      //   v.index =i+1
      // })
    },
    editClosed(event) {
      if (event.$columnIndex !== 4) {
        return
      }
      console.log('=======')
      const id = event.row.formatId
      let format = ''
      this.formatList.forEach(item => {
        if (item.id.toString() === id) {
          format = item.name
        }
      })
      this.addList[event.rowIndex].format = format
    },
    resetDialogData() {
      this.addList = [{ index: 1 }]
    }

  }
}
</script>
