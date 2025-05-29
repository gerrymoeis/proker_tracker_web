"""
Utilidades para generar reportes de pruebas automatizadas.
Este módulo proporciona funciones para crear y mostrar reportes de resultados
de las pruebas automatizadas.
"""
import os
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
from playwright.async_api import async_playwright


class TestReporter:
    """
    Clase para generar reportes de pruebas automatizadas.
    """
    
    def __init__(self):
        """
        Inicializa el reporter.
        """
        self.results_dir = os.path.join("test-results", "reports")
        self.results = {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "totalDuration": 0,
            "tests": [],
            "recommendations": []
        }
        
        # Crear directorio para reportes si no existe
        os.makedirs(self.results_dir, exist_ok=True)
    
    def add_test_result(self, 
                        name: str, 
                        status: str, 
                        duration: int, 
                        steps: List[str], 
                        screenshots: List[str] = None, 
                        error: Optional[str] = None):
        """
        Añade un resultado de prueba al reporte.
        
        Args:
            name: Nombre de la prueba
            status: Estado de la prueba ('success', 'failure', 'skipped')
            duration: Duración de la prueba en milisegundos
            steps: Lista de pasos ejecutados
            screenshots: Lista de rutas de capturas de pantalla
            error: Mensaje de error si la prueba falló
        """
        if screenshots is None:
            screenshots = []
        
        self.results["total"] += 1
        
        if status == "success":
            self.results["passed"] += 1
        elif status == "failure":
            self.results["failed"] += 1
            
            # Añadir recomendación si hay un error
            if error:
                self.results["recommendations"].append(
                    f"Revisar la prueba '{name}': {error}"
                )
        elif status == "skipped":
            self.results["skipped"] += 1
        
        self.results["totalDuration"] += duration
        
        self.results["tests"].append({
            "name": name,
            "status": status,
            "duration": duration,
            "steps": steps,
            "screenshots": screenshots,
            "error": error
        })
    
    def save_report(self) -> str:
        """
        Guarda el reporte en formato JSON.
        
        Returns:
            Ruta del archivo de reporte
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"report_{timestamp}.json"
        filepath = os.path.join(self.results_dir, filename)
        
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(self.results, f, indent=2)
        
        return filepath
    
    async def show_report(self):
        """
        Show the report in a browser.
        
        Returns:
            Tuple with the page, browser, and playwright instance
        """
        # Start Playwright
        playwright = await async_playwright().start()
        browser = await playwright.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Create HTML for the report
        report_html = self._generate_report_html()
        
        # Show report in browser
        await page.set_content(report_html)
        
        return page, browser, playwright
    
    def _generate_report_html(self) -> str:
        """
        Genera el HTML para el reporte.
        
        Returns:
            HTML del reporte
        """
        # Formatear fecha
        date_str = datetime.now().strftime("%d %B %Y, %H:%M")
        
        # Generar HTML para los test cases
        test_cases_html = ""
        for test in self.results["tests"]:
            # Determinar clase CSS según estado
            status_class = test["status"]
            
            # Generar HTML para los pasos
            steps_html = ""
            for step in test["steps"]:
                steps_html += f"<li>{step}</li>"
            
            # Generar HTML para las capturas de pantalla
            screenshots_html = ""
            if test["screenshots"]:
                screenshots_html = "<h4>Capturas de pantalla:</h4>"
                for screenshot in test["screenshots"]:
                    screenshots_html += f'<img src="{screenshot}" alt="Captura de pantalla" class="screenshot">'
            
            # Generar HTML para el error
            error_html = ""
            if test["error"]:
                error_html = f'<p><strong>Error:</strong> {test["error"]}</p>'
            
            # Añadir HTML del test case
            test_cases_html += f"""
                <div class="test-case {status_class}">
                    <h3>{test["name"]}</h3>
                    <p><strong>Estado:</strong> {self._get_status_display(test["status"])}</p>
                    <p><strong>Duración:</strong> {test["duration"]}ms</p>
                    {error_html}
                    
                    <h4>Pasos:</h4>
                    <ol class="steps">
                        {steps_html}
                    </ol>
                    
                    {screenshots_html}
                </div>
            """
        
        # Generar HTML para las recomendaciones
        recommendations_html = ""
        if self.results["failed"] > 0 and self.results["recommendations"]:
            recommendations_items = ""
            for rec in self.results["recommendations"]:
                recommendations_items += f"<li>{rec}</li>"
            
            recommendations_html = f"""
                <div class="recommendations">
                    <h2>Recomendaciones</h2>
                    <ul>
                        {recommendations_items}
                    </ul>
                </div>
            """
        
        # Calcular tiempo promedio por prueba
        avg_time = 0
        if self.results["total"] > 0:
            avg_time = round(self.results["totalDuration"] / self.results["total"])
        
        # Generar HTML completo
        return f"""
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reporte de Pruebas - Proker Tracker</title>
                <style>
                    body {{
                        font-family: 'Inter', sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f5f7fa;
                    }}
                    h1, h2, h3 {{
                        color: #0F52BA;
                    }}
                    .summary {{
                        display: flex;
                        gap: 20px;
                        margin-bottom: 30px;
                    }}
                    .summary-card {{
                        background: white;
                        border-radius: 8px;
                        padding: 20px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        flex: 1;
                    }}
                    .summary-card h3 {{
                        margin-top: 0;
                    }}
                    .success {{ color: #10B981; }}
                    .failure {{ color: #EF4444; }}
                    .skipped {{ color: #F59E0B; }}
                    .test-case {{
                        background: white;
                        border-radius: 8px;
                        padding: 20px;
                        margin-bottom: 20px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }}
                    .test-case h3 {{
                        margin-top: 0;
                        display: flex;
                        align-items: center;
                    }}
                    .test-case h3::before {{
                        content: '';
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        margin-right: 10px;
                    }}
                    .test-case.success h3::before {{ background-color: #10B981; }}
                    .test-case.failure h3::before {{ background-color: #EF4444; }}
                    .test-case.skipped h3::before {{ background-color: #F59E0B; }}
                    .steps {{
                        margin-left: 20px;
                    }}
                    .screenshot {{
                        max-width: 100%;
                        height: auto;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        margin-top: 10px;
                    }}
                    .performance {{
                        margin-top: 30px;
                        background: white;
                        border-radius: 8px;
                        padding: 20px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }}
                </style>
            </head>
            <body>
                <h1>Reporte de Pruebas - Proker Tracker</h1>
                <p>Fecha: {date_str}</p>
                
                <div class="summary">
                    <div class="summary-card">
                        <h3>Total de Pruebas</h3>
                        <p style="font-size: 24px; font-weight: bold;">{self.results["total"]}</p>
                    </div>
                    <div class="summary-card">
                        <h3>Exitosas</h3>
                        <p style="font-size: 24px; font-weight: bold;" class="success">{self.results["passed"]}</p>
                    </div>
                    <div class="summary-card">
                        <h3>Fallidas</h3>
                        <p style="font-size: 24px; font-weight: bold;" class="failure">{self.results["failed"]}</p>
                    </div>
                    <div class="summary-card">
                        <h3>Omitidas</h3>
                        <p style="font-size: 24px; font-weight: bold;" class="skipped">{self.results["skipped"]}</p>
                    </div>
                </div>
                
                <h2>Detalle de Pruebas</h2>
                {test_cases_html}
                
                <div class="performance">
                    <h2>Métricas de Rendimiento</h2>
                    <p><strong>Tiempo Total de Ejecución:</strong> {self.results["totalDuration"]}ms</p>
                    <p><strong>Tiempo Promedio por Prueba:</strong> {avg_time}ms</p>
                </div>
                
                {recommendations_html}
            </body>
            </html>
        """
    
    @staticmethod
    def _get_status_display(status: str) -> str:
        """
        Obtiene el texto a mostrar para un estado.
        
        Args:
            status: Estado ('success', 'failure', 'skipped')
        
        Returns:
            Texto a mostrar
        """
        if status == "success":
            return "Exitosa"
        elif status == "failure":
            return "Fallida"
        elif status == "skipped":
            return "Omitida"
        else:
            return status
