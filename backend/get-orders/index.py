import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get all orders from database
    Args: event - dict with httpMethod
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with orders list
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
        "SELECT id, name, phone, email, address, items, total, status, created_at FROM orders ORDER BY created_at DESC"
    )
    
    rows = cursor.fetchall()
    orders = []
    
    for row in rows:
        orders.append({
            'id': row[0],
            'name': row[1],
            'phone': row[2],
            'email': row[3],
            'address': row[4],
            'items': row[5],
            'total': row[6],
            'status': row[7],
            'created_at': row[8].isoformat() if row[8] else None
        })
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'orders': orders}),
        'isBase64Encoded': False
    }
