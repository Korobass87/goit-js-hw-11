import './sass/main.scss';
import SimpleLightbox from "simplelightbox"
import 'simplelightbox/dist/simple-lightbox.min.css'
import Notiflix from 'notiflix';
import throttle from "lodash.throttle";
Notiflix.Notify.init({
  
  position: 'right-top',
  distance: '10px',
  opacity: 1,
  // ...
});


const axios = require('axios');
const form = document.querySelector(".search-form")
const gallery = document.querySelector(".gallery")
const intersection = document.querySelector(".intersection")
let currentPage = 1
let currentSeach = ""
let length = 1
const options = {    
  rootMargin: '20px' 
}
const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (gallery.innerHTML === "") {
        return
      }
      currentPage += 1
      api(false);
    }
  });
};
const observer = new IntersectionObserver(onEntry, options)
 


async function api(checkSubmit) {
  await axios.get('https://pixabay.com/api/', {
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
     length = data.data.hits.length
        await markup(data.data.hits, checkSubmit)
      if (data.data.hits.length === 0 && data.data.totalHits !== 0) {
        Notiflix.Notify.init({
    position: 'center-bottom',
 });
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
        Notiflix.Notify.init({
    position: 'right-center',
 });
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
    
    .catch(error => {
     Notiflix.Notify.init({
  position: 'center-bottom',
 });
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
        Notiflix.Notify.init({
    position: 'right-center',
 });
          })
  }

form.addEventListener("submit", getSeach)


async function getSeach(event) {
  event.preventDefault()
  observer.observe(intersection)
  
 
  let checkSubmit = event.type === "submit"
  if (checkSubmit) { gallery.innerHTML = "" }
  
  
  if (currentSeach === form[0].value) {
    currentPage +=  1
  } else {currentPage = 1}
  
    await api(checkSubmit)
  
}
 
async function markup(data, checkSubmit) {
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
  
  
    await gallery.insertAdjacentHTML('beforeend', markupData.join(""))
    
    const lightbox = new SimpleLightbox('.gallery .photo-card a')
    lightbox.refresh()
    
    if (currentPage !== 1 && checkSubmit !== true) {
      scroll()
    } 
  }
 
function scroll() {

    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
    top: cardHeight * 2 + 30,
    behavior: 'smooth',
    })  
    
}




