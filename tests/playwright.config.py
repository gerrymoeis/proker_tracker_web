from playwright.sync_api import ViewportSize

# Configuración para las pruebas de Playwright
config = {
    # Usar modo no headless para visualizar las pruebas
    "headless": False,
    
    # Configurar el tamaño de la ventana del navegador
    "viewport": ViewportSize(width=1280, height=720),
    
    # Configurar el tiempo de espera para las acciones
    "timeout": 30000,
    
    # Configurar el tiempo de espera para la navegación
    "navigation_timeout": 30000,
    
    # Configurar el directorio para los resultados de las pruebas
    "output_dir": "./test-results",
    
    # Configurar la captura de pantalla
    "screenshot": "only-on-failure",
    
    # Configurar la grabación de video
    "video": "on-first-retry",
    
    # Configurar el número de reintentos
    "retries": 1,
    
    # Configurar el navegador a utilizar
    "browser": "chromium",
    
    # URL base para las pruebas
    "base_url": "http://localhost:3000",
    
    # Ignorar errores de certificados HTTPS
    "ignore_https_errors": True,
}
