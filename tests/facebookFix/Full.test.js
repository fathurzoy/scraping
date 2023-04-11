//npm run test:likeFb post=1 id=idadspower link=

const puppeteer = require('puppeteer')
const axios = require('axios')

const data = require('./db.json') // data ws
const args = process.argv.slice(3) // ['oke', 1, 55]
const parsedArgs = {}
args.forEach(arg => {
	const [key, value] = arg.split('=')
	parsedArgs[key] = value
})

console.log(parsedArgs, 'test')
let idadspower = parsedArgs.id

const run = async () => {
	try {
		console.log(data, data[idadspower], 'data')
		const puppeteerUrl = data[idadspower].data.ws.puppeteer
		const browser = await puppeteer.connect({
			browserWSEndpoint: puppeteerUrl,
			defaultViewport: null,
		})
		const pages = await browser.pages(0)
		console.log(`Number of pages: ${pages.length}`)

		const page = pages[0]

		console.log(parsedArgs.link) // Output: 123

		await page.goto('https://www.facebook.com/' + parsedArgs.link)

		console.log(parsedArgs.link, 'link') // Output: 123

		// Scroll
		for (let index = 0; index < 5; index++) {
			await page.waitForTimeout(1000)
			await page.evaluate(() => {
				setTimeout(() => {
					window.scrollTo({
						top: window.pageYOffset + 50000,
						behavior: 'smooth',
					})
				}, 100) // delay for 1 second before scrolling
			})
		}
		await page.evaluate(() => {
			setTimeout(() => {
				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				})
			}, 1000) // delay for 1 second before scrolling
		})
		await page.waitForTimeout(1000) // random

		// Like
		const countLike = await page.$$eval(
			`div[aria-posinset="${parsedArgs.post}"] div[aria-label="Like"]:nth-of-type(1)`,
			element => element.length
		)
		console.log('1')

		const countSuka = await page.$$eval(
			`div[aria-posinset="${parsedArgs.post}"] div[aria-label="Suka"]:nth-of-type(1)`,
			element => element.length
		)
		console.log('2')

		const elementToInteract = countLike || countSuka
		console.log('3')

		console.log(`elementToInteract ${elementToInteract}`)

		if (elementToInteract > 0) {
			// console.log()
			// await page.waitForSelector("div[aria-label='Suka']", {visible: true});

			const selectorsSuka = await page.$$(
				`div[aria-posinset="${parsedArgs.post}"] div[aria-label="Suka"]:nth-of-type(1)`
			)
			const selectorsLike = await page.$$(
				`div[aria-posinset="${parsedArgs.post}"] div[aria-label="Like"]:nth-of-type(1)`
			)

			const elementToLike = selectorsSuka || selectorsLike
			console.log(elementToLike, 'element to like')

			await page.waitForTimeout(1000)
			elementToLike[0].click(elementToLike[0])
			console.log('LIKED!')

			// await Promise.all(
			// 	elementToLike.map(async (selector, index, arr) => {
			// 		console.log(selector, index, parsedArgs.post, 'ygfghghvhj')
			// 		if (selector && index == 0) {
			// 			await page.waitForTimeout(1000)
			// 			selector.click(selector)
			// 			await page.waitForTimeout(1000)
			// 			console.log('LIKED!')
			// 		}
			// 		//  else {
			// 		// 	await page.waitForTimeout(1000)
			// 		// 	console.log(`Element ${selector} not found.`)
			// 		// }
			// 	})
			// )
			// for (let i = 1; i < 2; i++) {
			//   await page.waitForTimeout(1000);
			//   await selectorsLike[i].click();
			// }
		}

		await page.waitForTimeout(1000)

		// // Logout
		// await page.click(
		// 	"div[aria-label='Kontrol dan Pengaturan Akun'] span div div[role='button'] div div[data-visualcompletion='ignore']"
		// )
		// await page.waitForSelector(
		// 	"div[data-nocookies='true'] div[role='button']",
		// 	{ visible: true }
		// )
		// await page.click("div[data-nocookies='true'] div[role='button']")

		// // Take a screenshot and close the browser
		// // await page.screenshot({ path: './facebook.png' });
		// await browser.close()
	} catch (err) {
		console.log(err, 'test error')
	}
}
run()
