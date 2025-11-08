// Основные функции сайта
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Плавное появление элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками контента
    const contentCards = document.querySelectorAll('.content-card, .service-card, .interesting-card');
    contentCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Анимация логотипа при загрузке
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(-10px)';
        logo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            logo.style.opacity = '1';
            logo.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Добавляем интерактивность карточкам
    const cards = document.querySelectorAll('.content-card, .service-card, .interesting-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleY = (x - centerX) / 25;
            const angleX = (centerY - y) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
        });
    });
    
    // Закрытие мобильного меню при клике на ссылку
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
            }
        });
    });
});
// Основные функции сайта
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Плавное появление элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками контента
    const contentCards = document.querySelectorAll('.content-card, .service-card, .interesting-card, .eresource-card, .news-card');
    contentCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Анимация логотипа при загрузке
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(-10px)';
        logo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            logo.style.opacity = '1';
            logo.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Добавляем интерактивность карточкам
    const cards = document.querySelectorAll('.content-card, .service-card, .interesting-card, .eresource-card, .news-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleY = (x - centerX) / 25;
            const angleX = (centerY - y) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
        });
    });
    
    // Закрытие мобильного меню при клике на ссылку
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
            }
        });
    });
});
// Добавьте этот код в файл main.js или создайте новый файл для вкладок
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация вкладок
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Убираем активный класс у всех кнопок и панелей
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Добавляем активный класс текущей кнопке и соответствующей панели
                this.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }
    
    // Анимация появления элементов при прокрутке
    const animatedElements = document.querySelectorAll('.timeline-item, .service-item, .material-item, .stat-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
});
// Загрузка данных с Django API
class DataLoader {
    constructor() {
        this.API_BASE = 'http://localhost:8000/api';
    }

    // Загрузка новостей
    async loadNews() {
        try {
            const response = await fetch(`${this.API_BASE}/news/news/`);
            const news = await response.json();
            this.displayNews(news);
        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
        }
    }

    // Загрузка мероприятий
    async loadEvents() {
        try {
            const response = await fetch(`${this.API_BASE}/events/events/`);
            const events = await response.json();
            this.displayEvents(events);
        } catch (error) {
            console.error('Ошибка загрузки мероприятий:', error);
        }
    }

    // Загрузка книг
    async loadBooks() {
        try {
            const response = await fetch(`${this.API_BASE}/books/books/`);
            const books = await response.json();
            this.displayBooks(books);
        } catch (error) {
            console.error('Ошибка загрузки книг:', error);
        }
    }

    // Отображение новостей на главной
    displayNews(news) {
        const newsGrid = document.querySelector('.news-grid');
        if (!newsGrid) return;

        newsGrid.innerHTML = news.slice(0, 3).map(item => `
            <div class="news-card">
                <div class="news-image">
                    ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}">` : ''}
                </div>
                <div class="news-content">
                    <div class="news-date">${new Date(item.created_at).toLocaleDateString('ru-RU')}</div>
                    <h3>${item.title}</h3>
                    <p>${item.content.substring(0, 100)}...</p>
                    <a href="pages/news.html#news-${item.id}" class="btn">Подробнее</a>
                </div>
            </div>
        `).join('');
    }

    // Отображение мероприятий в афише
    displayEvents(events) {
        const eventsTrack = document.getElementById('eventsTrack');
        if (!eventsTrack) return;

        eventsTrack.innerHTML = events.slice(0, 6).map(event => `
            <div class="event-slide">
                <div class="event-card">
                    <div class="event-image">
                        ${event.image_url ? `<img src="${event.image_url}" alt="${event.title}">` : ''}
                        <div class="event-overlay">
                            <div class="event-date-badge">
                                <span class="event-day">${new Date(event.date).getDate()}</span>
                                <span class="event-month">${new Date(event.date).toLocaleString('ru-RU', { month: 'long' })}</span>
                            </div>
                        </div>
                    </div>
                    <div class="event-info">
                        <h3>${event.title}</h3>
                        <p>${event.description.substring(0, 100)}...</p>
                        <div class="event-meta">
                            <span class="event-time">${new Date(event.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span class="event-location">${event.location}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Перезапускаем слайдер после загрузки данных
        if (window.afishaSlider) {
            window.afishaSlider.init();
        }
    }

    // Отображение книг (для страницы книг)
    displayBooks(books) {
        // Можно добавить на страницу книг
        console.log('Загружены книги:', books);
    }

    // Инициализация загрузки всех данных
    init() {
        this.loadNews();
        this.loadEvents();
        this.loadBooks();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const dataLoader = new DataLoader();
    dataLoader.init();
});