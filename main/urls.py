from django.urls import path, include, re_path
from .views import *

urlpatterns = [

    path("account/", include("account.urls")),

]