import json
import os
import psycopg2
import urllib.request
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Process customer orders and save to database
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
    phone = body_data.get('phone')
    email = body_data.get('email', '')
    address = body_data.get('address')
    items = body_data.get('items', [])
    total = body_data.get('total', 0)
    
    if not all([name, phone, address, items]):
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
        "INSERT INTO orders (name, phone, email, address, items, total) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
        (name, phone, email, address, json.dumps(items), total)
    )
    order_id = cursor.fetchone()[0]
    
    conn.commit()
    cursor.close()
    conn.close()
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if bot_token and chat_id:
        items_text = '\n'.join([f"  • {item['name']} - {item['size']} (x{item['quantity']}) - {item['price']}₽" for item in items])
        message = f"""<b>🛍️ Новый заказ #{order_id}</b>

👤 <b>Клиент:</b> {name}
📱 <b>Телефон:</b> {phone}
📧 <b>Email:</b> {email}
📍 <b>Адрес:</b> {address}

<b>Товары:</b>
{items_text}

💰 <b>Итого:</b> {total}₽"""
        
        try:
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            data = {
                'chat_id': chat_id,
                'text': message,
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
            'order_id': order_id,
            'message': 'Order successfully created'
        }),
        'isBase64Encoded': False
    }