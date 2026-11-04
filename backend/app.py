import os
from flask import Flask, request, jsonify
from supabase import create_client, Client
from postgrest import APIError
from dotenv import load_dotenv

# Load .env relative to this file
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

app = Flask(__name__)
app.url_map.strict_slashes = False

supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_PUBLISHABLE_KEY")
)

# Default seed UUIDs for testing convenience
DEFAULT_TEST_STUDENT_ID = "22222222-2222-2222-2222-222222222222"
DEFAULT_ORGANIZER_ID = "11111111-1111-1111-1111-111111111111"

print('Supabase connected')


# -----------------------------------------------------------------------------
# CORS Support
# -----------------------------------------------------------------------------
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, x-user-id"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, x-user-id"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response


# -----------------------------------------------------------------------------
# Root & API Info Endpoint
# -----------------------------------------------------------------------------
@app.route('/')
@app.route('/api')
def api_index():
    return jsonify({
        "status": "online",
        "message": "CampusConnect Event API is running",
        "endpoints": [
            {"method": "GET", "path": "/api/events", "description": "Browse events (supports ?search=)"},
            {"method": "GET", "path": "/api/events/<id>", "description": "Event details with capacity info"},
            {"method": "POST", "path": "/api/registrations", "description": "Create registration (201 Created or 409 Conflict)"},
            {"method": "GET", "path": "/api/me/registrations", "description": "Current user's registrations (header x-user-id)"},
            {"method": "GET", "path": "/api/events/<id>/registrations", "description": "Attendee list (owning organizer only)"}
        ]
    }), 200


# -----------------------------------------------------------------------------
# 1. GET /api/events - Browse events
# -----------------------------------------------------------------------------
@app.route('/api/events', methods=['GET'])
@app.route('/events', methods=['GET'])
def list_events():
    try:
        search = request.args.get('search')
        query = supabase.table('events').select('id, organizer_id, title, capacity, status')
        
        if search:
            query = query.ilike('title', f'%{search}%')
            
        response = query.execute()
        return jsonify(response.data), 200
    except APIError as error:
        return jsonify({"detail": error.message, "error": error.message}), 500
    except Exception as error:
        return jsonify({"detail": str(error), "error": str(error)}), 500


# -----------------------------------------------------------------------------
# 2. GET /api/events/<id> - Event details
# -----------------------------------------------------------------------------
@app.route('/api/events/<event_id>', methods=['GET'])
@app.route('/events/<event_id>', methods=['GET'])
def get_event_details(event_id):
    try:
        event_res = supabase.table('events').select('*').eq('id', event_id).execute()
        if not event_res.data:
            return jsonify({"detail": "Event not found", "error": "Event not found"}), 404

        event = event_res.data[0]

        # Calculate booked count and seats left
        count_res = supabase.table('registrations').select('id', count='exact').eq('event_id', event_id).execute()
        booked_count = count_res.count or 0
        seats_left = max(0, event['capacity'] - booked_count)

        event_details = {
            **event,
            "booked_seats": booked_count,
            "seats_left": seats_left
        }

        return jsonify(event_details), 200
    except APIError as error:
        return jsonify({"detail": error.message, "error": error.message}), 500
    except Exception as error:
        return jsonify({"detail": str(error), "error": str(error)}), 500


