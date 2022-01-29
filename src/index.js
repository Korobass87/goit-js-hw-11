import './sass/main.scss';
import SimpleLightbox from "simplelightbox"
import Notiflix from 'notiflix';
import throttle from "lodash.throttle";
Notiflix.Notify.init({
  
  position: 'right-top',
  distance: '10px',
  opacity: 1,
  // ...
});
import 'simplelightbox/dist/simple-lightbox.min.css'


const axios = require('axios');
const form = document.querySelector(".search-form")
const gallery = document.querySelector(".gallery")
const loadMoreBTN = document.querySelector(".load-more")
// loadMoreBTN.classList.add("visually-hidden")
let currentPage = 1
let currentSeach = ""

function api() {
  axios.get('https://pixabay.com/api/', {
    params: {
        key: '25440089-75c058e87851521159a5db732',
        q: `${form[0].value}`,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: "true",
      per_page: 40,
      page: currentPage
            }     
  })
    .then(async data => {
      currentSeach = form[0].value
      await markup(data.data.hits)
      
      if (currentPage !== 1) {
    scroll()
      }
      if (data.data.totalHits === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
      }
      else {
        if (currentPage === 1) {
          Notiflix.Notify.success(`Hooray!!! We found ${data.data.totalHits} images`)
        }
      }
    })
  ;
}

form.addEventListener("submit", getSeach)
window.addEventListener('scroll', throttle(infiniteLoad, 300))
// loadMoreBTN.addEventListener("click", loadMore)

function getSeach(event) {
  event.preventDefault()
  
  
  // loadMoreBTN.classList.remove("visually-hidden")
  if (event.type === "submit") { gallery.innerHTML = "" }
  
  
        if (currentSeach === form[0].value) {
          currentPage +=  1
        } else {currentPage = 1}
  
  api()
  
}
 
function markup(data) {
  const markupData = data.map(el => {
    return `
      <div class="photo-card">
        <a href="${el.largeImageURL}">
          <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" width="350" height="250"/>
        </a>
        <div class="info">
          <p class="info-item">
           <b>Likes: </b>
           ${el.likes}
          </p>
          <p class="info-item">
            <b>Views: </b>
            ${el.views}
          </p>
          <p class="info-item">
            <b>Comments: </b>
            ${el.comments}
          </p>
          <p class="info-item">
            <b>Downloads: </b>
            ${el.downloads}
          </p>
        </div>
      </div>
          `
  })
  
  gallery.insertAdjacentHTML('beforeend', markupData.join(""))
  const lightbox = new SimpleLightbox('.gallery .photo-card a')
  

 

  
}

// function loadMore() {
//   window.addEventListener('scroll', xcx)
//   getSeach(event)

// }
function infiniteLoad(e) {   
  const scrolled = window.scrollY
   if ((scrolled + window.innerHeight) >= document.body.offsetHeight - 5) {
     currentPage += 1
     console.log(document.querySelector('.gallery').firstElementChild.getBoundingClientRect())
     api()
    }
}
 
function scroll() {

    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
    top: cardHeight * 2 + 30,
    behavior: 'smooth',
    })  
}




