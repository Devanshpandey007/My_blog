from rest_framework import serializers
from .models import *
from rest_framework.exceptions import ValidationError
import re


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields = ['id','username','email', 'password']
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("A user with this email already exists.")
        return value

    def validate_password(self, value):
        """Ensure the password is strong enough."""
        if len(value) < 8:
            raise ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value): 
            raise ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[0-9]', value):  
            raise ValidationError("Password must contain at least one number.")
        if not re.search(r'[\W_]', value):  
            raise ValidationError("Password must contain at least one special character.")
        return value
    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data.get('username', validated_data['email']) 
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class BlogSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    image = serializers.ImageField(required=False, allow_null=True) 

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'image', 'author', 'created_at', 'updated_at']

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        return value
    

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("Content cannot be empty.")
        return value

    def create(self, validated_data):
        
        blog = Blog.objects.create(
            title=validated_data['title'],
            content=validated_data['content'],
            author = self.context['request'].user,  
            image=validated_data.get('image', None) 
        )
        return blog


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    blog = serializers.PrimaryKeyRelatedField(queryset=Blog.objects.all())  

    class Meta:
        model = Comment
        fields = ['id', 'name', 'body', 'date_posted', 'user_name', 'updated_at', 'blog']  



    