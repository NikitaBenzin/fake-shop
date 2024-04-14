// TODO: 1. add categories filtering
//       2. add price filter

import { getAllCategories, getAllData, getPerPage, getProduct, getProductOfCategory, getProductsPrice, getRating, search } from './service.js'


// VARIABLES
const productsLayout = document.querySelector('#products')

const pageStyleGrid = document.querySelector('#grid')
const pageStyleList = document.querySelector('#list')

const searchInput = document.querySelector('#searchInput')
const searchBtn = document.querySelector('#searchBtn')

const categoriesLayout = document.querySelector('#categories')
const priceRangeInput = document.querySelector('#priceRange')
const rangePrice = document.querySelector('#rangePrice')
// FUNCTIONS
initializeProducts()
initializeCategories()
initializeMaxRangePrice()

// Products initialize function
async function initializeProducts(productsPerPage = 5, sortedArray = []) {
  let productsCards = ``

  // Show loading spinner
  const spinner = `<div class="lds-dual-ring"></div>`
  productsLayout.innerHTML = spinner

  if (sortedArray.length) {
    let products = sortedArray

    for (let i = 0; i < productsPerPage; i++) {
      productsCards += await getProductCard(products[i].id)
    }

  } else if (productsSortby.value === 'best') {
    let { products } = await getPerPage(productsPerPage)

    for (let i = 0; i < productsPerPage; i++) {
      productsCards += await getProductCard(products[i].id)
    }
  }

  productsLayout.innerHTML = productsCards

}

// Create cards per page depending on selected amount
productsPerPage.addEventListener('change', () => {
  productsSortby.value = 'best'
  initializeProducts(productsPerPage.value)
})

// Sort products by selected value
productsSortby.addEventListener('change', () => {
  switch (productsSortby.value) {
    case 'rating':
      sortByRating()
      break
    case 'priseUp':
      sortByPrice('up')
      break
    case 'priseDown':
      sortByPrice('down')
      break

    default:
      initializeProducts(productsPerPage.value)
      break
  }
})

// Return string with li component
async function getProductCard(itemId) {
  let oneProduct = await getProduct(itemId)

  return `
    <li productId="${oneProduct.id}" class="product">
      <img src="${oneProduct.thumbnail}" alt="${oneProduct.title}">
      <section class="productInfo">
        <h3>${oneProduct.title}</h3>
        <span class="productPrice">
          <p class="priseNormal">$${oneProduct.price}.00</p>
          <s>$${oneProduct.price + 22}.00</s>
          <p>&#9733; ${oneProduct.rating}</p>
        </span>
        <p class="productDescription">${oneProduct.description}</p>
      </section>
    </li>
  `
}

// Sorting function by rating
async function sortByRating() {
  const { products } = await getRating()
  let newArray = []

  products.forEach(product => {
    newArray.push({ "id": product.id, "rating": product.rating })
  })

  newArray.sort(function (a, b) {
    return a.rating - b.rating
  })
  initializeProducts(productsPerPage.value, newArray.reverse())
}

// Sorting function by price
async function sortByPrice(direction) {
  const { products } = await getProductsPrice()
  let sortedArray = []

  switch (direction) {
    case 'up':
      products.forEach(product => {
        sortedArray.push({ "id": product.id, "price": product.price })
      })

      sortedArray.sort(function (a, b) {
        return a.price - b.price
      })
      break

    case 'down':
      products.forEach(product => {
        sortedArray.push({ "id": product.id, "price": product.price })
      })

      sortedArray.sort(function (a, b) {
        return b.price - a.price
      })
      break

    default:
      break
  }
  initializeProducts(productsPerPage.value, sortedArray)
}

pageStyleGrid.addEventListener('click', () => {
  pageStyleGrid.classList.add('active')
  productsLayout.classList.add('cardsGrid')
  pageStyleList.classList.remove('active')
})

pageStyleList.addEventListener('click', () => {
  pageStyleList.classList.add('active')
  productsLayout.classList.remove('cardsGrid')
  pageStyleGrid.classList.remove('active')
})



searchBtn.addEventListener('click', () => {
  searchProduct()
})

async function searchProduct() {
  // Show loading spinner
  const spinner = `<div class="lds-dual-ring"></div>`
  productsLayout.innerHTML = spinner

  const { products } = await search(searchInput.value)
  let newArray = []

  products.forEach(product => {
    newArray.push(product)
  })

  let productsCards = ``

  for (let i = 0; i < newArray.length; i++) {
    productsCards += await getProductCard(newArray[i].id)
  }

  productsLayout.innerHTML = productsCards
}

async function initializeCategories() {
  let allCategories = await getAllCategories()

  let categories = ``

  allCategories.forEach(category => {

    const newElement = document.createElement('label')
    newElement.setAttribute('for', category)

    categories = `
      <input type="checkbox" name="${category}" id="${category}">${category}
    `
    newElement.innerHTML = categories
    newElement.addEventListener('change', () => {
      showProductsOfCategory(category)
    })
    categoriesLayout.appendChild(newElement)

  })

}

async function showProductsOfCategory(categoryName) {
  const { products } = await getProductOfCategory(categoryName)
  let newArray = []

  // Show loading spinner
  const spinner = `<div class="lds-dual-ring"></div>`
  productsLayout.innerHTML = spinner

  let categoriesCheckboxes = document.querySelectorAll('#categories input')
  categoriesCheckboxes.forEach(input => {
    if (categoryName != input.getAttribute('id')) {
      input.checked = false
    }
  })

  products.forEach(product => {
    newArray.push(product)
  })

  let productsCards = ``

  for (let i = 0; i < newArray.length; i++) {
    productsCards += await getProductCard(newArray[i].id)
  }

  productsLayout.innerHTML = productsCards
}

priceRangeInput.addEventListener('mouseup', (event) => {
  changeMaxRangePrice(event.target.value)
})

async function initializeMaxRangePrice() {
  const { products } = await getProductsPrice()
  let sortedArray = []

  products.forEach(product => {
    sortedArray.push({ "id": product.id, "price": product.price })
  })

  sortedArray.sort(function (a, b) {
    return b.price - a.price
  })

  priceRangeInput.setAttribute('max', sortedArray[0].price)
  priceRangeInput.setAttribute('value', sortedArray[0].price)
  rangePrice.innerText = `From $0 to $${sortedArray[0].price}`
}

async function changeMaxRangePrice(maxValue) {
  const { products } = await getAllData()
  let sortedArray = []

  products.forEach(product => {
    if (product.price <= maxValue) {
      sortedArray.push(product)
    }
  })

  rangePrice.innerText = `From $0 to $${maxValue}`
  if (sortedArray.length) {
    initializeProducts(productsPerPage.value, sortedArray)
  } else {
    productsLayout.innerText = `There is no products with this price`
  }
}