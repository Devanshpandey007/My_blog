from django.db import models
from django.contrib.auth.models import AbstractUser
from blog.manager import CustomUserManager
from django.db.models.signals import post_save
from cloudinary.models import CloudinaryField
from django.conf import settings
from django.utils import timezone

class User(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def name(self):
        return self.username

    def __str__(self):
        return self.email


class Blog(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()  
    image = CloudinaryField('image', blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    

class Comment(models.Model):
    name = models.CharField(max_length=100)
    body = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)
    user_name = models.ForeignKey(User, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    



