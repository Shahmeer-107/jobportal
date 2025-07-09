from rest_framework.permissions import BasePermission

class IsCompanyAndOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.role == 'company' and obj.company == request.user

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'company'