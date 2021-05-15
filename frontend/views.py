from django.http import HttpResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.contrib.auth.forms import AuthenticationForm



def index(request):
    return render(request, 'frontend/index.html', {"form": AuthenticationForm})
