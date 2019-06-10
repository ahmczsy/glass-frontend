<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
    >
      <el-table-column label="客户ID" align="center" width="90">
        <template slot-scope="scope">
          {{ scope.row.customerId }}
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center">
        <template slot-scope="scope">
          <span :style="scope.row.customerTrueName |nameColor">{{ scope.row.customerTrueName |nameContent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" width="40" height="40">
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="showUpdateDialog(scope.row.customerId)"
          >修改信息
          </el-button>
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
      @current-change="fetchData"
    />

    <el-dialog :visible.sync="dialogVisible" title="修改信息" width="30%">
      <el-form
        ref="updateForm"
        :rules="rules"
        :model="customerUpdateForm"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="真实姓名" prop="name" required>
          <el-input v-model="customerUpdateForm.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit('updateForm')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findByPage, setTrueName } from '@/api/customer'

export default {
  filters: {
    nameColor(trueName) {
      return trueName || 'color: red'
    },
    nameContent(trueName) {
      return trueName || '请设置真实名称'
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'change' },
          { min: 1, max: 100, message: '长度为1-100个字符' }
        ]
      },
      dialogVisible: false,
      list: null,
      listLoading: true,
      pageQuery: {
        curPage: 1,
        capacity: 15
      },
      customerUpdateForm: { name: '' }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    submit(updateForm) {
      this.$refs[updateForm].validate((valid) => {
        if (valid) {
          setTrueName(this.customerUpdateForm).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.$router.go(0)
          })
        } else {
          return false
        }
      })
    },
    showUpdateDialog(customerId) {
      this.dialogVisible = true
      this.customerUpdateForm.id = customerId
      this.customerUpdateForm.name = ''
    },
    fetchData() {
      this.listLoading = true
      findByPage(this.pageQuery).then(response => {
        this.listLoading = false
        this.list = response.data
      })
    }
  }
}
</script>
