// Личный кабинет пользователя
document.addEventListener('DOMContentLoaded', function() {
    console.log('👤 Инициализация личного кабинета...');
    
    // Проверяем авторизацию
    if (!window.authAPI || !window.authAPI.isAuthenticated()) {
        alert('Для доступа к личному кабинету необходимо авторизоваться');
        window.location.href = '../index.html';
        return;
    }
    
    const user = window.authAPI.getUser();
    console.log('Данные пользователя в профиле:', user);
    
    setupProfileEventListeners();
    loadProfileData();
    
    // Временно отключаем неработающие функции
    document.getElementById('reservationsList').innerHTML = `
        <div class="info-message">
            <h3>Бронирование книг</h3>
            <p>Функция бронирования книг скоро будет доступна</p>
        </div>
    `;
    
    document.getElementById('eventsList').innerHTML = `
        <div class="info-message">
            <h3>Мои мероприятия</h3>
            <p>Функция записи на мероприятия скоро будет доступна</p>
        </div>
    `;
});

function setupProfileEventListeners() {
    // Обработчик выхода
    const logoutBtn = document.getElementById('profileLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите выйти?')) {
                window.authAPI.logout();
            }
        });
    }
    
    // Обработчики вкладок
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchProfileTab(targetTab);
        });
    });
}

function switchProfileTab(tabId) {
    // Убираем активный класс у всех вкладок и контента
    document.querySelectorAll('.profile-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.profile-tab-content').forEach(content => content.classList.remove('active'));
    
    // Добавляем активный класс выбранной вкладке
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

function loadProfileData() {
    const user = window.authAPI.getUser();
    const profileInfo = document.getElementById('profileInfo');
    
    if (user && profileInfo) {
        profileInfo.innerHTML = `
            <div class="profile-field">
                <strong>Логин:</strong> 
                <span>${user.username}</span>
            </div>
            <div class="profile-field">
                <strong>Email:</strong> 
                <span>${user.email || 'Не указан'}</span>
            </div>
            <div class="profile-field">
                <strong>Телефон:</strong> 
                <span>${user.phone || 'Не указан'}</span>
            </div>
            <div class="profile-field">
                <strong>Имя:</strong> 
                <span>${user.first_name || 'Не указано'}</span>
            </div>
            <div class="profile-field">
                <strong>Фамилия:</strong> 
                <span>${user.last_name || 'Не указана'}</span>
            </div>
            <div class="profile-field">
                <strong>Роль:</strong> 
                <span>${user.user_type === 'admin' || user.is_superuser ? 'Администратор' : 'Пользователь'}</span>
            </div>
            <div class="profile-field">
                <strong>Статус:</strong> 
                <span class="status-active">Активен</span>
            </div>
            <div class="profile-field">
                <strong>Дата регистрации:</strong> 
                <span>${new Date(user.created_at).toLocaleDateString('ru-RU')}</span>
            </div>
        `;
    }
}