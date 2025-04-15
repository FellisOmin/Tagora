document.addEventListener('DOMContentLoaded', () => {
	// Получаем элементы: поле ввода, контейнер для сайтов и все теги
	const input = document.getElementById('input') // Поле ввода URL
	const grid = document.querySelector('.grid') // Контейнер для отображения закладок
	const tags = document.querySelectorAll('.spans span') // Теги для фильтрации
	const deleteButton = document.getElementById('delete') // Кнопка удаления
	let deleteMode = false // Переменная для отслеживания режима удаления

	// Для каждого тега добавляем обработчик клика
	tags.forEach(tag => {
		tag.addEventListener('click', () => {
			// Сброс стилей у всех тегов
			tags.forEach(t => {
				t.style.background = '' // Убираем фон
				t.style.color = '' // Убираем цвет текста
			})

			// Меняем местами background и color у выбранного тега
			const computedStyles = window.getComputedStyle(tag)
			const originalBackground = computedStyles.backgroundColor // Получаем текущий фон
			const originalColor = computedStyles.color // Получаем текущий цвет текста

			tag.style.background = originalColor // Меняем фон на цвет текста
			tag.style.color = originalBackground // Меняем цвет текста на фон

			// Получаем значение из поля ввода и удаляем лишние пробелы
			const url = input.value.trim()

			if (url !== '') {
				// ➕ ДОБАВЛЕНИЕ нового сайта
				// Сохраняем в память

				const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '') // Убираем протокол и слеши
				const title = cleanUrl.split('.')[0] // Извлекаем название сайта
				const firstLetter = title.charAt(0).toUpperCase() // Первая буква названия

				const siteDiv = document.createElement('a') // Создаем элемент ссылки
				const fullUrl = /^https?:\/\//.test(url) ? url : 'https://' + url
				siteDiv.setAttribute('href', fullUrl)

				siteDiv.classList.add('site') // Добавляем класс для стилизации
				if (tag.dataset.tag === 'all') return // Пропускаем, если выбран тег "все"

				siteDiv.setAttribute('data-tag', tag.dataset.tag) // Устанавливаем тег для фильтрации

				siteDiv.innerHTML = `
                    <div class="fav"><h2>${firstLetter}</h2></div> <!-- Иконка сайта -->
                    <p class="title">${title}</p> <!-- Название сайта -->
                `

				const fav = siteDiv.querySelector('.fav')
				fav.style.background = originalBackground // Устанавливаем фон для иконки
				fav.style.color = originalColor // Устанавливаем цвет текста для иконки

				grid.appendChild(siteDiv) // Добавляем сайт в контейнер
				input.value = '' // Очищаем поле ввода

				tags.forEach(t => {
					t.style.background = '' // Сбрасываем фон у всех тегов
					t.style.color = '' // Сбрасываем цвет текста у всех тегов
				})

				const allTag = document.querySelector('[data-tag="all"]') // Находим тег "все"
				if (allTag) {
					allTag.click() // Активируем тег "все"
				}
				saveBookmark({
					url: siteDiv.href, // Сохраняем URL
					title, // Сохраняем название
					firstLetter, // Сохраняем первую букву
					tag: tag.dataset.tag, // Сохраняем тег
					bg: originalBackground, // Сохраняем фон
					color: originalColor, // Сохраняем цвет текста
				})
				updateDeleteButtonState() // Обновляем состояние кнопки удаления
			} else {
				// 🔍 СОРТИРОВКА
				const selectedTag = tag.dataset.tag // Получаем выбранный тег
				const sites = document.querySelectorAll('.site') // Получаем все сайты

				sites.forEach(site => {
					if (selectedTag === 'all' || site.dataset.tag === selectedTag) {
						site.style.display = 'flex' // Показываем сайты с выбранным тегом
					} else {
						site.style.display = 'none' // Скрываем остальные сайты
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
			tag.style.background = '' // Сбрасываем фон у всех тегов
			tag.style.color = '' // Сбрасываем цвет текста у всех тегов
		})

		// Выключаем режим удаления при вводе
		deleteMode = false
		deleteButton.classList.remove('active') // Убираем активное состояние кнопки удаления
		deleteButton.disabled = true // Делаем кнопку удаления неактивной

		const favs = grid.querySelectorAll('.site .fav')
		favs.forEach(fav => fav.classList.remove('deletable')) // Убираем класс "deletable" у всех иконок
	}

	// Обновляем доступность кнопки удаления в зависимости от наличия сайтов
	function updateDeleteButtonState() {
		const hasSites = grid.querySelectorAll('.site').length > 0 // Проверяем, есть ли сайты
		deleteButton.disabled = !hasSites // Делаем кнопку активной, если есть сайты
	}

	// Переключение режима удаления
	deleteButton.addEventListener('click', () => {
		deleteMode = !deleteMode // Переключаем режим удаления
		const favs = grid.querySelectorAll('.site .fav')

		if (deleteMode) {
			deleteButton.classList.add('active') // Добавляем активное состояние кнопке
			favs.forEach(fav => fav.classList.add('deletable')) // Добавляем класс "deletable" иконкам
		} else {
			deleteButton.classList.remove('active') // Убираем активное состояние кнопки
			favs.forEach(fav => fav.classList.remove('deletable')) // Убираем класс "deletable" у иконок
		}
	})

	// Удаление закладок по клику в режиме удаления
	grid.addEventListener('click', event => {
		if (deleteMode) {
			const siteLink = event.target.closest('.site') // Находим элемент сайта
			if (siteLink) {
				event.preventDefault() // 🔒 Отключаем переход по ссылке
				siteLink.remove() // Удаляем сайт из DOM
				removeBookmark(siteLink.href) // Удаляем сайт из localStorage

				// Обновляем состояние кнопки удаления
				updateDeleteButtonState()

				// Если не осталось сайтов — отключаем режим удаления
				if (grid.querySelectorAll('.site').length === 0) {
					deleteMode = false
					deleteButton.classList.remove('active') // Убираем активное состояние кнопки
					deleteButton.disabled = true // Делаем кнопку неактивной

					const favs = grid.querySelectorAll('.site .fav')
					favs.forEach(fav => fav.classList.remove('deletable')) // Убираем класс "deletable" у иконок
				}
			}
		}
	})

	// Получаем все закладки из localStorage
	function getBookmarks() {
		const data = localStorage.getItem('bookmarks') // Получаем данные из localStorage
		return data ? JSON.parse(data) : [] // Парсим данные или возвращаем пустой массив
	}

	// Сохраняем закладку в localStorage
	function saveBookmark(bookmark) {
		const bookmarks = getBookmarks() // Получаем текущие закладки
		bookmarks.push(bookmark) // Добавляем новую закладку
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks)) // Сохраняем в localStorage
	}

	// Удаляем закладку из localStorage по URL
	function removeBookmark(url) {
		let bookmarks = getBookmarks() // Получаем текущие закладки
		bookmarks = bookmarks.filter(b => b.url !== url) // Убираем закладку с указанным URL
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks)) // Сохраняем изменения
	}

	// Восстанавливаем закладки из памяти при загрузке
	getBookmarks().forEach(bookmark => {
		const siteDiv = document.createElement('a') // Создаем элемент ссылки
		siteDiv.setAttribute('href', bookmark.url) // Устанавливаем URL
		siteDiv.classList.add('site') // Добавляем класс для стилизации
		siteDiv.setAttribute('data-tag', bookmark.tag) // Устанавливаем тег

		siteDiv.innerHTML = `
        <div class="fav"><h2>${bookmark.firstLetter}</h2></div> <!-- Иконка сайта -->
        <p class="title">${bookmark.title}</p> <!-- Название сайта -->
    `

		const fav = siteDiv.querySelector('.fav')
		fav.style.background = bookmark.bg // Устанавливаем фон для иконки
		fav.style.color = bookmark.color // Устанавливаем цвет текста для иконки

		grid.appendChild(siteDiv) // Добавляем сайт в контейнер
		updateDeleteButtonState() // Обновляем состояние кнопки удаления
	})

	// Проверка при загрузке страницы
	updateDeleteButtonState() // Обновляем состояние кнопки удаления
})
