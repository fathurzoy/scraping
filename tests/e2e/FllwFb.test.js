const puppeteer = require('puppeteer')

const data = require('./db.json') // data ws
const puppeteerUrl = data.data.ws.puppeteer // url puppeteer
console.log(puppeteerUrl)

// run test:Fllww -- link=https://www.facebook.com/INAGAME.ID

const run = async () => {
	try {
		const puppeteerUrl = data.data.ws.puppeteer
		const browser = await puppeteer.connect({
			browserWSEndpoint: puppeteerUrl,
			defaultViewport: null,
		})
		const pages = await browser.pages(0)
		console.log(`Number of pages: ${pages.length}`)

		const page = pages[0]

		// Navigate to Facebook and login
		await page.goto('https://www.facebook.com')
		// // await page.goto('https://www.facebook.com/groups/242491427173554/permalink/765652264857465/');
		// await page.goto('https://www.facebook.com/INAGAME.ID');
		await page.waitForSelector('#email', { visible: true })
		await page.type('#email', '100014968182527')
		await page.type('#pass', '8*Py22Rpsp6*#cs')
		await page.keyboard.press('Enter')
		await page.waitForNavigation()
		await page.waitForTimeout(2000)
		await page.goto('https://www.facebook.com/IndiHome')

		// // Perform a search on Facebook
		// await page.waitForSelector("input[placeholder='Cari di Facebook']", {
		// 	visible: true,
		// })
		// await page.type(
		// 	"input[placeholder='Cari di Facebook']",
		// 	'INAGame Indonesia'
		// )
		// await page.keyboard.press('Enter')
		// await page.waitForNavigation()

		// await page.waitForSelector(
		// 	"a[href='https://www.facebook.com/INAGAME.ID']",
		// 	{ visible: true }
		// )
		// await page.waitForTimeout(2000)

		// Follow
		const countFollow = await page.$$eval(
			"div[aria-label='Ikuti']",
			element => element.length
		)
		console.log(`count follow ${countFollow}`)
		if (countFollow > 0) {
			// await page.waitForSelector("div[aria-label='Suka']", {visible: true});
			const selectorsFollow = await page.$$("div[aria-label='Ikuti']")
			await Promise.all(
				selectorsFollow.map(async selector => {
					if (selector) {
						await page.waitForTimeout(100)
						selector.click(selector)
						await page.waitForTimeout(100)
					} else {
						await page.waitForTimeout(100)
						console.log(`Element ${selector} not found.`)
					}
				})
			)
			// for (let i = 1; i < 2; i++) {
			//   await page.waitForTimeout(1000);
			//   await selectorsLike[i].click();
			// }
		} else {
			await page.waitForSelector("div[aria-label='Lihat Opsi']", {
				visible: true,
			})
			await page.click("div[aria-label='Lihat Opsi']")
			const spanElement = await page.waitForSelector(
				"div[role='menu'] div div div div div div div div[role='menuitem'] div div div span[dir='auto']"
			)
			await spanElement.click()
		}

		// await page.click("a[href='https://www.facebook.com/INAGAME.ID']")
		// await page.waitForNavigation()

		console.log('ok')
		await page.waitForTimeout(100)

		// Logout
		await page.click(
			"div[aria-label='Kontrol dan Pengaturan Akun'] span div div[role='button'] div div[data-visualcompletion='ignore']"
		)
		await page.waitForSelector(
			"div[data-nocookies='true'] div[role='button']",
			{ visible: true }
		)
		await page.click("div[data-nocookies='true'] div[role='button']")

		// // Take a screenshot and close the browser
		// // await page.screenshot({ path: './facebook.png' });
		// await browser.close()
	} catch (err) {
		console.log(err.message)
	}
}
run()
