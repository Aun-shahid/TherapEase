from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken as JWTRefreshToken
from .models import RefreshToken
import uuid

class TokenManager:
    @staticmethod
    def create_tokens(user, request=None):
        """
        create access and refresh tokens and store refresh tokens in db
        """

        # here we gen jwt tokens

        jwt_refresh = JWTRefreshToken.for_user(user)
        access_token = str(jwt_refresh.access_token)
        refresh_token = str(jwt_refresh)


        # store the ref token in db
        device_info = None
        ip_address = None

        if request:
            device_info = request.META.get('HTTP_USER_AGENT', None)
            ip_address = request.META.get('REMOTE_ADDR', None)

        from django.conf import settings
        expires_at = timezone.now() + settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']


        # create the ref token record

        RefreshToken.objects.create(
            user=user,
            token=refresh_token,
            expires_at=expires_at,
            device_info=device_info,
            ip_address=ip_address
        )

        return{
            'access': access_token,
            'refresh': refresh_token,
            'expires_at': expires_at
        }  


    @staticmethod
    def blacklist_refresh_token(token):
        """
        Blacklist a refresh token
        """
        try:
            refresh_token = RefreshToken.objects.get(token=token)
            refresh_token.is_blacklisted = True
            refresh_token.save()
            return True
        except RefreshToken.DoesNotExist:
            return False


    @staticmethod
    def is_token_valid(token):
            """
            check validity of the refresh token
            """ 

            try:
                refresh_token = RefreshToken.objects.get(token=token)
                if refresh_token.is_blacklisted:
                    return False
                if refresh_token.expires_at < timezone.now():
                    return False

                return True
            except RefreshToken.DoesNotExist:
                return False


    @staticmethod
    def refresh_token(old_token, request=None):
        """
        Refresh a token and update the db entries dawg
        """
                

        try:
            token_entry = RefreshToken.objects.get(token=token)

            if token_entry.is_blacklisted:
                raise Exception("Token is blacklisted")
                    
            if token_entry.expires_at < timezone.now():
                raise Exception("Token has expired")
                    
            # now we blacklist the old token
            token_entry.is_blacklisted = True
            token_entry.save()



            # make new tokens for the user
            user = token_entry.user
            jwt_refresh = JWTRefreshToken.for_user(user)
            access_token = str(new_jwt_refresh.access_token)
            refresh_token = str(jwt_refresh)    

            # set expiry
            from django.conf import settings
            expires_at = timezone.now() + settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']


            # Create new token record
            device_info = token_entry.device_info
            ip_address = token_entry.ip_address
                    
            if request:
                device_info = request.META.get('HTTP_USER_AGENT', '')
                ip_address = request.META.get('REMOTE_ADDR')
                    
            RefreshToken.objects.create(
                    user=user,
                    token=refresh_token,
                    expires_at=expires_at,
                    device_info=device_info,
                    ip_address=ip_address
            )
            
            return {
                        'access': access_token,
                        'refresh': refresh_token
                    }
                    
        except RefreshToken.DoesNotExist:
            raise Exception("Token not found")