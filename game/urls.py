from django.urls import path
from .views import Index, Room,Test

urlpatterns = [
	path('index', Index.as_view(), name='index'),
	path('<str:game_name>/', Room.as_view(), name='room'),
	path('',Test.as_view(),name='test')
]