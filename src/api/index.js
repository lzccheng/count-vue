import { GET, POST } from './axios'

export default {
    getIncomeList: params => GET('/api/list', params),
    addIncome: data => POST('/api/add_income', data),
    delIncome: data => POST('/api/del_income', data),
}