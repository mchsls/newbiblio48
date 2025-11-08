// Улучшенная система авторизации с Django бэкендом
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Инициализация системы авторизации...');
    
    const loginBtn = document.getElementById('loginBtn');
    const headerLoginBtn = document.getElementById('headerLoginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Элементы для переключения между формами
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    
    // API endpoints - Django бэкенд
    const API_BASE_URL = 'http://localhost:8000/api';
    
    // Глобальная инициализация
    initializeAuthSystem();

    function initializeAuthSystem() {
        console.log('🔄 Инициализация системы авторизации...');
        
        // Проверить авторизацию при загрузке
        checkAuthStatus();
        
        setupEventListeners();
        
        // Создаем глобальные функции для всех страниц
        window.authAPI = {
            apiRequest,
            isAuthenticated: () => {
                return localStorage.getItem('access_token') !== null;
            },
            getUser: () => {
                const user = localStorage.getItem('user');
                return user ? JSON.parse(user) : null;
            },
            logout: handleLogout
        };
    }
    
    function setupEventListeners() {
        // Открытие модального окна
        const loginButtons = [loginBtn, headerLoginBtn];
        loginButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (window.authAPI.isAuthenticated()) {
                        window.location.href = 'pages/profile.html';
                    } else {
                        if (loginModal) {
                            loginModal.style.display = 'block';
                            document.body.style.overflow = 'hidden';
                            showLoginForm();
                        }
                    }
                });
            }
        });
        
        // Закрытие модального окна
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                if (loginModal) {
                    loginModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
        
        // Закрытие при клике вне модального окна
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Переключение на форму регистрации
        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showRegisterForm();
            });
        }
        
        // Переключение на форму входа
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showLoginForm();
            });
        }
        
        // Обработка формы входа
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        // Обработка формы регистрации
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
        }
        
        // Обработчик выхода
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                handleLogout();
            });
        }
    }
    
    function showLoginForm() {
        if (loginFormContainer && registerFormContainer) {
            loginFormContainer.style.display = 'block';
            registerFormContainer.style.display = 'none';
        }
    }
    
    function showRegisterForm() {
        if (loginFormContainer && registerFormContainer) {
            loginFormContainer.style.display = 'none';
            registerFormContainer.style.display = 'block';
        }
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Сохраняем JWT токены
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Закрываем модальное окно
                if (loginModal) {
                    loginModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
                
                // Обновляем интерфейс
                updateUserInterface(data.user);
                
                showNotification(`Добро пожаловать, ${data.user.username || data.user.first_name || 'Пользователь'}!`, 'success');
                
            } else {
                showNotification(data.error || 'Ошибка авторизации!', 'error');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showNotification('Ошибка соединения с сервером', 'error');
        }
    }
    
    async function handleRegister(e) {
        e.preventDefault();
        
        const userData = {
            username: document.getElementById('regUsername').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            password2: document.getElementById('regPassword2').value,
            phone: document.getElementById('regPhone').value,
            first_name: document.getElementById('regFirstName').value,
            last_name: document.getElementById('regLastName').value
        };
        
        // Проверка совпадения паролей
        if (userData.password !== userData.password2) {
            showNotification('Пароли не совпадают!', 'error');
            return;
        }
        
        try {
            const user = await registerUser(userData);
            
            if (loginModal) {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }
    
    async function checkAuthStatus() {
        console.log('🔍 Проверка статуса авторизации...');
        const accessToken = localStorage.getItem('access_token');
        const user = localStorage.getItem('user');
        
        if (accessToken && user) {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Пользователь авторизован:', data.username);
                    updateUserInterface(data);
                } else if (response.status === 401) {
                    await refreshToken();
                    await checkAuthStatus();
                } else {
                    clearAuthData();
                }
            } catch (error) {
                console.error('Ошибка проверки авторизации:', error);
                try {
                    const userData = JSON.parse(user);
                    updateUserInterface(userData);
                } catch (e) {
                    clearAuthData();
                }
            }
        } else {
            console.log('ℹ️ Пользователь не авторизован');
            updateUserInterface(null);
        }
    }
    
    async function refreshToken() {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            clearAuthData();
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access);
                console.log('✅ Токен успешно обновлен');
            } else {
                clearAuthData();
            }
        } catch (error) {
            console.error('Ошибка обновления токена:', error);
            clearAuthData();
        }
    }
    
    function clearAuthData() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        console.log('🧹 Данные авторизации очищены');
        updateUserInterface(null);
    }
    
    function handleLogout() {
        clearAuthData();
        showNotification('Вы успешно вышли из системы!', 'info');
        
        if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('admin.html')) {
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        }
    }
    
    function updateUserInterface(user) {
        console.log('Обновление интерфейса для пользователя:', user);
        
        const userPanel = document.getElementById('userPanel');
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const adminLink = document.getElementById('adminLink');
        const loginButtons = [document.getElementById('loginBtn'), document.getElementById('headerLoginBtn')];
        
        if (userPanel && userName && userRole) {
            if (user) {
                userName.textContent = user.username || user.first_name || 'Пользователь';
                userRole.textContent = user.user_type === 'admin' || user.is_superuser ? 'Администратор' : 'Пользователь';
                userPanel.style.display = 'block';
                
                // Обновляем кнопки входа
                loginButtons.forEach(btn => {
                    if (btn) {
                        btn.innerHTML = `<i class="fas fa-user"></i>${user.username || 'Кабинет'}`;
                        btn.href = 'pages/profile.html';
                    }
                });
                
                // Показываем админ-ссылку если нужно
                if (user.user_type === 'admin' || user.is_superuser) {
                    console.log('Показываем админ-панель для:', user.username);
                    if (adminLink) {
                        adminLink.style.display = 'inline-block';
                    }
                } else {
                    if (adminLink) adminLink.style.display = 'none';
                }
            } else {
                userPanel.style.display = 'none';
                if (adminLink) adminLink.style.display = 'none';
                loginButtons.forEach(btn => {
                    if (btn) {
                        btn.innerHTML = `<i class="fas fa-user"></i>Личный кабинет`;
                        btn.href = '#';
                    }
                });
            }
        }
    }
    
    async function apiRequest(url, options = {}) {
        const token = localStorage.getItem('access_token');
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        const response = await fetch(`${API_BASE_URL}${url}`, mergedOptions);
        
        if (response.status === 401) {
            await refreshToken();
            return apiRequest(url, options);
        }
        
        return response;
    }
    
    async function registerUser(userData) {
        try {
            const { password2, ...registrationData } = userData;
            
            console.log('Отправка данных на регистрацию:', registrationData);
            
            const response = await fetch(`${API_BASE_URL}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });
            
            const data = await response.json();
            console.log('Ответ от сервера:', data);
            
            if (response.ok) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                updateUserInterface(data.user);
                showNotification('Регистрация успешна! Добро пожаловать!', 'success');
                return data.user;
            } else {
                const errorMessage = data.errors ? data.errors.join(', ') : 
                                   data.error ? data.error : 
                                   'Ошибка регистрации';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
    
    function showNotification(message, type) {
        const oldNotifications = document.querySelectorAll('.notification');
        oldNotifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(90deg, #2ecc71, #27ae60)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
        } else {
            notification.style.background = 'linear-gradient(90deg, #3498db, #2980b9)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
});