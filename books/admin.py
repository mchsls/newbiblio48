from django.contrib import admin
from .models import Book, BookReservation

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'isbn', 'quantity', 'available', 'is_published', 'created_at']
    list_filter = ['is_published', 'created_at', 'author']
    search_fields = ['title', 'author', 'isbn']
    list_editable = ['is_published', 'quantity', 'available']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'author', 'isbn', 'description')
        }),
        ('Количественные данные', {
            'fields': ('quantity', 'available')
        }),
        ('Дополнительно', {
            'fields': ('cover_url', 'is_published')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(BookReservation)
class BookReservationAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'reservation_date', 'status', 'return_date']
    list_filter = ['status', 'reservation_date', 'book']
    search_fields = ['user__username', 'book__title']
    list_editable = ['status']
    readonly_fields = ['reservation_date']
    date_hierarchy = 'reservation_date'