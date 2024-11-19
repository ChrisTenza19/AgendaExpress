const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para analizar JSON
app.use(express.static('public'));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Bienvenido al servicio de Agenda. Usa /contacts para listar contactos o POST a /contacts para agregar uno nuevo.');
  });

// Ruta para listar contactos
app.get('/contacts', async (req, res) => {
    try {
      const response = await axios.get('http://www.raydelto.org/agenda.php');
      const contacts = response.data;
  
      let html = `
            <link rel="stylesheet" href="/style.css">
        <h1>Agenda de Contactos</h1>
        <form method="POST" action="/contacts">
          <label>Nombre: <input type="text" name="nombre" required></label><br>
          <label>Apellido: <input type="text" name="apellido" required></label><br>
          <label>Teléfono: <input type="text" name="telefono" required></label><br>
          <button type="submit">Agregar Contacto</button>
        </form>
        <h2>Listado de Contactos</h2>
        <table border="1" cellpadding="10" cellspacing="0">
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
          </tr>`;
  
      contacts.forEach(contact => {
        html += `
          <tr>
            <td>${contact.nombre}</td>
            <td>${contact.apellido}</td>
            <td>${contact.telefono}</td>
          </tr>`;
      });
  
      html += `</table>`;
      res.send(html);
    } catch (error) {
      res.status(500).send(`<h1>Error al obtener contactos</h1><p>${error.message}</p>`);
    }
  });
  
  app.post('/contacts', express.urlencoded({ extended: true }), async (req, res) => {
    const { nombre, apellido, telefono } = req.body;
  
    if (!nombre || !apellido || !telefono) {
      return res.send('<h1>Error</h1><p>Todos los campos son obligatorios.</p><a href="/contacts">Volver</a>');
    }
  
    try {
      const response = await axios.post('http://www.raydelto.org/agenda.php', { nombre, apellido, telefono });
      res.send(`<h1>Contacto agregado exitosamente</h1><a href="/contacts">Volver a la agenda</a>`);
    } catch (error) {
      res.status(500).send(`<h1>Error al agregar contacto</h1><p>${error.message}</p><a href="/contacts">Volver</a>`);
    }
  });

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});