document.addEventListener('DOMContentLoaded', () => {
	// Получаем элементы: поле ввода, контейнер для сайтов и все теги
	const input = document.getElementById('input')
	const grid = document.querySelector('.grid')
	const tags = document.querySelectorAll('.spans span')
	const deleteButton = document.getElementById('delete')
	let deleteMode = false // Переменная для отслеживания режима удаления

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

				const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
				const title = cleanUrl.split('.')[0]
				const firstLetter = title.charAt(0).toUpperCase()

				const siteDiv = document.createElement('a')
				if (url === 'https://') {
					siteDiv.setAttribute('href', url)
				} else {
					siteDiv.setAttribute('href', 'https://' + url)
				}

				siteDiv.classList.add('site')
				if (tag.dataset.tag === 'all') return

				siteDiv.setAttribute('data-tag', tag.dataset.tag)

				siteDiv.innerHTML = `
					<div class="fav"><h2>${firstLetter}</h2></div>
					<p class="title">${title}</p>
				`

				const fav = siteDiv.querySelector('.fav')
				fav.style.background = originalBackground
				fav.style.color = originalColor

				grid.appendChild(siteDiv)
				input.value = ''

				tags.forEach(t => {
					t.style.background = ''
					t.style.color = ''
				})

				const allTag = document.querySelector('[data-tag="all"]')
				if (allTag) {
					allTag.click()
				}

				updateDeleteButtonState()
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

	// При фокусе или вводе в поле — сбрасываем стили у всех тегов
	input.addEventListener('focus', handleInputActivity)
	input.addEventListener('input', handleInputActivity)
	input.addEventListener('blur', () => {
		updateDeleteButtonState() // Проверяем наличие сайтов
	})

	function handleInputActivity() {
		tags.forEach(tag => {
			tag.style.background = ''
			tag.style.color = ''
		})

		// Выключаем режим удаления при вводе
		deleteMode = false
		deleteButton.classList.remove('active')
		deleteButton.disabled = true

		const favs = grid.querySelectorAll('.site .fav')
		favs.forEach(fav => fav.classList.remove('deletable'))
	}

	// Обновляем доступность кнопки удаления в зависимости от наличия сайтов
	function updateDeleteButtonState() {
		const hasSites = grid.querySelectorAll('.site').length > 0
		deleteButton.disabled = !hasSites
	}

	// Переключение режима удаления
	deleteButton.addEventListener('click', () => {
		deleteMode = !deleteMode
		const favs = grid.querySelectorAll('.site .fav')

		if (deleteMode) {
			deleteButton.classList.add('active')
			favs.forEach(fav => fav.classList.add('deletable'))
		} else {
			deleteButton.classList.remove('active')
			favs.forEach(fav => fav.classList.remove('deletable'))
		}
	})

	// Удаление закладок по клику в режиме удаления
	grid.addEventListener('click', event => {
		if (deleteMode) {
			const siteLink = event.target.closest('.site')
			if (siteLink) {
				event.preventDefault() // 🔒 Отключаем переход по ссылке
				siteLink.remove()

				// Обновляем состояние кнопки удаления
				updateDeleteButtonState()

				// Если не осталось сайтов — отключаем режим удаления
				if (grid.querySelectorAll('.site').length === 0) {
					deleteMode = false
					deleteButton.classList.remove('active')
					deleteButton.disabled = true

					const favs = grid.querySelectorAll('.site .fav')
					favs.forEach(fav => fav.classList.remove('deletable'))
				}
			}
		}
	})

	// Проверка при загрузке страницы
	updateDeleteButtonState()
})
