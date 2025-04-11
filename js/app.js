document.addEventListener('DOMContentLoaded', () => {
	// Получаем элементы: поле ввода, контейнер для сайтов и все теги
	const input = document.getElementById('input')
	const grid = document.querySelector('.grid')
	const tags = document.querySelectorAll('.spans span')

	// Для каждого тега добавляем обработчик клика
	tags.forEach(tag => {
		tag.addEventListener('click', () => {
			// Сброс стилей у всех тегов
			tags.forEach(t => {
				t.style.background = ''
				t.style.color = ''
			})

			// Меняем местами background и color у выбранного тега
			const computedStyles = window.getComputedStyle(tag)
			const originalBackground = computedStyles.backgroundColor
			const originalColor = computedStyles.color

			tag.style.background = originalColor
			tag.style.color = originalBackground

			// Получаем значение из поля ввода и удаляем лишние пробелы
			const url = input.value.trim()

			if (url !== '') {
				// ➕ ДОБАВЛЕНИЕ нового сайта

				// Убираем протокол (http/https) и завершающий слэш из URL
				const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
				// Извлекаем название сайта (до первой точки)
				const title = cleanUrl.split('.')[0]
				// Берем первую букву названия сайта и делаем её заглавной
				const firstLetter = title.charAt(0).toUpperCase()

				// Создаем новый элемент для сайта
				const siteDiv = document.createElement('a')
				if (url === 'https://') {
					siteDiv.setAttribute('href', url)
				} else {
					siteDiv.setAttribute('href', 'https://' + url)
				}

				siteDiv.classList.add('site')
				if (tag.dataset.tag === 'all') return

				siteDiv.setAttribute('data-tag', tag.dataset.tag)

				// Вставляем HTML
				siteDiv.innerHTML = `
					<div class="fav"><h2>${firstLetter}</h2></div>
					<p class="title">${title}</p>
				`

				// Красим блок .fav в цвета тега
				const fav = siteDiv.querySelector('.fav')
				fav.style.background = originalBackground
				fav.style.color = originalColor

				// Добавляем на страницу
				grid.appendChild(siteDiv)
				input.value = ''
			} else {
				// 🔍 СОРТИРОВКА
				const selectedTag = tag.dataset.tag
				const sites = document.querySelectorAll('.site')

				sites.forEach(site => {
					if (selectedTag === 'all' || site.dataset.tag === selectedTag) {
						site.style.display = 'flex'
					} else {
						site.style.display = 'none'
					}
				})
			}
		})
	})
})
