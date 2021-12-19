from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name='index'),
    path('getData', views.getData, name='getData'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)