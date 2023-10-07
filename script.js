document.addEventListener('DOMContentLoaded', () => {
    const listaPeliculas = document.getElementById('lista-peliculas');
    const listaPersonajes = document.getElementById('lista-personajes');
    const detallesPersonaje = document.getElementById('detalles-personaje');

  
    fetch('https://swapi.dev/api/films/')
        .then(response => response.json())
        .then(data => {
            data.results.forEach(pelicula => {
                
                const peliculaElemento = document.createElement('div');
                peliculaElemento.classList.add('pelicula');
                peliculaElemento.innerHTML = `
                    <h3>${pelicula.title}</h3>
                    <p>Episodio: ${pelicula.episode_id}</p>
                    <p>Director: ${pelicula.director}</p>
                    <p>${pelicula.opening_crawl}</p>
                `;
                listaPeliculas.appendChild(peliculaElemento);

                
                pelicula.characters.forEach(urlPersonaje => {
                    fetch(urlPersonaje)
                        .then(response => response.json())
                        .then(personaje => {
                           
                            const personajeElemento = document.createElement('div');
                            personajeElemento.classList.add('personaje');
                            personajeElemento.innerHTML = `
                                <img src="imagenes/${personaje.name.toLowerCase().replace(' ', '-')}.jpg" alt="${personaje.name}">
                                <p>${personaje.name}</p>
                            `;
  
                            listaPersonajes.appendChild(personajeElemento);

                            personajeElemento.addEventListener('click', () => {
                                mostrarDetallesPersonaje(personaje);
                            });
                        });
                });
            });
        });

    function mostrarDetallesPersonaje(personaje) {
        document.getElementById('nombre-personaje').textContent = personaje.name;
        document.getElementById('nacimiento-personaje').textContent = personaje.birth_year;
        document.getElementById('genero-personaje').textContent = personaje.gender;
        document.getElementById('altura-personaje').textContent = personaje.height;
        document.getElementById('imagen-personaje').src = `imagenes/${personaje.name.toLowerCase().replace(' ', '-')}.jpg`;

        
        detallesPersonaje.style.display = 'block';
        detallesPersonaje.style.width='300';
        detallesPersonaje.style.color='white';
        detallesPersonaje.style.maxHeight='auto'

        detallesPersonaje.style.fontSize='15px';
        detallesPersonaje.style.margin='auto';
        detallesPersonaje.style.alignItems='center';
        detallesPersonaje.style.justifyContent='center';
        detallesPersonaje.style.marginRight='45px';
     

        const mediumBp = matchMedia('min-width: 600px');
        const changeSize = mql =>{
            mql.matches
            ?   (document.body.style.detallesPersonaje.img.maxWidth="27%")
            :   (detallesPersonaje.style.maxWidth="60%");
        }
        mediumBp.addListener(changeSize);//escuchar cambios de tamaño del dispositivo
        changeSize(mediumBp); //inicializar el cambio visual
        
        

    }

    document.addEventListener('DOMContentLoaded', () => {
       
    
        let personajes = document.getElementsByClassName('personaje');
    
        function mostrarDetallesPersonaje(personaje) {
          
    
            detallesPersonaje.style.display = 'block';
    
           
            for (let i = 0; i < personajes.length; i++) {
                personajes[i].classList.remove('seleccionado');
            }
    
          
            let nombrePersonaje = personaje.name.toLowerCase().replace(/ /g, '_');
            document.getElementById(nombrePersonaje).classList.add('seleccionado');
        }
    });
    
});
