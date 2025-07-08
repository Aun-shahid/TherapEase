from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_templated_email(subject, template_name, context, recipient_list, from_email=None):
    """
    Send an HTML email using a Django template with a plain text fallback.
    """
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL
        
    html_content = render_to_string(f'emails/{template_name}.html', context)
    text_content = strip_tags(html_content)
    
    email = EmailMultiAlternatives(
        subject,
        text_content,
        from_email,
        recipient_list
    )
    email.attach_alternative(html_content, "text/html")
    return email.send()