<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-bottom: 10px;" type="primary" icon="el-icon-plus" @click="add">添加订单</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="订单ID" align="center" width="90">
        <template slot-scope="scope">
          {{ scope.row.orderId }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderDesc }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderStatus | statusFilter">{{ scope.row.orderStatus | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!--          <router-link :to="'/order/detail?id='+scope.row.orderId">-->
          <el-button type="primary" size="small" icon="el-icon-document" @click="gotoDetai(scope.row)">查看详情</el-button>
          <!--          </router-link>-->
<!--          <el-button type="primary" size="small" icon="el-icon-upload" @click="createBill(scope.row.orderId,scope.row.orderCustomerId)">上传送货单</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :current-page.sync="pageQuery.curPage"
      :page-size.sync="pageQuery.capacity"
      :page-count="50"
      style=" padding: 32px 16px;"
      @current-change="fetchData"></el-pagination>

    <el-dialog :visible.sync="dialogFormVisible" title="新增订单">
      <el-form ref="orderForm" :rules="rules" :model="orderForm" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">

        <el-form-item label="订单名称" prop="name" required>
          <el-input v-model="orderForm.name" />
        </el-form-item>

        <el-form-item label="选择客户" prop="customerId" required>
          <el-select v-model="orderForm.customerId" filterable placeholder="请选择">
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="orderForm.desc" type="textarea" placeholder="请输入内容" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submit('orderForm')">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="excleDialogVisible" title="导入数据" width="30%">
      <el-upload
        drag
        action=""
        accept=".xlsx"
        :http-request="upload"
        :show-file-list="false"
        name="file"
        :data="uploadData"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传xlsx类型文件</div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
import { getOrderList, createOrder } from '@/api/order'
import { getCustomerList } from '@/api/customer'
import { createByExcel } from '@/api/bill'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '',
        2: 'info',
        3: 'success'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        1: '进行中',
        2: '已关闭',
        3: '已完成'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入订单名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度为1-100个字符' }
        ],
        customerId: [{ required: true, message: '请选择客户', trigger: 'blur' }]

      },
      uploadData: null,
      dialogFormVisible: false,
      excleDialogVisible: false,
      list: null,
      listLoading: true,
      orderForm: {
        name: null,
        desc: '',
        customerId: null,
        openid: ''
      },
      pageQuery: {
        curPage: 1,
        capacity: 15
      },
      customerList: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    upload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('orderId', this.uploadData.orderId)
      formData.append('customerId', this.uploadData.customerId)
      createByExcel(formData).then(res => {
        this.$router.go(0)
      })
    },
    createBill(orderId, customerId) {
      this.uploadData = { orderId: orderId, customerId: customerId }
      this.excleDialogVisible = true
    },
    gotoDetai(order) {
      this.$router.push({ path: '/order/detail', query: { order: JSON.stringify(order)}})
    },
    submit(form) {
      this.customerList.forEach(customer => {
        if (customer.id === this.orderForm.customerId) {
          this.orderForm.openid = customer.openid
        }
      })
      this.$refs[form].validate(valid => {
        if (valid) {
          createOrder(this.orderForm).then(res => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.$router.go(0)
          })
        } else {
          return false
        }
      })
    },
    add() {
      getCustomerList().then(response => {
        this.customerList = response.data
        this.resetTemp()
        this.dialogFormVisible = true
      })
    },
    resetTemp() {
      this.orderForm = {
        name: '',
        desc: '',
        customerId: null,
        openid: ''
      }
    },
    fetchData() {
      this.listLoading = true
      getOrderList(this.pageQuery).then(response => {
        this.listLoading = false
        this.list = response.data
      })
    }
  }
}
</script>
