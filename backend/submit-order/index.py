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
    telegram = body_data.get('telegram', '')
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
        "INSERT INTO orders (name, phone, email, telegram, address, items, total) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
        (name, phone, email, telegram, address, json.dumps(items), total)
    )
    order_id = cursor.fetchone()[0]
    
    conn.commit()
    cursor.close()
    conn.close()
    
    try:
        telegram_url = 'https://functions.poehali.dev/0e6b6337-025c-497b-be1b-06db7d51d141'
        telegram_data = {
            'type': 'order',
            'order': {
                'id': order_id,
                'name': name,
                'phone': phone,
                'email': email,
                'telegram': telegram,
                'address': address,
                'items': items,
                'total': total
            }
        }
        telegram_req = urllib.request.Request(
            telegram_url,
            data=json.dumps(telegram_data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        urllib.request.urlopen(telegram_req)
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