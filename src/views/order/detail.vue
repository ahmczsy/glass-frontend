<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDetail } from '@/api/order'
export default {
  filters: {
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    const id = this.$route.query.id
    getDetail({ orderId: id }).then(res => {
      console.log(res)
    })
  },
  methods: {
  }
}
</script>
