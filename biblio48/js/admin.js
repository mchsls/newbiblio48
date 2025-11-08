// Панель администратора
document.addEventListener('DOMContentLoaded', function() {
    console.log('👑 Инициализация панели администратора...');
    
    // Проверяем авторизацию и права администратора
    if (!window.authAPI || !window.authAPI.isAuthenticated()) {
        alert('Для доступа к панели администратора необходимо авторизоваться');
        window.location.href = '../index.html';
        return;
    }
    
    const user = window.authAPI.getUser();
    if (user.role !== 'admin' && !user.is_superuser) {
        alert('У вас нет прав для доступа к панели администратора');
        window.location.href = '../index.html';
        return;
    }
    
    setupAdminEventListeners();
    loadAdminStats();
    loadUsersList();
});

// Настройка обработчиков событий
function setupAdminEventListeners() {
    // Обработчик выхода
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите выйти?')) {
                window.authAPI.logout();
            }
        });
    }
    
    // Обработчики кнопок управления
    document.getElementById('manageBooksBtn').addEventListener('click', () => toggleSection('booksSection'));
    document.getElementById('manageUsersBtn').addEventListener('click', () => toggleSection('usersSection'));
    document.getElementById('manageEventsBtn').addEventListener('click', () => alert('Управление мероприятиями - в разработке'));
    document.getElementById('manageNewsBtn').addEventListener('click', () => alert('Управление новостями - в разработке'));
    document.getElementById('addBookBtn').addEventListener('click', () => showAddBookForm());
}

// Переключение секций
function toggleSection(sectionId) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionId);
    targetSection.style.display = 'block';
}

// Загрузка статистики
async function loadAdminStats() {
    try {
        // Загрузка количества пользователей
        const usersResponse = await window.authAPI.apiRequest('/auth/users/');
        const users = await usersResponse.json();
        document.getElementById('usersCount').textContent = users.length;
        
        // Загрузка количества книг
        const booksResponse = await window.authAPI.apiRequest('/books/books/');
        const books = await booksResponse.json();
        document.getElementById('booksCount').textContent = books.length;
        
        // Загрузка количества мероприятий
        const eventsResponse = await window.authAPI.apiRequest('/events/events/');
        const events = await eventsResponse.json();
        document.getElementById('eventsCount').textContent = events.length;
        
        // Загрузка количества новостей
        const newsResponse = await window.authAPI.apiRequest('/news/news/');
        const news = await newsResponse.json();
        document.getElementById('newsCount').textContent = news.length;
        
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
    }
}

// Загрузка списка пользователей
async function loadUsersList() {
    try {
        const response = await window.authAPI.apiRequest('/auth/users/');
        const users = await response.json();
        
        const usersList = document.getElementById('usersList');
        
        if (users.length === 0) {
            usersList.innerHTML = '<p>Пользователи не найдены</p>';
            return;
        }
        
        usersList.innerHTML = users.map(user => `
            <div class="user-item">
                <div class="user-info">
                    <h4>${user.username}</h4>
                    <p>${user.email || 'Email не указан'} • ${user.first_name || ''} ${user.last_name || ''}</p>
                    <p>Роль: <span class="role-${user.role}">${user.role === 'admin' ? 'Администратор' : 'Пользователь'}</span> • 
                    Зарегистрирован: ${new Date(user.created_at).toLocaleDateString('ru-RU')}</p>
                </div>
                <div class="user-actions">
                    ${user.role !== 'admin' ? 
                        `<button class="btn btn-sm btn-warning" onclick="makeAdmin(${user.id})">Сделать админом</button>` : 
                        ''
                    }
                    ${!user.is_blocked ? 
                        `<button class="btn btn-sm btn-danger" onclick="blockUser(${user.id})">Заблокировать</button>` : 
                        `<button class="btn btn-sm btn-warning" onclick="unblockUser(${user.id})">Разблокировать</button>`
                    }
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        document.getElementById('usersList').innerHTML = '<p>Ошибка загрузки пользователей</p>';
    }
}

// Функции управления пользователями
async function makeAdmin(userId) {
    if (!confirm('Назначить этого пользователя администратором?')) return;
    
    try {
        const response = await window.authAPI.apiRequest(`/auth/users/${userId}/make_admin/`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('Пользователь назначен администратором');
            loadUsersList();
        } else {
            alert('Ошибка при назначении администратора');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при назначении администратора');
    }
}

async function blockUser(userId) {
    if (!confirm('Заблокировать этого пользователя?')) return;
    
    try {
        const response = await window.authAPI.apiRequest(`/auth/users/${userId}/block/`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('Пользователь заблокирован');
            loadUsersList();
        } else {
            alert('Ошибка при блокировке пользователя');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при блокировке пользователя');
    }
}

async function unblockUser(userId) {
    if (!confirm('Разблокировать этого пользователя?')) return;
    
    try {
        const response = await window.authAPI.apiRequest(`/auth/users/${userId}/unblock/`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('Пользователь разблокирован');
            loadUsersList();
        } else {
            alert('Ошибка при разблокировке пользователя');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при разблокировке пользователя');
    }
}

// Форма добавления книги
function showAddBookForm() {
    const formHtml = `
        <div class="add-book-form">
            <h3>Добавить новую книгу</h3>
            <form id="addBookForm">
                <div class="form-group">
                    <label>Название:</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-group">
                    <label>Автор:</label>
                    <input type="text" name="author" required>
                </div>
                <div class="form-group">
                    <label>ISBN:</label>
                    <input type="text" name="isbn">
                </div>
                <div class="form-group">
                    <label>Описание:</label>
                    <textarea name="description"></textarea>
                </div>
                <div class="form-group">
                    <label>Количество:</label>
                    <input type="number" name="quantity" value="1" min="1">
                </div>
                <button type="submit" class="btn btn-primary">Добавить книгу</button>
                <button type="button" class="btn btn-secondary" onclick="closeAddBookForm()">Отмена</button>
            </form>
        </div>
    `;
    
    document.getElementById('booksList').innerHTML = formHtml;
    
    document.getElementById('addBookForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await addNewBook(new FormData(e.target));
    });
}

async function addNewBook(formData) {
    try {
        const bookData = {
            title: formData.get('title'),
            author: formData.get('author'),
            isbn: formData.get('isbn'),
            description: formData.get('description'),
            quantity: parseInt(formData.get('quantity')),
            available: parseInt(formData.get('quantity'))
        };
        
        const response = await window.authAPI.apiRequest('/books/books/', {
            method: 'POST',
            body: JSON.stringify(bookData)
        });
        
        if (response.ok) {
            alert('Книга успешно добавлена!');
            closeAddBookForm();
            // Здесь можно обновить список книг
        } else {
            alert('Ошибка при добавлении книги');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при добавлении книги');
    }
}

function closeAddBookForm() {
    document.getElementById('booksList').innerHTML = '<p>Используйте кнопку "Добавить книгу" для управления</p>';
}