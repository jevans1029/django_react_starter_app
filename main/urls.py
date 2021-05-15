from django.urls import path, include, re_path
from .views import *

urlpatterns = [

    path("account/", include("account.urls")),

    # path("join_request", JoinRequestView.as_view(), name="join_requests")
]