export const welcomeEmail = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Gracias por Registrarse</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .header img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 8px;
              }
              .content {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .content h1 {
                  font-size: 24px;
                  color: #333333;
                  margin-bottom: 10px;
              }
              .content p {
                  font-size: 16px;
                  color: #555555;
                  line-height: 1.5;
              }
              .footer {
                  text-align: center;
                  font-size: 14px;
                  color: #999999;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://via.placeholder.com/600x200?text=Gracias+por+Registrarse" alt="Gracias por Registrarse">
              </div>
              <div class="content">
                  <h1>¡Gracias por Registrarse!</h1>
                  <p>Hola,</p>
                  <p>Queremos agradecerte por haberte registrado en nuestra página. Estamos encantados de tenerte con nosotros.</p>
                  <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto.</p>
                  <p>¡Bienvenido a nuestra comunidad!</p>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
              </div>
          </div>
      </body>
      </html>
    `;
