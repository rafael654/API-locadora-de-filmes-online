const container = document.querySelector(".movie-container");
const allMovies = document.querySelector(".movies");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const btnClose = document.querySelector(".modal__close");

const inputSearch = document.querySelector(".input");
const modal = document.querySelector('.modal');

const btnTema = document.querySelector('.btn-theme');
const containerHtml = document.querySelector('.container');
const subtitle = document.querySelector('.subtitle');


let bancoDeDados = [];

const exibirPagina = async () => {

    const response = await fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false")

    const { results } = await response.json();

    bancoDeDados = results;

    criarElementos();

    adicionarDados(bancoDeDados);

    btnNext.addEventListener('click', () => {

        const movies = document.querySelectorAll('.movie');
        const titulo = movies[4].querySelector('.movie__title').textContent;
        const index = bancoDeDados.findIndex(movie => movie.title === titulo);

        if (index === bancoDeDados.length - 1) {
            movies.forEach((movie, index) => {

                const titulo = movie.querySelector('.movie__title');
                const nota = movie.querySelector('.movie__rating');

                movie.style.backgroundImage = `url(${bancoDeDados[index].poster_path})`;
                titulo.textContent = bancoDeDados[index].title;
                nota.textContent = bancoDeDados[index].vote_average;
                movie.dataset.id = bancoDeDados[index].id;

            });

        } else {
            let incrementa = 1;
            movies.forEach(movie => {

                const titulo = movie.querySelector('.movie__title');
                const nota = movie.querySelector('.movie__rating');

                movie.style.backgroundImage = `url(${bancoDeDados[index + incrementa].poster_path})`;
                titulo.textContent = bancoDeDados[index + incrementa].title;
                nota.textContent = bancoDeDados[index + incrementa].vote_average;
                movie.dataset.id = bancoDeDados[index + incrementa].id;

                incrementa++
            });
        }

    });
    btnPrev.addEventListener('click', () => {

        const movies = document.querySelectorAll('.movie');

        const titulo = movies[0].querySelector('.movie__title').textContent;

        const index = bancoDeDados.findIndex(movie => movie.title === titulo);

        let posicaoFinal = 5;
        if (index === 0) {

            movies.forEach((movie) => {

                const titulo = movie.querySelector('.movie__title');
                const nota = movie.querySelector('.movie__rating');

                movie.style.backgroundImage = `url(${bancoDeDados[bancoDeDados.length - posicaoFinal].poster_path})`;
                titulo.textContent = bancoDeDados[bancoDeDados.length - posicaoFinal].title;
                nota.textContent = bancoDeDados[bancoDeDados.length - posicaoFinal].vote_average;
                movie.dataset.id = bancoDeDados[bancoDeDados.length - posicaoFinal].id;

                posicaoFinal--
            });
        } else {
            let posicaoFinal = 5;
            movies.forEach(movie => {

                const titulo = movie.querySelector('.movie__title');
                const nota = movie.querySelector('.movie__rating');

                movie.style.backgroundImage = `url(${bancoDeDados[index - posicaoFinal].poster_path})`;
                titulo.textContent = bancoDeDados[index - posicaoFinal].title;
                nota.textContent = bancoDeDados[index - posicaoFinal].vote_average;
                movie.dataset.id = bancoDeDados[index - posicaoFinal].id;

                posicaoFinal--
            });
        }
    });
}
exibirPagina();

const exibirFilmeDestaque = async () => {

    const destaqueDiv = document.querySelector('.highlight');

    const response = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR')

    const results = await response.json();

    let genero = '';

    const videoDestaque = destaqueDiv.querySelector('.highlight__video');
    const tituloDestaque = destaqueDiv.querySelector('.highlight__title');
    const notaDestaque = destaqueDiv.querySelector('.highlight__rating');
    const dataLancamento = destaqueDiv.querySelector('.highlight__launch');
    const generoDestaque = destaqueDiv.querySelector('.highlight__genres');
    const descricaoDestaque = destaqueDiv.querySelector('.highlight__description');

    const { backdrop_path, title, vote_average, genres, release_date, overview } = results;

    videoDestaque.style.backgroundImage = `url(${backdrop_path})`;
    tituloDestaque.textContent = title;
    notaDestaque.textContent = vote_average;
    dataLancamento.textContent = release_date;
    generoDestaque.textContent = genres.map((item) => genero + " " + item.name)
    descricaoDestaque.textContent = overview;

}
exibirFilmeDestaque();

