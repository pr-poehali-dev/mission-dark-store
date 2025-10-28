import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get all orders and messages from database
    Args: event - dict with httpMethod
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with orders and messages lists
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT id, name, phone, email, telegram, address, items, total, status, created_at FROM t_p54427834_mission_dark_store.orders ORDER BY created_at DESC"
    )
    
    rows = cursor.fetchall()
    orders = []
    
    for row in rows:
        orders.append({
            'id': row[0],
            'name': row[1],
            'phone': row[2],
            'email': row[3],
            'telegram': row[4],
            'address': row[5],
            'items': row[6],
            'total': row[7],
            'status': row[8],
            'created_at': row[9].isoformat() if row[9] else None
        })
    
    cursor.execute(
        "SELECT id, name, email, message, created_at FROM t_p54427834_mission_dark_store.contact_messages ORDER BY created_at DESC"
    )
    
    rows = cursor.fetchall()
    messages = []
    
    for row in rows:
        messages.append({
            'id': row[0],
            'name': row[1],
            'email': row[2],
            'message': row[3],
            'created_at': row[4].isoformat() if row[4] else None
        })
    
    cursor.execute(
        "SELECT id, name, price, image, images, category, description, sizes, in_stock FROM t_p54427834_mission_dark_store.products ORDER BY created_at DESC"
    )
    
    rows = cursor.fetchall()
    products = []
    
    for row in rows:
        products.append({
            'id': row[0],
            'name': row[1],
            'price': row[2],
            'image': row[3],
            'images': row[4] if row[4] else [],
            'category': row[5],
            'description': row[6],
            'sizes': row[7] if row[7] else [],
            'inStock': row[8]
        })
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'orders': orders, 'messages': messages, 'products': products}),
        'isBase64Encoded': False
    }