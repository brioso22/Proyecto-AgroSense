import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import logo from './assets/logo.png'; // Ajusta la ruta si es necesario

const faqs = [
 // --- CUENTA Y PERFIL ---
  {
    pregunta: "¿Cómo creo mi cuenta en AgroSense?",
    respuesta: "Puedes registrarte desde nuestra página web o aplicación. Solo necesitas tu correo electrónico, crear una contraseña y proporcionar algunos datos básicos."
  },

  {
    pregunta: "¿Puedo compartir los datos de mis cultivos con otros agricultores o técnicos?",
    respuesta: "Sí, AgroSense incluye una función para compartir reportes y datos específicos. Puedes generar un enlace o PDF desde la sección 'Reportes' y enviárselo a quien desees."
  },

  // --- FUNCIONALIDAD Y USO ---
  {
    pregunta: "¿Qué pasa si mi conexión a internet falla? ¿Se pierden los datos?",
    respuesta: "No, los sensores AgroSense están diseñados para almacenar datos localmente en caso de pérdida de conexión. Una vez se restablezca el internet, toda la información se sincronizará automáticamente con la plataforma."
  },
  {
    pregunta: "¿Cómo conecto mis sensores a la plataforma por primera vez?",
    respuesta: "Sigue la guía de instalación física incluida con los sensores. Luego, en la aplicación, ve a 'Añadir Dispositivo' y sigue los pasos. El sistema escaneará y emparejará automáticamente los sensores disponibles en tu red."
  },
  {
    pregunta: "¿El sistema puede predecir plagas o solo detectarlas?",
    respuesta: "Gracias a nuestra Inteligencia Artificial, AgroSense no solo detecta anomalías que indican la presencia de plagas, sino que también analiza patrones históricos y condiciones ambientales para predecir el riesgo de futuros brotes, permitiéndote tomar acciones preventivas."
  },
  {
    pregunta: "¿Cómo funciona el riego automático?",
    respuesta: "Puedes activar o desactivar el riego automático desde el Dashboard. El sistema se activará automáticamente cuando los sensores detecten que los niveles de humedad del suelo están por debajo del umbral óptimo que tú defines."
  },
  {
    pregunta: "¿Puedo descargar reportes de mis cultivos?",
    respuesta: "Sí, en la sección 'Reportes' puedes generar y descargar informes detallados en PDF sobre el estado de salud de tus cultivos, uso de recursos y alertas, ideal para llevar un control ordenado."
  },

  // --- FACTURACIÓN Y PLANES ---
  {
    pregunta: "¿Cómo contrato o cambio un plan?",
    respuesta: "Ve a la sección 'Planes' en la aplicación o web. Allí verás los disponibles con sus características y precios. Selecciona el que prefieras y sigue el proceso de contratación. Para cambiar de plan, simplemente contrata uno nuevo; el sistema prorrateará el costo."
  },
  {
    pregunta: "¿Cómo cancelo mi plan?",
    respuesta: "Puedes cancelar tu plan en cualquier momento desde la sección 'Mi Plan' en tu perfil. La cancelación será efectiva al final del ciclo de facturación en curso."
  },

  // --- SOPORTE Y AYUDA ---
  {
    pregunta: "Soy nuevo, ¿hay una guía o tutorial?",
    respuesta: "¡Sí! Para nuevos usuarios, tenemos un tutorial interactivo que se muestra la primera vez que ingresas. También puedes acceder a la 'Guía Rápida' en cualquier momento desde el menú de 'Ayuda' o 'Configuración'."
  },
  {
    pregunta: "¿Cómo puedo hacer el texto más grande para una mejor visualización?",
    respuesta: "Puedes ajustar el tamaño de la fuente desde 'Configuración' > 'Accesibilidad'. Allí encontrarás opciones para personalizar la visualización según tus necesidades."
  },
  {
    pregunta: "¿A quién contacto si tengo un problema técnico?",
    respuesta: "Puedes escribirnos a soporte@agrosense.com o usar el chat en vivo dentro de la aplicación en la sección 'Ayuda y Soporte'. Nuestro equipo te ayudará a resolver cualquier inconveniente."
  }
];

function ChatFAQSupport() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [buscar, setBuscar] = useState("");

  const userPhoto = localStorage.getItem('photo_' + localStorage.getItem('username')) || '/default-avatar.png';

  // Filtrado de preguntas según búsqueda
  const preguntasFiltradas = faqs.filter(faq =>
    faq.pregunta.toLowerCase().includes(buscar.toLowerCase())
  );

  const enviarMensaje = (e) => {
    e.preventDefault();
    const templateParams = { nombre, email, mensaje };

    emailjs
      .send(
        "service_mpp131y",
        "template_bksq9ap",
        templateParams,
        "u9DECTQI7nclvav_G"
      )
      .then(() => {
        setEnviado(true);
        setNombre("");
        setEmail("");
        setMensaje("");
        setTimeout(() => setEnviado(false), 5000);
      })
      .catch((err) => alert("Error al enviar: " + err.text));
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-white bg-white shadow-sm sticky-top py-2 mb-4">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/home">
            <img src={logo} alt="AgroSense Logo" style={{ height: '35px', marginRight: '10px' }} />
            <span className="fw-bold text-success fs-5">AgroSense</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              <li className="nav-item">
                <Link className="nav-link text-success fw-semibold" to="/Plans">Planes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-success fw-semibold" to="/Mapa">Mapa</Link>
              </li>
            </ul>

            <div className="d-flex align-items-center ms-auto">
              <Link to="/Perfil">
                <img
                  src={userPhoto}
                  alt="Usuario"
                  className="rounded-circle border border-2"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container flex-grow-1 py-4">
        {/* Buscador */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8">
            <input
              type="text"
              className="form-control form-control-lg shadow-sm"
              placeholder="Busca tu pregunta..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />
          </div>
        </div>

        {/* Sección principal: FAQs y Formulario */}
        <div className="row g-4">
          {/* FAQs */}
          <div className="col-12 col-lg-6">
            <h3 className="text-success fw-bold mb-3">Preguntas Frecuentes</h3>
            {preguntasFiltradas.length > 0 ? (
              preguntasFiltradas.map((faq, index) => (
                <div key={index} className="card shadow-sm mb-3 border-0">
                  <div className="card-body">
                    <h5 className="card-title text-success fw-semibold">{faq.pregunta}</h5>
                    <p className="card-text text-muted">{faq.respuesta}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-warning" role="alert">
                No encontramos tu pregunta. Puedes enviarla en el formulario de la derecha.
              </div>
            )}
          </div>

          {/* Formulario */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0 bg-gradient-primary" style={{ background: 'linear-gradient(135deg, #007bff, #6610f2)' }}>
              <div className="card-body text-white">
                <h3 className="card-title fw-bold mb-3">¿No encontraste tu respuesta?</h3>
                {enviado && (
                  <div className="alert alert-success" role="alert">
                    ¡Mensaje enviado correctamente! Te responderemos pronto.
                  </div>
                )}
                <form onSubmit={enviarMensaje}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Tu correo"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Escribe tu pregunta..."
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-light w-100 fw-semibold"
                  >
                    Enviar Pregunta
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-3 mt-auto shadow-sm">
        <small className="text-muted fw-semibold">
          © {new Date().getFullYear()} AgroSense | Centro de Ayuda | Desarrollado con ❤️ para agricultores
        </small>
      </footer>
    </div>
  );
}

export default ChatFAQSupport;
