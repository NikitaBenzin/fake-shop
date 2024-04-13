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

export async function getRating() {
  // Get rating of all products
  let data = await fetch(URL + '?limit=0&select=rating')
  let json = await data.json()
  return json

}