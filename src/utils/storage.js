export const setLS = (key, val) => {
    let value = val
    try {
        value = JSON.stringify(val)
    } catch (e) { console.log(e) }
    localStorage.setItem(key, value)
}

export const getLS = key => JSON.parse(localStorage.getItem(key))

const formsName = 'forms'

export const getData = formKey => {
    const forms = getLS(formsName)
    let data = []
    if (forms) {
        data = forms[formKey] || []
    }
    return data
}

export const setData = (formKey, data) => {
    let forms = getLS(formsName)
    if (forms) {
        const form = forms[formKey] || []
        form.push(data)
        forms = {
            ...forms,
            [formKey]: form
        }
    } else {
        forms = {
            [formKey]: [data]
        }
    }
    setLS(formsName, forms)
}

export const delData = (formKey, id) => {
    let forms = getLS(formsName)
    if (forms) {
        let form = forms[formKey] || []
        let index
        form.find((i, _index) => {
            if (i.id === id) {
                index = _index
                return true
            }
        })
        if (index !== undefined) {
            form.splice(index, 1)
            forms = {
                ...forms,
                [formKey]: form
            }
            setLS(formsName, forms)
        }
    }
}