import puppeteer from 'puppeteer'
import fs from 'fs'
import { SELECTORS, ALL_PRODUCTS_URL } from './constants.js'

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1421, height: 682 } })
    const page = await browser.newPage()

    await page.goto(ALL_PRODUCTS_URL, { waitUntil: 'networkidle0' })
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    await page.setDefaultNavigationTimeout(5000)

    let showMoreButton = await page.waitForSelector(SELECTORS.showMoreButtonSelector)
    while (showMoreButton) {
        try {
            showMoreButton = await page.waitForSelector(SELECTORS.showMoreButtonSelector)
            await showMoreButton.click()
            await delay(1500)
        }
        catch (e) {
            console.log('No more products to load.')
            break
        }
    }



    const productsList = await page.waitForSelector(SELECTORS.productsContainerSelector)
    const products = await productsList.evaluate((list) => {
        const listItems = Array.from(list.childNodes)
        return listItems.map((product) => {
            productObject = JSON.parse(product.childNodes[1].attributes[2].nodeValue)
            let results = {}
            if (productObject.variants.length < 1) {
                return results
            }
            else if (productObject.variants.length === 1) {
                const variantObj = JSON.parse(product.childNodes[1].attributes[2].nodeValue).variants[0]
                const title = variantObj.name
                const price = variantObj.price / Math.pow(10, 2)
                const variants = variantObj.options.length < 1 ? "No Options Available." : variantObj.options
                const image = variantObj.featured_media ? variantObj.featured_media.preview_image.src.replace('//', '') : 'No Image'
                results = { title, variants, price, image }
            }
            else {
                const variants = productObject.variants.map((variant) => {
                    return {
                        title: variant.name,
                        price: variant.price / Math.pow(10, 2),
                        variants: variant.options.length < 1 ? "No Options Available." : variant.options,
                        image: variant.featured_media ? variant.featured_media.preview_image.src.replace('//', '') : 'No Image'
                    }
                })
                results = variants
            }
            const slug = JSON.parse(product.childNodes[1].attributes[2].nodeValue).handle
            return { ...results, slug }
        })
    })

    console.log(products)
    await browser.close()

    fs.writeFile('/Users/zeeshan.amjad/Documents/nutri-factor-bot/Results/allProducts.json', JSON.stringify(products), (err) => {
        if (err) throw err
        console.log('The file has been saved!')
    })

})()
