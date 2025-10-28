import json
import os
import urllib.request
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send Telegram notifications for orders and test messages
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': 'Telegram bot token or chat ID not configured'
            }),
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        message = "🧪 <b>Тестовое сообщение</b>\n\nБот успешно подключен и работает!"
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        message_type = body_data.get('type', 'order')
        
        if message_type == 'order':
            order_data = body_data.get('order', {})
            order_id = order_data.get('id')
            name = order_data.get('name')
            phone = order_data.get('phone')
            email = order_data.get('email', '')
            telegram = order_data.get('telegram', '')
            address = order_data.get('address', '')
            items = order_data.get('items', [])
            total = order_data.get('total', 0)
            
            items_text = '\n'.join([
                f"  • {item['name']}{' - ' + item.get('size', '') if item.get('size') else ''} (x{item['quantity']}) - {item['price']}₽"
                for item in items
            ])
            
            telegram_text = f"\n💬 <b>Telegram:</b> @{telegram}" if telegram else ""
            
            message = f"""<b>🛍️ Новый заказ #{order_id}</b>

👤 <b>Клиент:</b> {name}
📱 <b>Телефон:</b> {phone}
📧 <b>Email:</b> {email}{telegram_text}
📍 <b>Адрес:</b> {address}

<b>Товары:</b>
{items_text}

💰 <b>Итого:</b> {total}₽"""
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': False, 'error': 'Unknown message type'}),
                'isBase64Encoded': False
            }
    else:
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
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
        response = urllib.request.urlopen(req)
        response_data = json.loads(response.read().decode('utf-8'))
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Telegram notification sent successfully'
            }),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            }),
            'isBase64Encoded': False
        }
