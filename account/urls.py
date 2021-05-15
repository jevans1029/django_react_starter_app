from django.urls import path, include, re_path
from django.conf.urls import url

from .views import *
from rest_framework import routers
from django.contrib.auth.views import *

urlpatterns = [

    path("login/", Login.as_view(), name="login"),
    path("signup/", Signup.as_view(), name="signup"),
    path("reset_password/", SendPasswordReset.as_view(), name="reset_password"),
    path(r"reset_password_change/<str:uidb>/<str:token>/", PasswordResetChange.as_view(), name="reset_password_change"),
    path(r"change_password/", ChangePassword.as_view(), name="change_password"),
    # path(r"reset_password_change/", PasswordResetChange.as_view(),
    #      name="reset_password_change"),

    path('password_reset',
         PasswordResetView.as_view(template_name="registration/password_reset.html", success_url="password_reset/done"),
         name='forgotpassword'),
    path("password_reset/done", PasswordResetDoneView.as_view(), name="reset_done"),
    path(r'password_reset/confirm/<str:uidb64>/<str:token>/',
        PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("password_reset/complete", PasswordResetCompleteView.as_view(), name="password_reset_complete"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path('signup/success', SignupSuccess.as_view(), name="signup_success"),

    path(r'activate/<str:uidb64>/<str:token>/',
        activate, name='activate'),

    path("change_password",
         login_required(PasswordChangeView.as_view(success_url="/account/change_password/done",
                                                   template_name="registration/password_change_form.html")),
         name="change_password"),
    path("change_password/done", login_required(PasswordChangeDoneView.as_view()), name="change_password_done"),
]