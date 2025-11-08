from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book, BookReservation
from .serializers import BookSerializer, BookReservationSerializer

class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return Book.objects.all()
        return Book.objects.filter(is_published=True)
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reserve(self, request, pk=None):
        book = self.get_object()
        if book.available > 0:
            # Проверяем нет ли активной брони
            existing_reservation = BookReservation.objects.filter(
                user=request.user, 
                book=book,
                status__in=['pending', 'approved']
            ).exists()
            
            if not existing_reservation:
                reservation = BookReservation.objects.create(
                    user=request.user,
                    book=book
                )
                book.available -= 1
                book.save()
                serializer = BookReservationSerializer(reservation)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(
                {'error': 'У вас уже есть активная бронь на эту книгу'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {'error': 'Книга недоступна для бронирования'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

class BookReservationViewSet(viewsets.ModelViewSet):
    serializer_class = BookReservationSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.role == 'admin':
                return BookReservation.objects.all()
            return BookReservation.objects.filter(user=self.request.user)
        return BookReservation.objects.none()
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]