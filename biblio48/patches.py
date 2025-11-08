"""
Патчи для совместимости Django 4.2.7 с Python 3.14
"""

def apply_django_patches():
    """Применяет все необходимые патчи для Django"""
    try:
        # Патч для Context.__copy__
        import django.template.context
        
        original_copy = django.template.context.Context.__copy__
        
        def patched_context_copy(self):
            duplicate = self.__class__(dict_=self.dicts[0])
            duplicate.dicts = self.dicts[1:]
            return duplicate
        
        django.template.context.Context.__copy__ = patched_context_copy
        print("✅ Патч для Django Context применен")
        
    except Exception as e:
        print(f"⚠️ Ошибка применения патча: {e}")

# Автоматически применяем патчи при импорте
apply_django_patches()