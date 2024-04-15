const URL = 'https://dummyjson.com/products'

export async function getAllData() {
  // Get all products (100)
  let data = await fetch(URL + '?limit=0')
  let json = await data.json()
  return json
}

export async function getPerPage(amount = 5) {
  // Get products (5)
  let data = await fetch(URL + '?limit=' + amount)
  let json = await data.json()
  return json
}

export async function search(prompt = '') {
  // Get search results
  if (prompt.length > 0) {
    let data = await fetch(URL + '/search?q=' + prompt)
    let json = await data.json()
    return json
  }
}

export async function getAllCategories() {
  // Get all categories
  let data = await fetch(URL + '/categories')
  let json = await data.json()
  return json
}

export async function getProductOfCategory(category) {
  // Get all categories
  let data = await fetch(URL + '/category/' + category)
  let json = await data.json()
  return json
}

export async function getRating() {
  // Get rating of all products
  let data = await fetch(URL + '?limit=0&select=rating')
  let json = await data.json()
  return json
}

export async function getProductsPrice() {
  // Get products price
  let data = await fetch(URL + '?select=price')
  let json = await data.json()
  return json
}

export async function getProduct(productId) {
  // Get product
  let data = await fetch(URL + '/' + productId)
  let json = await data.json()
  return json
}

export async function getNextPage(page, productsPerPage) {
  // Get rating of all products
  let limit = (page - 1) * productsPerPage
  let data = await fetch(URL + '?limit=' + productsPerPage + '&skip=' + limit)
  let json = await data.json()
  return json
}
