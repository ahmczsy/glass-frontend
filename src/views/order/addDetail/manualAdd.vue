<template>
  <div class="app-container">
    <el-button type="warning" @click="returnDetail">返回订单详情</el-button>
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
      <vxe-table-column prop="height" label="长(mm)" :edit-render="{name: 'input'}" />
      <vxe-table-column prop="width" label="宽(mm)" :edit-render="{name: 'input'}" />
      <vxe-table-column prop="amount" label="数量" :edit-render="{name: 'input'}" />
      <vxe-table-column prop="formatId" label="规格ID" :edit-render="{name: 'input'}" width="80" />
      <vxe-table-column prop="format" label="规格" />
      <vxe-table-column prop="price" label="单价(元)" :edit-render="{name: 'input'}" />
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
  </div>
</template>

<script>
import { manualInput } from '@/api/order'
import { findAll as formatFindAll } from '@/api/format'

export default {
  data() {
    return {
      order: null,
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
        format: [
          { required: true, message: '规格ID错误' }],
        price: [
          { required: true, message: '单价必须填写' },
          { type: 'number', message: '必须为数字' }]
      }

    }
  },
  created() {
    this.order = JSON.parse(this.$route.query.order)
    formatFindAll().then(res => {
      this.formatList = res.data
    })
  },
  methods: {
    manualSumbit() {
      this.$refs.refTable.validate(valid => {
        if (!valid) {
          return
        }
        // handler number
        this.addList.map((item, i) => {
          item.height = parseInt(item.height)
          item.width = parseInt(item.width)
          item.amount = parseInt(item.amount)
          item.price = parseFloat(item.price)
        })
        manualInput({ orderId: this.order.orderId, detailList: this.addList }).then(res => {
          this.$router.push({ path: '/order/detail', query: { order: this.order }})
        })
      })
    },
    editActived(event) {
      if (event.rowIndex === (this.addList.length - 1)) {
        this.addList.push({ key: new Date().getTime() })
      }
    },
    deleteRow(row) {
      let index = 0
      this.addList.map((item, i) => {
        if (item.key === row.key) {
          index = i
        }
      })
      this.addList.splice(index, 1)
    },
    editClosed(event) {
      console.log(event.columnIndex + '   ' + event.$columnIndex)
      if (event.columnIndex !== 3) {
        return
      }
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
      this.addList = [{ key: new Date().getTime() }]
    },
    returnDetail() {
      this.$router.push({ path: '/order/detail', query: { order: JSON.stringify(this.order) }})
    }

  }
}
</script>
