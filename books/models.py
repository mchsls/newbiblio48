from django.db import models
from users.models import CustomUser

class Book(models.Model):
    title = models.CharField(max_length=200, verbose_name="Название")
    author = models.CharField(max_length=100, verbose_name="Автор")
    isbn = models.CharField(max_length=13, unique=True, verbose_name="ISBN")
    description = models.TextField(blank=True, verbose_name="Описание")
    quantity = models.IntegerField(default=1, verbose_name="Общее количество")
    available = models.IntegerField(default=1, verbose_name="Доступно")
    cover_url = models.CharField(max_length=255, blank=True, null=True, verbose_name="Обложка (URL)")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    is_published = models.BooleanField(default=True, verbose_name="Опубликовано")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Книга"
        verbose_name_plural = "Книги"
        ordering = ['-created_at']

class BookReservation(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Ожидает'),
        ('approved', 'Одобрено'),
        ('rejected', 'Отклонено'),
        ('returned', 'Возвращено'),
    )
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, verbose_name="Пользователь")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, verbose_name="Книга")
    reservation_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата бронирования")
    return_date = models.DateTimeField(null=True, blank=True, verbose_name="Дата возврата")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', verbose_name="Статус")

    class Meta:
        verbose_name = "Бронирование книги"
        verbose_name_plural = "Бронирования книг"
        ordering = ['-reservation_date']

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"