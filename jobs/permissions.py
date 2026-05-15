from rest_framework.permissions import BasePermission, SAFE_METHODS

# ✅ Only Companies can Create/Update/Delete their own jobs
class IsCompanyAndOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated and
            request.user.role == 'company' and
            obj.company == request.user
        )

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user.is_authenticated and
            request.user.role == 'company'
        )




class IsCompanyAndOwnsJobApplication(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "company"

    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated and
            request.user.role == "company" and
            obj.job.company == request.user
        )