const API_KEY = 'api_key=a5e392e03ce076f6916518aa1a3302c3';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const IMG500_URL = 'https://image.tmdb.org/t/p/w500';
const FILTER = '&language=pt-BR&certification_country=BR&certification.lte=16&with_origin_country=KR|JP|CN|TW&include_null_first_air_dates=false&sort_by=popularity.desc&';

const searchURL = BASE_URL + '/search/multi?' + FILTER + API_KEY;

const HOME_URL = BASE_URL + '/discover/movie?&vote_average.gte=6' + FILTER + API_KEY;

const FILMES_URL = BASE_URL + '/discover/movie?' + FILTER + API_KEY;

const SERIES_URL = BASE_URL + '/discover/tv?' + FILTER + API_KEY;
  
let API_URL = HOME_URL;

const navLinks = document.querySelectorAll('.nav-menu .nav');
let activeLinkId = localStorage.getItem('activeLinkId');

function setActiveLink(link) {
  if (activeLinkId) {
    const prevActiveLink = document.getElementById(activeLinkId);
    if (prevActiveLink) {
      prevActiveLink.classList.remove('nav-active');
    }
  }

  link.classList.add('nav-active');
  activeLinkId = link.id;
  localStorage.setItem('activeLinkId', activeLinkId);
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = e.target.id;

    if (id === 'nav-home') {
      API_URL = HOME_URL;
    } else if (id === 'nav-filmes') {
      API_URL = FILMES_URL;
    } else if (id === 'nav-series') {
      API_URL = SERIES_URL;
    }
    selectedGenre = [];
    highlightSelection();
    getMovies(API_URL);

    setActiveLink(e.target);
  });
});

if (activeLinkId) {
  const activeLink = document.getElementById(activeLinkId);
  if (activeLink) {
    setActiveLink(activeLink);
  }
}

const genres = [
  {
    "id": 28,
    "name": "Ação"
  },
  {
    "id": 16,
    "name": "Anime"
  },
  {
    "id": 12,
    "name": "Aventura"
  },
  {
    "id": 35,
    "name": "Comédia"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentário"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Família"
  },
  {
    "id": 14,
    "name": "Fantasia"
  },
  {
    "id": 37,
    "name": "Faroeste"
  },
  {
    "id": 878,
    "name": "Ficção Científica"
  },
  {
    "id": 10752,
    "name": "Guerra"
  },
  {
    "id": 36,
    "name": "História"
  },
  {
    "id": 10402,
    "name": "Música"
  },
  {
    "id": 9648,
    "name": "Mistério"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 53,
    "name": "Suspense"
  },
  {
    "id": 27,
    "name": "Terror"
  }

]

const main = document.getElementById('main');
const formSearch = document.getElementById('form-search');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');
const generosLink = document.getElementById('generos');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

var selectedGenre = []
//setGenre();

tagsEl.style.display = 'none';

generosLink.addEventListener('click', () => {
  if (tagsEl.style.display === 'none') {
    tagsEl.style.display = 'flex';
    setGenre();
  } else {
    tagsEl.style.display = 'none';
  }
});

function setGenre() {
  tagsEl.innerHTML = '';
  genres.forEach(genre => {
    const t = document.createElement('div');
    t.classList.add('tag');
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener('click', () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          })
        } else {
          selectedGenre.push(genre.id);
        }
      }
      //console.log(selectedGenre)
      getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
      highlightSelection()
    })
    tagsEl.append(t);
  })
  if (selectedGenre.length !== 0) {
    selectedGenre.forEach(genreId => {
      const selectedTag = document.getElementById(genreId);
      if (selectedTag) {
        selectedTag.classList.add('highlight');
        clearBtn();
      }
    });
  }
}

function highlightSelection() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    tag.classList.remove('highlight')
  })
  clearBtn()
  if (selectedGenre.length != 0) {
    selectedGenre.forEach(id => {
      const hightlightedTag = document.getElementById(id);
      hightlightedTag.classList.add('highlight');
    })
  }


}

function clearBtn() {
  let clearBtn = document.getElementById('clear');
  if (selectedGenre.length === 0) {
    if (clearBtn) {
      clearBtn.remove();
    }
  } else {
    if (clearBtn) {
      clearBtn.classList.add('highlight');
    } else {
      let clear = document.createElement('div');
      clear.classList.add('tag', 'highlight');
      clear.id = 'clear';
      clear.innerText = 'Limpar Filtros';
      clear.addEventListener('click', () => {
        selectedGenre = [];
        setGenre();
        getMovies(API_URL);
      });
      tagsEl.append(clear);
    }
  }
}

getMovies(API_URL);

