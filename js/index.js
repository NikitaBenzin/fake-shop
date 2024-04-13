import { getAllCategories, getAllData, getPerPage, search } from './service.js'


let data = await getPerPage()

let dataAll = await getAllData()
let searchData = await search('phone')
let allCategories = await getAllCategories()
// console.log(data)
// console.log(data.products)
console.log(allCategories)