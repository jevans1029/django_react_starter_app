import traceback

from django.contrib.auth import login, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.template.loader import render_to_string
from django.utils.encoding import force_text, force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.views import View

from main.serializers import ProfileSerializer
from .forms import SignUpForm
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.core.mail import EmailMessage
from django_react_starter_app import settings
from django.template.loader import render_to_string
from django.contrib.auth.forms import AuthenticationForm
# Create your views here.
from .tokens import EmailVerificationTokenGenerator
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from .serializers import *


class Login(APIView):
    # queryset = get_user_model().objects.all()
    permission_classes = []
    def post(self, request):

        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():


            if serializer.user is not None:
                login(request, serializer.user)
                return Response({"success": "You have logged in",
                                 "profile": ProfileSerializer(serializer.user.profile).data})
        else:
            return Response({"errors": serializer.errors})



# def Login(request):
#     print(request.body)
#     print(request)
#     if request.method != "POST":
#         return HttpResponseRedirect("/login/")
#     form = AuthenticationForm(request.POST)
#     user = authenticate(request, username=username, password=password)
#     if user is not None:
#         login(request, user)
#         return Response({"success": "You have logged in"})
#     else:
#         return Response({"error": ["Invalid Credentials"]})
class SendPasswordReset(APIView):
    permission_classes = []
    token_generator = PasswordResetTokenGenerator()
    def post(self, request):
        serializer = PasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = self.get_user(serializer.data["email"])
            except ObjectDoesNotExist:
                return Response({"errors": {"email": "User not found"}})
            self.send_email(user, request)

            return Response({"success": "Email sent"})
        else:
            return Response({"errors": serializer.errors})

    def get_user(self, email):
        return User.objects.get(email=email)
    def send_email(self, user, request):
        current_site = get_current_site(request)
        print(request.scheme)
        if request.is_secure:
            protocol = "https://"
        else:
            protocol = "http://"
        mail_subject = 'Password Reset'
        message = render_to_string('emails/password_reset.html', {
            'user': user,
            'domain': current_site.domain,
            'uidb': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': self.token_generator.make_token(user),
            'protocol': request.scheme
        })
        to_email = user.email
        email = EmailMessage(
            mail_subject, message, settings.DEFAULT_FROM_EMAIL, to=[to_email]
        )
        email.send()

class PasswordResetChange(APIView):
    permission_classes = []
    def get(self, request, uidb, token):

        if self.validate_link(uidb, token):
            print("valid")
            return Response({"success": "Token is valid"})
        else:
            print("invalid")
            return Response({"error": "Token is invalid"})

    def post(self, request, uidb, token):
        if self.validate_link(uidb, token):
            serializer = PasswordChangeSerializer(data=request.data)
            user = self.token_user
            if serializer.is_valid():
                user.set_password(serializer.data["password"])
                user.save()
                return Response({"success": "Password has been changed."})
        else:
            return Response({"error": "Token is invalid"})
    def validate_link(self, uidb, token):
        serializer = PasswordResetTokenSerializer(data={ "uidb": uidb, "token": token})
        if serializer.is_valid():
            self.token_user = serializer.token_user
            return True
        else:
            return False

def send_verification_email(user, request):
    current_site = get_current_site(request)
    account_activation_token = EmailVerificationTokenGenerator()
    mail_subject = 'Confirm your Email Address'
    message = render_to_string('emails/signup.html', {
        'user': user,
        'domain': current_site.domain,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
    })
    to_email = user.email
    email = EmailMessage(
        mail_subject, message, settings.DEFAULT_FROM_EMAIL, to=[to_email]
    )
    email.send()

@login_required
def verify_email_view(request):
    if request.user.verified:
        return HttpResponseRedirect("/")
    send_verification_email(request.user, request)
    return render(request, "registration/verify_email_view.html")

def generate_verify_email_link(user):
    account_activation_token = EmailVerificationTokenGenerator()
    url = "/activate/{}/{}/".format(urlsafe_base64_encode(force_bytes(user.pk)),
                                       account_activation_token.make_token(user))
    return url

class Signup(APIView):
    permission_classes = []
    def post(self, request):

        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            send_verification_email(user, request)


            return Response({"success": "You have logged in",
                             "profile": ProfileSerializer(user.profile).data})
        else:
            return Response({"errors": serializer.errors})

class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):

        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.data["password"])
            user.save()
            login(request, user)
            return Response({"success": "Your password has been changed",})
        else:
            return Response({"errors": serializer.errors})
def signup(request):
    if request.method == 'POST':


        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = True
            user.save()
            send_verification_email(user, request)

            return HttpResponseRedirect('/account/signup/success')
    else:
        form = SignUpForm()
    return render(request, 'registration/signup.html', {'form': form})


def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        traceback.print_exc()
        user = None
    if user is not None and EmailVerificationTokenGenerator().check_token(user, token):
        user.verified = True
        user.save()
        #login(request, user)
        # return redirect('home')
        return render(request, "registration/email_activation_complete.html")
    else:
        return render(request, "registration/invalid_link.html")



class SignupSuccess(View):

    def get(self, request):
        return render(request, 'registration/signup_success.html')