function getMovies(url) {
  lastUrl = url;
  fetch(url).then(res => res.json()).then(data => {
    // console.log(data.results)
    if (data.results.length !== 0) {
      showMovies(data.results);
      currentPage = data.page;
      nextPage = currentPage + 1;
      prevPage = currentPage - 1;
      totalPages = data.total_pages;

      current.innerText = currentPage;

      if (currentPage <= 1) {
        prev.classList.add('disabled');
        next.classList.remove('disabled')
      } else if (currentPage >= totalPages) {
        prev.classList.remove('disabled');
        next.classList.add('disabled')
      } else {
        prev.classList.remove('disabled');
        next.classList.remove('disabled')
      }

      tagsEl.scrollIntoView({ behavior: 'smooth' })

    } else {
      main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
    }

  })

}

function showMovies(data) {
  main.innerHTML = '';

  data.forEach(movie => {
    const { title, name, poster_path, vote_average, overview, id } = movie;
    if (!poster_path) return;

    const displayTitle = title || name || 'Sem título';
    const isMovie = !!title;
    const maxLength = 200;
    const overviewText = overview || '';
    const limitedOverview = overviewText.length > maxLength ? overviewText.substring(0, maxLength) + "..." : overviewText;
    const displayRating = vote_average === 0 ? '?' : vote_average;

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
          <img src="${IMG500_URL + poster_path}" alt="${displayTitle}">

          <div class="movie-info">
              <h3>${displayTitle}</h3>
              <br/>
              <div class="rating">
                <i class="bx bxs-star"></i>
                <span>${displayRating}</span>
              </div>
          </div>

          <div class="resumo" id="resumo-${id}">
              <h3>Resumo</h3>
              ${limitedOverview}
              <br/>
              <div class="resumo-btn">
                <button class="know-more" id="more-${id}">Mais Informações</button>
                <button class="save" id="save-${id}">Salvar</button>
              </div>
          </div>
      `;

    main.appendChild(movieEl);

    document.getElementById(`more-${id}`).addEventListener('click', (e) => {
      e.stopPropagation();
      showDetails(id, isMovie);
    });

    document.getElementById(`save-${id}`).addEventListener('click', (e) => {
      e.stopPropagation();
      console.log("btn save clicked " + id);
    });

    document.getElementById(`resumo-${id}`).addEventListener('click', () => {
      console.log("resumo clicked " + id);
    });
  });
}

function showDetails(id, isMovie) {
  const type = isMovie ? 'movie' : 'tv';
  const DETAILS_URL = `${BASE_URL}/${type}/${id}?${API_KEY}`;
  const BANNER_URL = `${BASE_URL}/${type}/${id}/images?${API_KEY}`;

  fetch(DETAILS_URL)
    .then(res => res.json())
    .then(data => {
      fetch(BANNER_URL)
        .then(res => res.json())
        .then(bannerData => {
          const detailsContainer = document.createElement('div');
          detailsContainer.classList.add('details-container');
          detailsContainer.id = "details-container";

          let preferredBackdrops = bannerData.backdrops;
          preferredBackdrops = bannerData.backdrops.filter(b => b.iso_639_1 === "pt");
          if (preferredBackdrops.length === 0) {
            preferredBackdrops = bannerData.backdrops.filter(b => b.iso_639_1 === "en");
          }
          if (preferredBackdrops.length === 0) {
            preferredBackdrops = bannerData.backdrops;
          }

          let backdrop = preferredBackdrops.find(b => b.width === 1920);
          if (!backdrop && preferredBackdrops.length > 0) {
            backdrop = preferredBackdrops.reduce((max, current) =>
              current.width > max.width ? current : max
            );
          }

          const backdropPath = backdrop ? backdrop.file_path : '';
          const displayTitle = data.title || data.name || 'Sem título';

          detailsContainer.innerHTML = `
            <div class="details" id="details">
              <i class="bx bx-x bx-tada" id="close-btn"></i>
              <img src="${backdropPath ? IMG_URL + backdropPath : "http://via.placeholder.com/1080x1580"}" alt="${displayTitle}">
              <div class="resumo" id="resumo">
                <div class="details-info">
                  <h3>${displayTitle}</h3>
                  <span><i class="bx bxs-star"></i> ${data.vote_average}</span>
                </div>
                <h3>Resumo</h3>
                <p>${data.overview}</p>
              </div>
            </div>
          `;

          document.body.appendChild(detailsContainer);
          document.body.classList.add('no-scroll');

          document.getElementById('close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.body.classList.remove('no-scroll');
            const element = document.getElementById("details-container");
            element.remove();
          });
        })
        .catch(error => console.error('Error fetching banner images:', error));
    })
    .catch(error => console.error('Error fetching movie details:', error));
}


formSearch.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();
  if (searchTerm) {
    getMovies(searchURL + '&query=' + searchTerm)
  } else {
    getMovies(API_URL);
  }

})

prev.addEventListener('click', () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
})

next.addEventListener('click', () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
})

function pageCall(page) {
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length - 1].split('=');
  if (key[0] != 'page') {
    let url = lastUrl + '&page=' + page
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] + '?' + b
    getMovies(url);
  }
}