const getVideoDestaque = async () => {

    const response = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
    const results = await response.json();

    let urlVideo = results.results[0].key

    const link = document.querySelector('.highlight__video-link');

    link.href = "https://www.youtube.com/watch?v=" + urlVideo
}
getVideoDestaque();

const buscarFilme = async () => {

    inputSearch.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        if (inputSearch.value === '') {
            fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false").then(response => {

                const promisseResponse = response.json();

                promisseResponse.then(body => {

                    bancoDeDados = []
                    bancoDeDados = body.results;
                    adicionarDados(bancoDeDados);

                })
            })
        } else {
            fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${inputSearch.value}`).then(response => {

                const promisseResponse = response.json();

                promisseResponse.then(body => {
                    bancoDeDados = []
                    bancoDeDados = body.results;
                    adicionarDados(bancoDeDados);
                    inputSearch.value = '';
                });
            });
        }

    })
}
buscarFilme();

const adicionarDados = (bancoDeDados) => {

    const movieDiv = document.querySelectorAll('.movie');
    const movieTitulo = document.querySelectorAll('.movie__title');
    const movieNota = document.querySelectorAll('.movie__rating');

    for (let i = 0; i < 5; i++) {
        movieDiv[i].style.backgroundImage = `url(${bancoDeDados[i].poster_path})`;
        movieTitulo[i].textContent = bancoDeDados[i].title;
        movieNota[i].textContent = bancoDeDados[i].vote_average;
        movieDiv[i].dataset.id = bancoDeDados[i].id;
    }

    async function abrirModal(dataID) {
        modal.style.display = 'flex';
        try {
            const response = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${dataID.dataset.id}?language=pt-BR`)
            const results = await response.json();


            const modalTitulo = document.querySelector('.modal__title');
            const modalImagem = document.querySelector('.modal__img');
            const modalDescricao = document.querySelector('.modal__description');
            const modalNota = document.querySelector('.modal__average');
            const modalGenres = document.querySelector('.modal__genres');

            const { backdrop_path, title, vote_average, overview, genres } = results;

            modalTitulo.textContent = title;
            modalImagem.src = backdrop_path;
            modalDescricao.textContent = overview;
            modalNota.textContent = vote_average;
            modalGenres.textContent = '';

            genres.forEach((genre) => {
                const modalGenre = document.createElement('span');
                modalGenre.textContent = genre.name;
                modalGenre.classList.add('modal__genre');
                modalGenres.append(modalGenre);

            });

        } catch (erro) {
            console.log(erro.message)
        }

    }

    movieDiv.forEach((imagem) => {
        imagem.addEventListener('click', (event) => {
            abrirModal(event.target);
        });
    });

    btnClose.addEventListener('click', () => {
        modal.style.display = 'none'
    })

}
const criarElementos = () => {
    for (let i = 0; i < 5; i++) {

        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        movieDiv.setAttribute('data', 'id');

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie__info');

        const movieTitulo = document.createElement('span');
        movieTitulo.classList.add('movie__title');

        const estrela = document.createElement('img');
        estrela.src = "./assets/estrela.svg";

        const movieNota = document.createElement('span');
        movieNota.classList.add('movie__rating');

        movieInfo.append(movieTitulo, movieNota, estrela);
        movieDiv.append(movieInfo);
        allMovies.append(movieDiv);
    }
}
const trocarTema = () => {
    btnTema.addEventListener('click', () => {

        if (btnTema.src.includes("dark")) {

            btnTema.src = "./assets/light-mode.svg"

            containerHtml.style.setProperty('background-color', '#E5E5E5');

            inputSearch.style.setProperty('background-color', '#E5E5E5');

            inputSearch.style.setProperty('color', '#000')

            subtitle.style.setProperty('--color', '#000');

            btnPrev.src = "./assets/seta-esquerda-preta.svg";

            btnNext.src = "./assets/seta-direita-preta.svg";

        } else {
            btnTema.src = "./assets/dark-mode.svg"

            containerHtml.style.setProperty('background-color', '#141414');

            inputSearch.style.setProperty('background-color', '#141414');

            inputSearch.style.setProperty('color', '#fff')

            subtitle.style.setProperty('--color', '#E5E5E5');

            btnPrev.src = "./assets/seta-esquerda-branca.svg";

            btnNext.src = "./assets/seta-direita-branca.svg";
        }
    });
}

trocarTema();
