//npm run test:CmntFb val2=1 val1=oke id=j63aic8 link=indah.prmtsari

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

		await page.goto('https://www.facebook.com/' + parsedArgs.link, { waitUntil: 'networkidle0' })
		await page.waitForTimeout(1000)

		console.log(parsedArgs.link, 'aaaaaaaaaa') // Output: 123

		// Scroll
		let loop = 0
		while (loop < parsedArgs.post + 10) {
			const selector = await page.$$(
				`div[aria-posinset="${parsedArgs.post}"] div[aria-label="Leave a comment"]:nth-of-type(1)`
			)
			console.log(selector.length)
			if (selector.length > 0) {
				break;
			} else{
				for (let index = 0; index < 2; index++) {
					await page.waitForTimeout(1000)
					await page.evaluate(() => {
						setTimeout(() => {
							window.scrollTo({
								top: window.pageYOffset + 1000,
								behavior: 'smooth',
							})
						}, 100) // delay for 1 second before scrolling
					})
				}
			}
			loop++
		}
		// for (let index = 0; index < 5; index++) {
		// 	await page.waitForTimeout(1000)
		// 	await page.evaluate(() => {
		// 		setTimeout(() => {
		// 			window.scrollTo({
		// 				top: window.pageYOffset + 50000,
		// 				behavior: 'smooth',
		// 			})
		// 		}, 100) // delay for 1 second before scrolling
		// 	})
		// }
		// await page.evaluate(() => {
		// 	setTimeout(() => {
		// 		window.scrollTo({
		// 			top: 0,
		// 			behavior: 'smooth',
		// 		})
		// 	}, 1000) // delay for 1 second before scrolling
		// })
		await page.waitForTimeout(5000) 

		// Comment
		const selector = await page.$$(
			`div[aria-posinset="${parsedArgs.post}"] div[aria-label="Leave a comment"]:nth-of-type(1)`
		)
		console.log(selector)
		if (selector.length > 0) {
			await page.waitForTimeout(1000) 
			await selector[0].click()
			console.log('COMMENT!')
			try {
				await page.waitForSelector(`div[aria-label='Write a comment']`, { timeout: 2000 })
			} catch (error) {
				console.log('Selector not open dialog comment')
			}
			await page.keyboard.type(parsedArgs.type, { delay: 100 });
			await page.waitForTimeout(1000);
			await page.keyboard.press('Enter');
			await page.keyboard.press('Escape');
		} else {
			console.log(`Element at index ${parsedArgs.post} not found`);


			// if (parsedArgs.val2) {
			// 	console.log(parsedArgs.val2, 'asdasd')

			// 	// jika ingin comment spesifik post
			// 	await selectorsComment[parsedArgs.val2].click()
			// 	await page.waitForTimeout(1000)
			// 	await page.keyboard.type(parsedArgs.val1, { delay: 100 })
			// 	await page.waitForTimeout(1000)

			// 	// await selectorsComment[parsedArgs.val2].type(parsedArgs.val1, {
			// 	// 	delay: 500,
			// 	// })
			// 	await page.keyboard.press('Enter')
			// 	await page.keyboard.press('Escape')
			// } else {
			// 	for await (const selector of selectorsComment) {
			// 		await selector.type(parsedArgs.val1, { delay: 10 })
			// 		await page.waitForTimeout(1000)
			// 		await page.keyboard.press('Enter')
			// 	}
			// }
			// selectorsComment.forEach(async (selector, index) => {
			// 	console.log(selector, 'SELECTOR ONE')
			// 	if (selector) {
			// 		await page.waitForTimeout(1000)
			// 		if (parsedArgs.val1 && parsedArgs.val2 == index) {
			// 			await selector.type(parsedArgs.val1, { delay: 1000 })
			// 			console.log(parsedArgs, 'ARGUMENT')
			// 		} else {
			// 			// console.log('Halo')
			// 			// await selector.type('Halo', { delay: 1000 })
			// 		}

			// 		const args = process.argv.slice(2) // Hilangkan dua elemen pertama dari array (path ke executable dan path ke program)

			// 		const commentRegex = /--comment=(.*)/ // Regular expression untuk mengambil nilai dari --comment
			// 		const commentMatch = args.find(arg => arg.match(commentRegex)) // Cari argumen yang sesuai dengan regular expression

			// 		const comment = commentMatch
			// 			? commentMatch.match(commentRegex)[1]
			// 			: null // Ambil nilai comment dari hasil match atau null jika tidak ada yang cocok

			// 		console.log(comment) // Output: "halo"

			// 		await page.waitForTimeout(1000)
			// 		await page.keyboard.press('Enter')
			// 		await page.waitForTimeout(1000)
			// 	} else {
			// 		await page.waitForTimeout(1000)
			// 		console.log(`Element ${selector} not found.`)
			// 	}
			// })
			// await Promise.all(
			// 	selectorsComment.map(async selector => {
			// 		if (selector) {
			// 			await page.waitForTimeout(1000)
			// 			if (parsedArgs.val1) {
			// 				await selector.type(parsedArgs.val1, { delay: 1000 })
			// 				console.log(parsedArgs.val1)
			// 			} else {
			// 				console.log('Halo')
			// 				await selector.type('Halo', { delay: 1000 })
			// 			}

			// 			const args = process.argv.slice(2) // Hilangkan dua elemen pertama dari array (path ke executable dan path ke program)

			// 			const commentRegex = /--comment=(.*)/ // Regular expression untuk mengambil nilai dari --comment
			// 			const commentMatch = args.find(arg => arg.match(commentRegex)) // Cari argumen yang sesuai dengan regular expression

			// 			const comment = commentMatch
			// 				? commentMatch.match(commentRegex)[1]
			// 				: null // Ambil nilai comment dari hasil match atau null jika tidak ada yang cocok

			// 			console.log(comment) // Output: "halo"

			// 			await page.waitForTimeout(1000)
			// 			await page.keyboard.press('Enter')
			// 			await page.waitForTimeout(1000)
			// 		} else {
			// 			await page.waitForTimeout(1000)
			// 			console.log(`Element ${selector} not found.`)
			// 		}
			// 	})
			// )

			// for (let i = 0; i < 2; i++) {
			//   await page.waitForTimeout(1000);
			//   await selectorsComment[i].type("Halo");
			//   await page.keyboard.press('Enter');
			// }

			// const waitTime = Math.floor(Math.random() * 1000) + 500 // menghasilkan angka acak antara 500 dan 1499 ms
			// await page.waitForTimeout(waitTime) // tunggu selama waktu yang dihasilkan

			// process.exit()
		}
		// await page.waitForTimeout(10000)

		// // Logout
		// await page.click(
		// 	"div[aria-label='Kontrol dan Pengaturan Akun'] span div div[role='button'] div div[data-visualcompletion='ignore']"
		// )
		// await page.waitForSelector(
		// 	"div[data-nocookies='true'] div[role='button']",
		// 	{ visible: true }
		// )
		// await page.click("div[data-nocookies='true'] div[role='button']")
	} catch (err) {
		console.log(err.message)
	}
}
run()
