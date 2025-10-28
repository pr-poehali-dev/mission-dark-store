const ANALYTICS_ENDPOINT = 'https://functions.poehali.dev/track-analytics';

export const trackPageView = async () => {
  try {
    await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'page_view',
        event_data: {
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        }
      })
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

export const trackAddToCart = async (productId: string, productName: string) => {
  try {
    await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'add_to_cart',
        event_data: {
          product_id: productId,
          product_name: productName,
          timestamp: new Date().toISOString()
        }
      })
    });
  } catch (error) {
    console.error('Failed to track add to cart:', error);
  }
};
