<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="add">添加</el-button>
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
          <router-link :to="'/order/detail?id='+scope.row.orderId">
            <el-button type="primary" size="small" icon="el-icon-edit">查看详情</el-button>
          </router-link>
          <!--<el-button type="primary" size="small" icon="el-icon-download" @click="downloadLicense(scope.row.id)">下载证书</el-button>-->
        </template>
      </el-table-column>
    </el-table>

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
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getOrderList, createOrder } from '@/api/order'
import { getCustomerList } from '@/api/customer'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'info'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        1: '进行中',
        2: '已关闭'
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
      dialogFormVisible: false,
      list: null,
      listLoading: true,
      orderForm: {
        name: null,
        desc: '',
        customerId: null
      },
      customerList: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    submit() {
      createOrder(JSON.stringify(this.orderForm)).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        // 刷新
        this.$router.go(0)
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
        customerId: null
      }
    },
    fetchData() {
      this.listLoading = true
      getOrderList().then(response => {
        this.listLoading = false
        this.list = response.data
      })
    }
  }
}
</script>