# -----------------------------------------------------------------------------
# 3. POST /api/registrations - Create registration, 201 or 409
# -----------------------------------------------------------------------------
@app.route('/api/registrations', methods=['POST'])
@app.route('/registrations', methods=['POST'])
def create_registration():
    try:
        data = request.get_json(silent=True) or {}
        event_id = data.get('event_id')

        # Allow user_id from body or header, fallback to default student
        user_id = data.get('user_id') or request.headers.get('x-user-id') or DEFAULT_TEST_STUDENT_ID

        if not event_id:
            return jsonify({"detail": "Missing event_id", "error": "Missing event_id"}), 400

        # Guard 1: Verify event exists
        event_res = supabase.table('events').select('*').eq('id', event_id).execute()
        if not event_res.data:
            return jsonify({"detail": "Event not found", "error": "Event not found"}), 404

        event = event_res.data[0]

        # Guard 2: Verify event is open
        if event.get('status') != 'open':
            return jsonify({
                "detail": "EVENT_CLOSED",
                "error": "EVENT_CLOSED",
                "message": "Event is closed for registration"
            }), 409

        # Guard 3: Duplicate Check
        existing = supabase.table('registrations') \
            .select('id') \
            .eq('user_id', user_id) \
            .eq('event_id', event_id) \
            .execute()

        if existing.data:
            return jsonify({
                "detail": "DUPLICATE_REGISTRATION",
                "error": "DUPLICATE_REGISTRATION",
                "message": "User is already registered for this event"
            }), 409

        # Guard 4: Capacity Check (Overbooking Protection)
        count_res = supabase.table('registrations') \
            .select('id', count='exact') \
            .eq('event_id', event_id) \
            .execute()

        current_count = count_res.count or 0
        if current_count >= event.get('capacity', 0):
            return jsonify({
                "detail": "EVENT_FULL",
                "error": "EVENT_FULL",
                "message": "Event has reached maximum capacity"
            }), 409

        # Guard 5: Save registration
        insert_res = supabase.table('registrations').insert({
            'user_id': user_id,
            'event_id': event_id
        }).execute()

        if not insert_res.data:
            return jsonify({"detail": "Failed to create registration", "error": "Failed to create registration"}), 500

        new_reg = insert_res.data[0]
        return jsonify({
            "id": new_reg.get("id"),
            "event_id": event_id,
            "user_id": user_id,
            "status": "REGISTERED",
            "created_at": new_reg.get("created_at")
        }), 201

    except APIError as error:
        # Check for PostgreSQL duplicate key error code 23505
        if getattr(error, 'code', None) == '23505':
            return jsonify({
                "detail": "DUPLICATE_REGISTRATION",
                "error": "DUPLICATE_REGISTRATION",
                "message": "User is already registered for this event"
            }), 409
        return jsonify({"detail": error.message, "error": error.message}), 500
    except Exception as error:
        return jsonify({"detail": str(error), "error": str(error)}), 500


# -----------------------------------------------------------------------------
# 4. GET /api/me/registrations - Current user's registrations
# -----------------------------------------------------------------------------
@app.route('/api/me/registrations', methods=['GET'])
@app.route('/me/registrations', methods=['GET'])
def get_my_registrations():
    try:
        user_id = request.headers.get('x-user-id') or request.args.get('user_id') or DEFAULT_TEST_STUDENT_ID

        response = supabase.table('registrations') \
            .select('id, created_at, event_id, events(id, title, capacity, status)') \
            .eq('user_id', user_id) \
            .execute()

        return jsonify(response.data), 200
    except APIError as error:
        return jsonify({"detail": error.message, "error": error.message}), 500
    except Exception as error:
        return jsonify({"detail": str(error), "error": str(error)}), 500


# -----------------------------------------------------------------------------
# 5. GET /api/events/<id>/registrations - Attendee list, owning organizer only
# -----------------------------------------------------------------------------
@app.route('/api/events/<event_id>/registrations', methods=['GET'])
@app.route('/events/<event_id>/registrations', methods=['GET'])
def get_event_attendees(event_id):
    try:
        user_id = request.headers.get('x-user-id') or request.args.get('user_id') or DEFAULT_ORGANIZER_ID

        # Verify event exists and check ownership
        event_res = supabase.table('events').select('organizer_id').eq('id', event_id).execute()
        if not event_res.data:
            return jsonify({"detail": "Event not found", "error": "Event not found"}), 404

        if event_res.data[0]['organizer_id'] != user_id:
            return jsonify({
                "detail": "Forbidden: Only owning organizer can view attendee list",
                "error": "Forbidden: Only owning organizer can view attendee list"
            }), 403

        # Fetch attendee list
        attendees_res = supabase.table('registrations') \
            .select('id, created_at, user_id, users(id, email, role)') \
            .eq('event_id', event_id) \
            .execute()

        return jsonify(attendees_res.data), 200
    except APIError as error:
        return jsonify({"detail": error.message, "error": error.message}), 500
    except Exception as error:
        return jsonify({"detail": str(error), "error": str(error)}), 500


# -----------------------------------------------------------------------------
# 404 Error Handler
# -----------------------------------------------------------------------------
@app.errorhandler(404)
def not_found(e):
    return jsonify({
        "detail": "Endpoint not found",
        "error": "Not Found",
        "available_endpoints": [
            "GET /api/events",
            "GET /api/events/<id>",
            "POST /api/registrations",
            "GET /api/me/registrations",
            "GET /api/events/<id>/registrations"
        ]
    }), 404


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(debug=True, host='0.0.0.0', port=port)
