from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, BookReservationViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'reservations', BookReservationViewSet, basename='bookreservation')

urlpatterns = [
    path('', include(router.urls)),
]