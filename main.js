/**
 * @Description: 响应式localStorage
 * @Author: https://github.com/LuckLin520
 * @Date: 2022-2-22
 */
 export const linStorage = (function() {
    const HANDLER = {
        get(target, key) {
            return target.__proto__.getItem(key)
        },
        set(target, key, value) {
            if(value.toString() === '[object Object]') {
                target.__proto__.setValue(value)
            }else{
                target.__proto__.setItem(key, value)
            }
            return true
        }
    }
    const getIns = (__linStoragePrimaryKey = '__linStorage') => {
        const STORE = localStorage[__linStoragePrimaryKey] ? JSON.parse(localStorage[__linStoragePrimaryKey]) : {}
        function setLocal() {
            STORE.__proto__['length'] = Object.keys(STORE).length
            localStorage[__linStoragePrimaryKey] = JSON.stringify(STORE)
        }
        STORE.__proto__ = {
            constructor: function LinStorage() {},
            length: 0,
            __linStoragePrimaryKey,
            getItem(key) {
                return STORE[key]
            },
            setItem(key, val) {
                if(val.toString() === '[object Object]') {
                    STORE[key] = new Proxy(getIns(__linStoragePrimaryKey + ':' + key), HANDLER)
                    STORE[key].__proto__.setValue(val)
                }else{
                    STORE[key] = val
                }
                setLocal()
                return STORE[key]
            },
            removeItem(key) {
                const old = STORE[key]
                delete STORE[key]
                setLocal()
                return old
            },
            clear() {
                Object.keys(STORE).forEach(key => delete STORE[key])
                setLocal()
            },
            init(key, defaultVal) {
                if(arguments.length !== 2) throw Error('init() expected parameter length is 2, got 1')
                if(!(defaultVal instanceof Object)) defaultVal = {value: defaultVal}
                const CACHE = localStorage[__linStoragePrimaryKey+':'+key] ? JSON.parse(localStorage[__linStoragePrimaryKey+':'+key]) : undefined
                return STORE.__proto__.setItem(key, CACHE || defaultVal)
            },
            setValue(value) {
                if(!(value instanceof Object)) value = {value}
                else STORE.__proto__.clear()
                for(let k in value) STORE.__proto__.setItem(k, value[k])
                return STORE
            }
        }
        return STORE
    }
    return new Proxy(getIns(), HANDLER)
})()