# Proyecto vúmetro

Proyecto para generar un vúmetro en función de la entrada de micrófono.
Este proyecto está diseñado originalmente en vanilla javascript, con la idea de capturar el audio a través de una interfaz de sonido via USB.
Se le añadió la posibilidad de capturar los datos desde un dispositivo externo, por lo que se crea un servidor python.

Se han creado 2 versiones:

- Entrada de audio directamente desde la aplicación desde el archivo vumeter.js
- Captura de datos desde un servido en python (./servidor/app.py) y envío desde un websocket hacia la aplicación (websocket_api.js)

Esta segunda versión está preparada para la captura de datos desde un dispositivo externo via USB

Los datos se capturan a tiempo real y se genera una gráfica con los datos para una posterior cisualización. Estos datos se almacenan en el almacenamiento local del navegador.





## Contribuciones:

### Gráfica

- Chartjs (chartjs.org)

### VU Meter

Little HTML canvas VU meter visualisation.

https://tomnomnom.github.io/vumeter/
