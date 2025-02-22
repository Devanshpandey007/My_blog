from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login, logout
from .models import *
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serialize import UserSerializer, BlogSerializer, CommentSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, permissions
from django.core.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination


class BlogPagination(PageNumberPagination):
    page_size = 6

class RegisterUser(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  

            refresh = RefreshToken.for_user(user)
            return Response({
                'status': 200,
                'message': 'User registered successfully.',
                'data': serializer.data,
                'refresh_token': str(refresh),
                'access_token': str(refresh.access_token),
            })
        return Response({'status': 400, 'errors': serializer.errors})

class FetchParticularUser(generics.RetrieveAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'




class UserGenericAPIView(generics.ListAPIView, generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]  
    permission_classes = [IsAuthenticated]  
    queryset = User.objects.all()
    serializer_class = UserSerializer
    

class UserGenericAPIView1(generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'



class IsOwnerOrStaff(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.author or request.user.is_staff
    


class BlogAPIView(generics.ListCreateAPIView, generics.CreateAPIView):  
    queryset = Blog.objects.all()  
    serializer_class = BlogSerializer  
    authentication_classes = [JWTAuthentication]  
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  
    pagination_class = BlogPagination  
    def perform_create(self, serializer):  
        serializer.save(author=self.request.user)  

class BlogDeleteAPIView(generics.DestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    lookup_field = 'id'
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]

    def perform_destroy(self, instance):
        instance.delete()

class privateBlogAPIView(generics.ListAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    lookup_field = 'id'
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrStaff]

    def get_queryset(self):
        """Return only the blog if the user is the author or is staff."""
        user = self.request.user
        if user.is_staff:
            return Blog.objects.all() 
        return Blog.objects.filter(author=user)

# class BlogAPIView1(generics.UpdateAPIView, generics.DestroyAPIView):
#     queryset = Blog.objects.all()
#     serializer_class = BlogSerializer
#     lookup_field = 'id'
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAdminUser] 

#     def perform_update(self, serializer):
#         serializer.save(author=self.request.user)

#     def perform_destroy(self, instance):
#         instance.delete()




class BlogDetailAPIView(generics.RetrieveAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    lookup_field = 'id'
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]




class LoginUser(APIView):
    permission_classes = [AllowAny]  

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            role = ''
            if user.is_staff:
                role = 'admin' 
            else:
                role = 'user'  

            return Response({
                "status": 200,
                "message": "Login successful.",
                "access": access_token,
                "refresh": str(refresh),
                "email": user.email,
                "username": user.username,
                "id": user.id,
                "role": role
            })
        else:
            return Response({"status": 401, "error": "Invalid credentials."})



class LogoutUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()  
                return Response({"status": "success", "message": "Logged out successfully"})
            return Response({"status": "error", "message": "No refresh token provided"}, status=400)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=400)



# class CommentListCreateAPIView(generics.ListAPIView, generics.CreateAPIView):
#     queryset = Comment.objects.all()
#     serializer_class = CommentSerializer
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [AllowAny]  

#     def get_permissions(self):
        
#         if self.request.method == 'POST':
#             return [IsAuthenticated()]  
#         return super().get_permissions() 

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user) 

class CommentListCreateAPIView(generics.ListAPIView, generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    def get_permissions(self):
     
        if self.request.method == 'POST':
            return [IsAuthenticated()]  
        return super().get_permissions() 

    def perform_create(self, serializer):
        blog_id = self.kwargs.get('id')
        blog = Blog.objects.get(id=blog_id)
        user = self.request.user  

        serializer.save(blog=blog, user_name=user)

