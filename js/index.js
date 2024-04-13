import { getAllCategories, getAllData, getPerPage, getRating, search } from './service.js'


let data = await getPerPage()
let dataAll = await getAllData()
let searchData = await search('phone')
let allCategories = await getAllCategories()

// VARIABLES
const selectPerPage = document.querySelector('#productsPerPage')
const selectSortby = document.querySelector('#productsSortby')

const productsLayout = document.querySelector('#products')
//.cardsGrid

// FUNCTIONS
initializeProducts()

async function initializeProducts(productsPerPage = 5, sortedArray = []) {
  let productsCards = ``

  console.log(sortedArray)
  if (sortedArray.length) {
    console.log(sortedArray)
    let products = sortedArray

    products.forEach((product, index) => {
      if (index < productsPerPage) {
        productsCards += `
          <li productId="${product.id}" class="product">
            <img src="${product.thumbnail}" alt="${product.title}">
            <section class="productInfo">
              <h3>${product.title}</h3>
              <span class="productPrice">
                <p class="priseNormal">$${product.price}.00</p>
                <s>$${product.price + 22}.00</s>
              </span>
              <p class="productDescription">${product.description}</p>
            </section>
          </li>
        `
      } else return
    })
  } else {
    let { products } = await getPerPage(productsPerPage)
    products.forEach(product => {
      productsCards += `
        <li productId="${product.id}" class="product">
          <img src="${product.thumbnail}" alt="${product.title}">
          <section class="productInfo">
            <h3>${product.title}</h3>
            <span class="productPrice">
              <p class="priseNormal">$${product.price}.00</p>
              <s>$${product.price + 22}.00</s>
            </span>
            <p class="productDescription">${product.description}</p>
          </section>
        </li>
      `
    })
  }

  productsLayout.innerHTML = productsCards
}

// Create cards per page depending on selected amount
productsPerPage.addEventListener('change', () => {
  initializeProducts(productsPerPage.value)
})

// Sort products by selected value
productsSortby.addEventListener('change', () => {
  switch (productsSortby.value) {
    case 'rating':
      sortByRating()
      break
    case 'priseUp':

      break
    case 'priseDown':

      break

    default:
      initializeProducts(productsPerPage.value)
      break
  }
})




async function sortByRating() {
  const { products } = await getRating()
  let productsRating = []

  products.forEach(product => {
    productsRating.push({ "id": product.id, "rating": product.rating })
  })

  productsRating.sort(function (a, b) {
    return a.rating - b.rating
  })
  initializeProducts(productsPerPage.value, productsRating)
}