import json
import os
import uuid
import base64
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create payment in YuKassa and return payment URL
    Args: event - dict with httpMethod, body
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with payment confirmation URL
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
    order_id = body_data.get('order_id')
    amount = body_data.get('amount')
    description = body_data.get('description', 'Оплата заказа')
    
    if not all([order_id, amount]):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing order_id or amount'}),
            'isBase64Encoded': False
        }
    
    shop_id = os.environ.get('YUKASSA_SHOP_ID')
    secret_key = os.environ.get('YUKASSA_SECRET_KEY')
    
    if not shop_id or not secret_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'YuKassa credentials not configured'}),
            'isBase64Encoded': False
        }
    
    idempotence_key = str(uuid.uuid4())
    auth_string = f"{shop_id}:{secret_key}"
    auth_bytes = auth_string.encode('utf-8')
    auth_b64 = base64.b64encode(auth_bytes).decode('utf-8')
    
    payload = {
        'amount': {
            'value': f"{amount:.2f}",
            'currency': 'RUB'
        },
        'confirmation': {
            'type': 'redirect',
            'return_url': f"https://{event.get('headers', {}).get('host', '')}/order-success?order_id={order_id}"
        },
        'capture': True,
        'description': f"{description} #{order_id}",
        'metadata': {
            'order_id': str(order_id)
        }
    }
    
    headers = {
        'Authorization': f'Basic {auth_b64}',
        'Idempotence-Key': idempotence_key,
        'Content-Type': 'application/json'
    }
    
    response = requests.post(
        'https://api.yookassa.ru/v3/payments',
        headers=headers,
        json=payload,
        timeout=10
    )
    
    if response.status_code != 200:
        return {
            'statusCode': response.status_code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Payment creation failed',
                'details': response.text
            }),
            'isBase64Encoded': False
        }
    
    payment_data = response.json()
    confirmation_url = payment_data.get('confirmation', {}).get('confirmation_url', '')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'payment_id': payment_data.get('id'),
            'confirmation_url': confirmation_url,
            'status': payment_data.get('status')
        }),
        'isBase64Encoded': False
    }
