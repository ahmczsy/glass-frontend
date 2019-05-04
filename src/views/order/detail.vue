<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-upload"
        @click="input"
      >上传订单详情
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
  </div>
</template>

<script>
import { getDetail, detailExcelInput } from '@/api/order'

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
      uploadData: null,
      list: null,
      listLoading: true,
      dialogFormVisible: false
    }
  },
  created() {
    const id = this.$route.query.id
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
    input() {
      this.dialogFormVisible = true
    }

  }
}
</script>
