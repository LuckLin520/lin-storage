## 说明
> lin-storage是仅1.03k的单文件js模块，灵感来源于antfu的[@vueuse/core](https://github.com\/vueuse/vueuse)库中的[useLocalStorage](http://vueuse.org\/core\/uselocalstorage#uselocalstorage)，因为我在使用时发现了个问题，感兴趣的可以看看[issues#1283](https://github.com/vueuse/vueuse/issues/1283)
>
> 你可以将想要保存的数据初始化为一个变量，然后就可以通过这个变量更新和获取值并自动同步localStorage，并且在更新和获取数据时不再需要像localStorage那样关心JSON转换，api设计基本跟localStorage一致，具体见<a href="#API参考">API参考</a>。
## 快速使用
### 1､安装
`npm install lin-storage`
### 2､使用案例（这里以pinia为例）
```javascript
import { defineStore } from "pinia"
import { linStorage } from 'lin-storage'
export const useTestStore = defineStore('test', {
    state() {
        return {
            userData: linStorage.init('userData', {}),   //初始化一个object数据
            token: linStorage.init('token', '')     //初始化一个基本类型数据
        }
    },
    actions: {
        changeUserData() {
            //object批量更新
            this.userData.setValue({name: 'lin'})
            this.userData.value = {name: 'lin'}
            //object局部更新（数组暂不支持）
            this.userData.setItem('name','lin')
            this.userData.name = 'lin'
            //基本类型更新
            this.token.setValue('this is token')
            this.token.value = 'this is token'
            //取值
            console.log(this.userData)          //{name: 'lin'}
            console.log(this.userData.name)     //lin
            //基本类型数据通过value获取）
            console.log(this.token.value)       //this is token
            //你也可以直接使用linStorage全局操作所有值
            linStorage.token.setValue('new token')
            linStorage.clear()  //清空所有
        }
    }
})
```
## <a name="API参考">API参考</a>
### 1､属性
| 属性名       | 类型         | 说明                       |
| ---         | ---          | ---                       |
| length      | Number       | 存储的数据条数              |
| value       | ---          | 主要用来取基本类型数据的值；也可以设置值，但其实是调用了setValue方法，结合性能和语义化建议使用setValue  |
### 1､方法
| 方法名       | 参数            | 说明                             | 返回值      |
| ---         | ---             | ---                             | ---           |
| init        | key, value    | 传入key和defaultValue初始化一项数据；如果key已经存在则初始化默认值无效 | 被监听后的Proxy实例|
| getItem     | key           | 获取指定值                            | 指定值                 |
| setItem     | key, value    | 设置指定值                            | 指定值                 |
| removeItem  | key           | 删除指定值                            | 指定值                 |
| clear       | ---           | 清空值                                | ---               |
| setValue    | value         | 批量更新值                            | 更新后的值                |