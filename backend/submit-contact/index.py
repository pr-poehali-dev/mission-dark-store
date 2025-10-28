import json
import os
import psycopg2
import smtplib
import urllib.request
from email.mime.text import MIMEText
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Process contact form messages and save to database
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    name = body_data.get('name')
    email = body_data.get('email')
    message = body_data.get('message')
    
    if not all([name, email, message]):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing required fields'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO contact_messages (name, email, message) VALUES (%s, %s, %s) RETURNING id",
        (name, email, message)
    )
    message_id = cursor.fetchone()[0]
    
    conn.commit()
    cursor.close()
    conn.close()
    
    try:
        recipient_email = os.environ.get('EMAIL_RECIPIENT')
        if recipient_email:
            msg = MIMEText(f"""Новое сообщение от {name}

Email: {email}

Сообщение:
{message}
""", 'plain', 'utf-8')
            msg['Subject'] = f'Новое сообщение от {name}'
            msg['From'] = 'noreply@poehali.dev'
            msg['To'] = recipient_email
            
            server = smtplib.SMTP('localhost')
            server.send_message(msg)
            server.quit()
    except:
        pass
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if bot_token and chat_id:
        telegram_message = f"""<b>💬 Новое сообщение #{message_id}</b>

👤 <b>Имя:</b> {name}
📧 <b>Email:</b> {email}

<b>Сообщение:</b>
{message}"""
        
        try:
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            data = {
                'chat_id': chat_id,
                'text': telegram_message,
                'parse_mode': 'HTML'
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(data).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            urllib.request.urlopen(req)
        except Exception:
            pass
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'message_id': message_id,
            'message': 'Message successfully sent'
        }),
        'isBase64Encoded': False
    }