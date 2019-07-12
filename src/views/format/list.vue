<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="dialogVisible=true"
      >添加规格
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
    >
      <el-table-column label="规格ID" align="center" width="90">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="规格名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="规格描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" title="添加规格" width="30%">
      <el-form
        ref="thisForm"
        :rules="rules"
        :model="newFormat"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="规格ID" prop="id" required>
          <el-input v-model.number="newFormat.id"/>
        </el-form-item>
        <el-form-item label="规格名称" prop="name" required>
          <el-input v-model="newFormat.name" />
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input v-model="newFormat.desc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit('thisForm')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { create, findAll } from '@/api/format'

export default {
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入名称' },
          { min: 1, max: 100, message: '长度为1-100个字符' }
        ],
        id: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字' },
        ]
      },
      dialogVisible: false,
      list: null,
      listLoading: true,
      newFormat: { }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    submit(thisForm) {
      this.$refs[thisForm].validate((valid) => {
        console.log(this.newFormat)
        if (valid) {
          create(this.newFormat).then(res => {
            this.$message({
              message: '操作成功',
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
    fetchData() {
      this.listLoading = true
      findAll().then(response => {
        this.listLoading = false
        this.list = response.data
      })
    }
  }
}
</script>
