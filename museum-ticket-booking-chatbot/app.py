from flask import Flask, render_template, url_for, request, jsonify
from pymongo import MongoClient
import stripe

app = Flask(__name__)

# Stripe payment gateway configuration
stripe_keys = {
    'secret_key': 'sk_test_51PsJVOIFxkcFjPWDnyItUg3QwTSwQaOhzKEJnwIs9FDfkJUIrADwGlgZJqzYDVvLooMth442kvCXerNVfa908M5N00qu43iMBd',
    'publishable_key': 'pk_test_51PsJVOIFxkcFjPWDRUntOJtZ6H0xGVU5zUcu4uIuhIeEXPScgQip63fMFhrCUICbbtFngQa2xHUBxs0GZF2a5v7i00B0Vjz7gU'
}

stripe.api_key = stripe_keys['secret_key']

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['museum_chatbot']
collection = db['booking_details']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pay', methods=['POST'])
def pay():
    data = request.json
    adults = data.get('adults', 0)
    children = data.get('children', 0)
    gallery = data.get('gallery', 'Not selected')
    total_price = adults * 50 + children * 10
    
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'inr',
                    'product_data': {
                        'name': 'Museum Ticket',
                    },
                    'unit_amount': total_price * 100,  # Convert to the smallest currency unit (e.g., cents)
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=url_for('success', _external=True),
            cancel_url=url_for('cancel', _external=True),
        )
        # Store booking details
        booking_details = {
            'date': data.get('date'),
            'time': data.get('time'),
            'adults': adults,
            'children': children,
            'gallery': gallery,
            'total_price': total_price
        }
        # Assuming you have MongoDB setup with a collection 'booking_details'
        collection.insert_one(booking_details)

        return jsonify({'sessionUrl': session.url})
    except Exception as e:
        print(f"Error creating Stripe session: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/success')
def success():
    return "Payment successful! Your booking has been confirmed."

@app.route('/cancel')
def cancel():
    return "Payment canceled. Please try again."

if __name__ == '__main__':
    app.run(debug=True)
