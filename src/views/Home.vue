<template>
  <div class="home">
    <van-field label="用戶名" v-model="username" placeholder="用戶名"></van-field>
    <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        title="选择年月"
        confirm-button-text="搜索"
        cancel-button-text=" "
        @change="getTableList"
        @confirm="getTableList"
    />
    <div>
      <CTable :columns="columns" :data="tableList" @trClick="handleDel"></CTable>
      <div v-if="tableList.length" class="total-box">
        total: <span :class="totalIncome > 0 ? 'red' : 'green'">{{ totalIncome }}</span> + <span :class="totalOther > 0 ? 'red' : 'green'">{{ totalOther }}</span> = <span :class="totalIncome + totalOther > 0 ? 'red' : 'green'">{{ totalIncome + totalOther }}</span>
      </div>
    </div>
    <div class="btn-box">
      <van-button type="primary" size="small" block @click="handleAdd">新增记录</van-button>
    </div>
    <van-popup ref="addPopup" v-model="showAdd" position="bottom">
      <van-form @submit="handleAddSubmit">
        <van-field label="日期">
          <template #input>
            <van-datetime-picker
                v-model="addData.date"
                cancel-button-text=" "
                type="month-day"
                title="选择月日"
            />
          </template>
        </van-field>
        <van-field label="收入" v-model="addData.income" placeholder="收入"></van-field>
        <van-field label="其他" v-model="addData.other" placeholder="其他"></van-field>
        <van-field label="日志" v-model="addData.log" placeholder="日志"></van-field>
        <div style="margin: 16px;">
          <van-button round block type="primary" size="small" native-type="submit">新增</van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
// @ is an alias to /src
import moment from 'moment'
import CTable from '@/components/Table.vue'
import { setLS, getLS } from '@/utils/storage'

export default {
  name: 'Home',
  components: {
    CTable
  },
  data() {
    return {
      columns: [
        { label: '日期', prop: 'date' },
        { label: '收入', prop: 'income', render(h, row) {
          let { income } = row
          income = income ? income * 1 : 0
          return h('span', { class: income > 0 ? 'red' : 'green' }, income)
        } },
        { label: '其他', prop: 'other', render(h, row) {
          let { other } = row
          other = other ? other * 1 : 0
          return h('span', { class: other > 0 ? 'red' : 'green' }, other)
        } },
        { label: '日志', prop: 'log' },
      ],
      tableList: [],
      currentDate: new Date(),
      addData: {
        date: new Date(),
        income: '',
        other: '',
        log: ''
      },
      username: '',
      showAdd: false,
      totalOther: 0,
      totalIncome: 0
    }
  },
  created() {
    this.username = getLS('username')
    this.getTableList()
  },
  watch: {
    username() {
      setLS('username', this.username)
    }
  },
  methods: {
    handleDel(item) {
      this.$dialog.confirm({
        title: '确认',
        message: `删除${item.date}记录？`
      }).then(async () => {
        const formKey = moment(this.currentDate).format('YYYY-MM')
        const { res } = await this.$api.delIncome({ username: this.username, formKey, id: item.id })
        if (res) {
          this.$notify({ type: 'success', message: '删除成功' })
          this.getTableList()
        }
      })
    },
    async getTableList() {
      let date
      const currentDate = this.currentDate
      if (currentDate) {
        date = new Date(currentDate)
      }
      date = moment(date || new Date()).format('YYYY-MM')
      const { res } = await this.$api.getIncomeList({ date, username: this.username })
      if (res) {
        const { data } = res
        let totalIncome = 0, totalOther = 0
        if (data.length > 0) {
          data.forEach(i => {
            totalIncome += i.income * 1 || 0
            totalOther += i.other * 1 || 0
          })
          data.push({ date: '总计', income: totalIncome, other: totalOther })
        }
        this.totalIncome = totalIncome
        this.totalOther = totalOther
        this.tableList = data
      }
    },
    handleAdd() {
      this.showAdd = true
    },
    async handleAddSubmit() {
      const { date } = this.addData
      if (!date) return this.$notify('选择日期')
      const formKey = moment(date).format('YYYY-MM')
      const { res } = await this.$api.addIncome({ ...this.addData, date: moment(date).format('YYYY-MM-DD'), username: this.username, formKey })
      if (res) {
        this.getTableList()
        this.$refs.addPopup.close()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.btn-box {
  margin: 20px;
  text-align: center;
}
.total-box {
  text-align: center;
  margin: 20px 0;
}
</style>
