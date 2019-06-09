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
        @click="dialogManualAdd=true"
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
      <vxe-table
        ref="xTable"
        border
        show-all-overflow
        :data.sync="manualInputList"
        :mouse-config="{selected: true}"
        :keyboard-config="{isArray: true, isTab: true, isEdit: true}"
        :edit-config="{key: 'index', trigger: 'dblclick', mode: 'cell'}"
        @edit-actived="editActived"
        @edit-closed="editClosed"
      >
        <vxe-table-column prop="index" label="序号" width="60" />
        <vxe-table-column prop="height" label="长" :edit-render="{name: 'input'}" />
        <vxe-table-column prop="width" label="宽" :edit-render="{name: 'input'}" />
        <vxe-table-column prop="amount" label="数量" :edit-render="{name: 'input'}" />
        <vxe-table-column prop="formatId" label="规格ID" :edit-render="{name: 'input'}" width="60" />
        <vxe-table-column prop="format" label="规格" />
        <vxe-table-column prop="remark" label="备注" :edit-render="{name: 'input'}" />
      </vxe-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogManualAdd = false">取消</el-button>
        <el-button type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDetail, detailExcelInput, updateOrder } from '@/api/order'

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
      manualInputList: [{ index: 1 }],
      formatList: [{ id: 1, name: '5+5' }, { id: 2, name: '5+10' }]
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
    editActived(event) {
      if (event.rowIndex === this.manualInputList.length - 1) {
        this.manualInputList.push({ index: this.manualInputList.length + 1 })
      }
    },
    editClosed(event) {
      console.log(event)
      if (event.$columnIndex !== 4) {
        return true
      }
      const id = event.row.formatId
      let format = ''
      this.formatList.forEach(item => {
        if (item.id.toString() === id) {
          format = item.name
        }
      })
      this.manualInputList[event.rowIndex].format = format
    }

  }
}
</script>
