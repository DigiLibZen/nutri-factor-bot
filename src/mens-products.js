import puppeteer from 'puppeteer'
import fs from 'fs'
import { SELECTORS, MENS_PRODUCTS_URL } from './constants.js'

(async () => {
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: { width: 1421, height: 682 } })
    const page = await browser.newPage()

    await page.goto(MENS_PRODUCTS_URL, { waitUntil: 'networkidle0' })

    const productsList = await page.waitForSelector(SELECTORS.productsContainerSelector)
    const products = await productsList.evaluate((list) => {
        const listItems = Array.from(list.childNodes)
        return listItems.map((product) => {
            const productObj = JSON.parse(product.childNodes[1].attributes[2].nodeValue).variants[0]
            const title = productObj.name
            const price = productObj.price / Math.pow(10, 2)
            const options = productObj.options.length === 1 ? productObj.options[0] : productObj.options
            const image = productObj.featured_media ? productObj.featured_media.preview_image.src.replace('//', '') : 'No Image'
            const slug = JSON.parse(product.childNodes[1].attributes[2].nodeValue).handle
            return { title, options, price, image, slug }
        })
    })



    console.log(products)
    await browser.close()

    fs.writeFileSync('./mensProducts.json', JSON.stringify(products))

})()
