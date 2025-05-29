"""
Datos de prueba para las pruebas de autenticación.
"""

# Datos para pruebas de login
LOGIN_TEST_DATA = {
    "valid_credentials": {
        "email": "admin@example.com",
        "password": "password123",
        "expected_result": "success"
    },
    "invalid_password": {
        "email": "admin@example.com",
        "password": "wrong_password",
        "expected_result": "error",
        "expected_error": "Login gagal"
    },
    "invalid_email": {
        "email": "nonexistent@example.com",
        "password": "password123",
        "expected_result": "error",
        "expected_error": "Login gagal"
    },
    "empty_fields": {
        "email": "",
        "password": "",
        "expected_result": "error",
        "expected_error": "Email dan password diperlukan"
    }
}
