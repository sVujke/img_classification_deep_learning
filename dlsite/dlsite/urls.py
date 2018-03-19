"""dlsite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from website import views
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.index),
    url(r'^search/$', views.SearchView.as_view(), name='search'),
    url(r'^feedback/$', views.SearchView.as_view(), name='feedback'),

    # internal methods
    url(r'^update_images/$', views.SearchView.as_view(), name='update_images'),
    url(r'^remove_images/$', views.SearchView.as_view(), name='remove_images_from_db'),

    url(r'^remove_queries/$', views.SearchView.as_view(), name='remove_prev_queries_from_db'),

    # url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
