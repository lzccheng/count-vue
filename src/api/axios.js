import axios from 'axios'
import { Notify } from 'vant'

const instance = axios.create({
    timeout: 10000,
    baseURL: process.env.NODE_ENV === 'production' ? 'http://139.198.175.90' : ''
})

const tipsErr = message => Notify({ type: 'danger', message })

const request = method => {
    return (url, data, config = {}) => {
        const _config = {
            url,
            method,
            ...config
        }
        if (method === 'get') {
            _config.params = data
        } else {
            _config.data = data
        }
        return instance(_config).then(res => {
            const { data } = res
            if (data.code === 200) return { res: data }
            tipsErr(data.msg)
            return { err: data, response: res }
        }, err => ({ err, response: err }))
    }
}

export const GET = request('get')
export const POST = request('post')