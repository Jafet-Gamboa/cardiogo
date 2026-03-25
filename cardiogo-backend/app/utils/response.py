from flask import jsonify

def group_fields(data):
    grouped = {}
    other = {}
    for key, value in data.items():
        if "__" in key:
            left, right = key.split("__", 1)
            if "_" in right:
                second, rest = right.split("_", 1)
                prefix = f"{left}_{second}"
                field = rest
            else:
                prefix = f"{left}_{right}"
                field = ""
            if field:
                grouped.setdefault(prefix, {})[field] = value
            else:
                grouped.setdefault(prefix, {})[""] = value
        elif "_" in key:
            parts = key.split("_", 1)
            prefix = parts[0]
            field = parts[1]
            grouped.setdefault(prefix, {})[field] = value
        else:
            other[key] = value
    grouped.update(other)
    return grouped

def success_response(data, group=True, status=0):
    if isinstance(data, list):
        if group:
            data = [group_fields(item) if isinstance(item, dict) else item for item in data]
    elif isinstance(data, dict) and group:
        data = group_fields(data)
    return {"data": data, "status": status}

def error_response(message="Ocurrió un error", status=400):
    return jsonify({
        "status": 1,
        "message": message,
        "code": status
    }), status
