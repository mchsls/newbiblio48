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
    if (user.user_type !== 'admin' && !user.is_superuser) {
        alert('У вас нет прав для доступа к панели администратора');
        window.location.href = '../index.html';
        return;
    }
    
    console.log('✅ Администратор авторизован:', user.username);
    setupAdminEventListeners();
    loadAdminStats();
});

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
    
    // Обработчики вкладок
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Обработчики кнопок добавления
    const addNewsBtn = document.getElementById('addNewsBtn');
    const addEventBtn = document.getElementById('addEventBtn');
    const addBookBtn = document.getElementById('addBookBtn');
    
    if (addNewsBtn) addNewsBtn.addEventListener('click', () => showNewsModal());
    if (addEventBtn) addEventBtn.addEventListener('click', () => showEventModal());
    if (addBookBtn) addBookBtn.addEventListener('click', () => showBookModal());
}

function switchTab(tabId) {
    // Убираем активный класс у всех кнопок и контента
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Добавляем активный класс выбранной вкладке
    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(`${tabId}-tab`);
    
    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
}

async function loadAdminStats() {
    try {
        // Загрузка количества пользователей
        const usersResponse = await window.authAPI.apiRequest('/auth/users/');
        if (usersResponse.ok) {
            const users = await usersResponse.json();
            document.getElementById('usersCount').textContent = users.length || 0;
        }
        
        // Загрузка количества книг
        const booksResponse = await window.authAPI.apiRequest('/books/');
        if (booksResponse.ok) {
            const books = await booksResponse.json();
            document.getElementById('booksCount').textContent = books.length || 0;
        }
        
        // Загрузка количества мероприятий
        const eventsResponse = await window.authAPI.apiRequest('/events/');
        if (eventsResponse.ok) {
            const events = await eventsResponse.json();
            document.getElementById('eventsCount').textContent = events.length || 0;
        }
        
        // Загрузка количества новостей
        const newsResponse = await window.authAPI.apiRequest('/news/');
        if (newsResponse.ok) {
            const news = await newsResponse.json();
            document.getElementById('newsCount').textContent = news.length || 0;
        }
        
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        
        // Устанавливаем значения по умолчанию
        document.getElementById('usersCount').textContent = '0';
        document.getElementById('booksCount').textContent = '0';
        document.getElementById('eventsCount').textContent = '0';
        document.getElementById('newsCount').textContent = '0';
    }
}

// Функции управления контентом
function showNewsModal() {
    alert('Функция добавления новостей будет реализована в ближайшее время');
}

function showEventModal() {
    alert('Функция добавления мероприятий будет реализована в ближайшее время');
}

function showBookModal() {
    alert('Функция добавления книг будет реализована в ближайшее время');
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
            loadAdminStats();
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
            loadAdminStats();
        } else {
            alert('Ошибка при блокировке пользователя');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при блокировке пользователя');
    }
}