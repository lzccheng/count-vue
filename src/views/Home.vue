<template>
  <div class="home">
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
import { setData, getData, delData } from '@/utils/storage'

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
      showAdd: false,
      totalOther: 0,
      totalIncome: 0
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    handleDel(item) {
      this.$dialog.confirm({
        title: '确认',
        message: `删除${item.date}记录？`
      }).then(() => {
        const formKey = moment(new Date()).format('YYYY-MM')
        delData(formKey, item.id)
        this.$notify({ type: 'success', message: '删除成功' })
        this.getTableList()
      })
    },
    getTableList() {
      let date
      const currentDate = this.currentDate
      if (currentDate) {
        date = new Date(currentDate)
      }
      const list = getData(moment(date || new Date()).format('YYYY-MM'))
      let totalIncome = 0, totalOther = 0
      console.log('list ====', list)
      if (list.length > 0) {
        list.forEach(i => {
          totalIncome += i.income * 1 || 0
          totalOther += i.other * 1 || 0
        })
        list.push({ date: '总计', income: totalIncome, other: totalOther })
      }
      this.totalIncome = totalIncome
      this.totalOther = totalOther
      this.tableList = list
    },
    handleAdd() {
      this.showAdd = true
    },
    handleAddSubmit() {
      const { date } = this.addData
      if (!date) return this.$notify('选择日期')
      const formKey = moment(date).format('YYYY-MM')
      setData(formKey, { ...this.addData, id: +new Date(), date: moment(date).format('YYYY-MM-DD') })
      this.getTableList()
      this.$refs.addPopup.close()
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
