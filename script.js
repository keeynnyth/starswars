document.addEventListener('DOMContentLoaded', () => {
    const listaPeliculas = document.getElementById('lista-peliculas');
    const listaPersonajes = document.getElementById('lista-personajes');
    const detallesPersonaje = document.getElementById('detalles-personaje');
    const toggleThemeButton = document.getElementById('toggle-theme');

    // Funcionalidad para cambiar el tema
    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleThemeButton.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Oscuro';
    });

    // Obtener la lista de películas desde el API
    fetch('https://swapi.dev/api/films/')
        .then(response => response.json())
        .then(data => {
            data.results.forEach(pelicula => {
                // Mostrar título de la película
                const peliculaElemento = document.createElement('div');
                peliculaElemento.classList.add('pelicula');
                peliculaElemento.innerHTML = `
                    <h3>${pelicula.title}</h3>
                    <div class="pelicula-detalles" style="display: none;">
                        <p>Episodio: ${pelicula.episode_id}</p>
                        <p>Director: ${pelicula.director}</p>
                        <p>${pelicula.opening_crawl}</p>
                        <button class="btn-cargar-personajes" data-personajes='${JSON.stringify(pelicula.characters)}'>Cargar Personajes</button>
                    </div>
                `;
                listaPeliculas.appendChild(peliculaElemento);

                // Añadir evento para mostrar/ocultar detalles de la película
                peliculaElemento.querySelector('h3').addEventListener('click', () => {
                    // Ocultar detalles de la película previamente seleccionada y sus personajes
                    const peliculaSeleccionadaAnterior = document.querySelector('.pelicula-seleccionada');
                    if (peliculaSeleccionadaAnterior && peliculaSeleccionadaAnterior !== peliculaElemento) {
                        peliculaSeleccionadaAnterior.classList.remove('pelicula-seleccionada');
                        peliculaSeleccionadaAnterior.querySelector('.pelicula-detalles').style.display = 'none';
                        listaPersonajes.innerHTML = ''; // Limpiar personajes de la película anterior
                    }
                    // Alternar los detalles de la película actual
                    const detallesElemento = peliculaElemento.querySelector('.pelicula-detalles');
                    if (peliculaElemento.classList.toggle('pelicula-seleccionada')) {
                        detallesElemento.style.display = 'block';
                    } else {
                        detallesElemento.style.display = 'none';
                        listaPersonajes.innerHTML = ''; // Limpiar personajes si se colapsa la misma película
                    }
                });

                // Añadir evento al botón para cargar personajes
                const botonCargarPersonajes = peliculaElemento.querySelector('.btn-cargar-personajes');
                botonCargarPersonajes.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevenir que se alternen los detalles de la película
                    listaPersonajes.innerHTML = ''; // Limpiar personajes anteriores
                    const personajesUrls = JSON.parse(botonCargarPersonajes.getAttribute('data-personajes'));
                    personajesUrls.forEach(urlPersonaje => {
                        fetch(urlPersonaje)
                            .then(response => response.json())
                            .then(personaje => {
                                displayPersonaje(personaje);
                            });
                    });
                });
            });
        });

    // Función para mostrar un personaje
    function displayPersonaje(personaje) {
        const personajeElemento = document.createElement('div');
        personajeElemento.classList.add('personaje');
        const personajeId = personaje.name.toLowerCase().replace(/ /g, '_').replace(/-([^-]+)$/, '_$1');
        personajeElemento.id = personajeId;
        personajeElemento.innerHTML = `
            <img src="https://starwars-visualguide.com/assets/img/characters/${getIdFromUrl(personaje.url)}.jpg" alt="${personaje.name}">
            <p>${personaje.name}</p>
        `;
        listaPersonajes.appendChild(personajeElemento);

        // Añadir evento de clic al personaje
        personajeElemento.addEventListener('click', () => {
            mostrarDetallesPersonaje(personaje);
        });
    }

    // Función para mostrar los detalles del personaje seleccionado
    function mostrarDetallesPersonaje(personaje) {
        document.getElementById('nombre-personaje').textContent = personaje.name;
        document.getElementById('nacimiento-personaje').textContent = personaje.birth_year;
        document.getElementById('genero-personaje').textContent = personaje.gender;
        document.getElementById('altura-personaje').textContent = personaje.height;
        const personajeId = personaje.name.toLowerCase().replace(/ /g, '_').replace(/-([^-]+)$/, '_$1');
        document.getElementById('imagen-personaje').src = `https://starwars-visualguide.com/assets/img/characters/${getIdFromUrl(personaje.url)}.jpg`;

        detallesPersonaje.style.display = 'block';

        // Quitar la clase "seleccionado" de todos los personajes
        let personajes = document.getElementsByClassName('personaje');
        for (let i = 0; i < personajes.length; i++) {
            personajes[i].classList.remove('seleccionado');
        }

        // Añadir la clase "seleccionado" al personaje seleccionado
        document.getElementById(personajeId).classList.add('seleccionado');
    }

    // Función para obtener el ID del personaje desde la URL
    function getIdFromUrl(url) {
        const parts = url.split('/');
        return parts[parts.length - 2];
    }
});
