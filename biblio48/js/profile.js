// Личный кабинет пользователя
document.addEventListener('DOMContentLoaded', function() {
    console.log('👤 Инициализация личного кабинета...');
    
    // Проверяем авторизацию
    if (!window.authAPI || !window.authAPI.isAuthenticated()) {
        alert('Для доступа к личному кабинету необходимо авторизоваться');
        window.location.href = '../index.html';
        return;
    }
    
    setupProfileEventListeners();
    loadProfileData();
    loadUserBookings();
    loadUserEvents();
});

// Настройка обработчиков событий
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
}

// Загрузка данных профиля
async function loadProfileData() {
    try {
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
                    <span>${user.role === 'admin' ? 'Администратор' : 'Пользователь'}</span>
                </div>
                <div class="profile-field">
                    <strong>Дата регистрации:</strong> 
                    <span>${new Date(user.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        document.getElementById('profileInfo').innerHTML = '<p>Ошибка загрузки данных профиля</p>';
    }
}

// Загрузка бронирований пользователя
async function loadUserBookings() {
    try {
        const response = await window.authAPI.apiRequest('/books/reservations/');
        const bookings = await response.json();
        
        const bookingsList = document.getElementById('bookingsList');
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p class="loading-text">У вас нет забронированных книг</p>';
            return;
        }
        
        bookingsList.innerHTML = bookings.map(booking => `
            <div class="booking-item">
                <h4>${booking.book_title}</h4>
                <p>Статус: <span class="status-${booking.status}">${getStatusText(booking.status)}</span></p>
                <p>Дата бронирования: ${new Date(booking.reservation_date).toLocaleDateString('ru-RU')}</p>
                ${booking.return_date ? `<p>Дата возврата: ${new Date(booking.return_date).toLocaleDateString('ru-RU')}</p>` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Ошибка загрузки бронирований:', error);
        document.getElementById('bookingsList').innerHTML = '<p class="loading-text">Ошибка загрузки бронирований</p>';
    }
}

// Загрузка мероприятий пользователя
async function loadUserEvents() {
    try {
        const response = await window.authAPI.apiRequest('/events/registrations/');
        const events = await response.json();
        
        const eventsList = document.getElementById('eventsList');
        
        if (events.length === 0) {
            eventsList.innerHTML = '<p class="loading-text">Вы не зарегистрированы на мероприятия</p>';
            return;
        }
        
        eventsList.innerHTML = events.map(event => `
            <div class="event-item">
                <h4>${event.event_title}</h4>
                <p>Дата регистрации: ${new Date(event.registration_date).toLocaleDateString('ru-RU')}</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Ошибка загрузки мероприятий:', error);
        document.getElementById('eventsList').innerHTML = '<p class="loading-text">Ошибка загрузки мероприятий</p>';
    }
}

// Функция для получения текста статуса
function getStatusText(status) {
    const statusMap = {
        'pending': 'Ожидает',
        'approved': 'Одобрено',
        'rejected': 'Отклонено',
        'returned': 'Возвращено'
    };
    return statusMap[status] || status;
}