from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterUser.as_view(), name='register'),
    path('login/', views.LoginUser.as_view(), name='login'), 
    path('users/<int:id>/', views.FetchParticularUser.as_view(), name='user-profile'),
    path('users/', views.UserGenericAPIView.as_view(), name='user-list-create'),
    path('posts/', views.BlogAPIView.as_view(), name='blog'), 
    path('posts/dashboard/', views.privateBlogAPIView.as_view(), name='private-blog'),
    path('posts/<int:id>/', views.BlogDetailAPIView.as_view(), name='blog-detail'),
    path('posts/<int:id>/delete/', views.BlogDeleteAPIView.as_view(), name='blog-update-delete'),
    path('logout/', views.LogoutUser.as_view(), name='logout'),
    path('posts/<int:id>/comments/', views.CommentListCreateAPIView.as_view(), name='comment-list-create')
]
