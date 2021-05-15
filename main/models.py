from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
from django.db.models.signals import post_save


class User(AbstractUser):
    username = models.CharField(max_length=50, blank=True, null=True, unique=True)
    email = models.EmailField(max_length=200, unique=True)
    verified= models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    pass

    def __str__(self):
        return "{}".format(self.email)

    @classmethod
    def post_create(cls, sender, instance, created, *args, **kwargs):
        if not created:
            return
        profile = Profile.objects.create(user=instance)


post_save.connect(User.post_create, sender=User)

class Profile(models.Model):
    name = models.CharField(max_length=50, blank=True, default="", null=False)
    user = models.OneToOneField(User, null=False, on_delete=models.CASCADE)
