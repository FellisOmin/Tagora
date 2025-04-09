document.addEventListener('DOMContentLoaded', () => {
	const input = document.getElementById('input')
	const grid = document.querySelector('.grid')
	const tags = document.querySelectorAll('.spans span')
	const url = input.value.trim()
	const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
	const title = cleanUrl.split('.')[0]
	const firstLetter = title.charAt(0).toUpperCase()

	const siteDiv = document.createElement('div')
	tags.forEach(tag => {
		tag.addEventListener('click', () => {
			if (!url) return

			siteDiv.classList.add('site')
			siteDiv.setAttribute('data-tag', tag.id) // для сортировки

			siteDiv.innerHTML = `<div class="site">
        <div class="fav"><h2>${firstLetter}</h2></div>
        <p class="title">${title}</p> </div>
      `

			grid.appendChild(siteDiv)
			input.value = '' // очистка поля
		})
	})
})
document.addEventListener('DOMContentLoaded', () => {
	const tagSpans = document.querySelectorAll('.spans span')
	const sites = document.querySelectorAll('.site')

	tagSpans.forEach(span => {
		span.addEventListener('click', () => {
			const selectedTag = span.dataset.tag

			sites.forEach(site => {
				if (site.dataset.tag === selectedTag) {
					site.style.display = 'block' // показываем
				} else {
					site.style.display = 'none' // скрываем
				}
			})
		})
	})
})
