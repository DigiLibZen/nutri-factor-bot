const BASE_URL = "https://www.nutrifactor.com.pk"
const ALL_PRODUCTS_URL = `${BASE_URL}/collections/all-products`
const MENS_PRODUCTS_URL = `${BASE_URL}/collections/mens-health`
const SELECTORS = {
    productsContainerSelector: 'ul#main-collection-product-grid',
    showMoreButtonSelector: 'a[data-load-more="Show More"]',
}

export { ALL_PRODUCTS_URL, MENS_PRODUCTS_URL, SELECTORS }