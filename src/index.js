import './sass/main.scss';
import SimpleLightbox from "simplelightbox"

import 'simplelightbox/dist/simple-lightbox.min.css'
const axios = require('axios');
const form = document.querySelector(".search-form")
const gallery = document.querySelector(".gallery")

const loadMoreBTN = document.querySelector(".load-more")
loadMoreBTN.classList.add("visually-hidden")
let currentPage = 1
let currentSeach = ""



form.addEventListener("submit", getSeach)
loadMoreBTN.addEventListener("click", loadMore)

function getSeach(event) {
  event.preventDefault()
  console.log()
  loadMoreBTN.classList.remove("visually-hidden")
  if (event.type === "submit") { gallery.innerHTML = "" }
  console.log(currentSeach)
  
        if (currentSeach === form[0].value) {
          currentPage +=  1
        } else {currentPage = 1}
  
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
    
    
    .then(data => {
      currentSeach = form[0].value
      console.log(currentSeach)
      markup(data.data.hits)
    })
  
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

function loadMore() {
  window.addEventListener('scroll', xcx)
function xcx(e) { 
  console.log(document.body.offsetHeight)
  console.log(window.innerHeight)
  
  const scrolled = window.scrollY
  console.log(scrolled + window.innerHeight)
  if ((scrolled + window.innerHeight) >= document.body.offsetHeight) {
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
    
    
    .then(data => {
      currentSeach = form[0].value
      console.log(currentSeach)
      markup(data.data.hits)
    })

  }

  // if (document.body.clientHeight ===)
  
   
 }
}



 