const sidebar =
document.getElementById('sidebar')

const logoButton =
document.getElementById('logo-button')

const closeSidebar =
document.getElementById('close-sidebar')

// ========================================
// MAPBOX TOKEN
// ========================================

mapboxgl.accessToken =
'pk.eyJ1Ijoic2FyYWxnYyIsImEiOiJja2NjbTAyczkwNXA3Mnlscm5nbjN5OHZiIn0.yNcJkPBSugRlIeGkXDRlZw'

// ========================================
// MAP
// ========================================

const map = new mapboxgl.Map({
  container:'map',
  style:'mapbox://styles/saralgc/cmp4m6wdn001g01s9d409darw',
  pitchWithRotate:false,
  dragRotate:false,
  renderWorldCopies:false,
  maxZoom:20
})

const bounds = [
  [1.612606,44.070790],
  [1.622709,44.078713]
]

map.fitBounds(bounds,{
  padding:0,
  animate:false
})

map.once('idle',()=>{

  const vw = window.innerWidth
  let zoom

  if(vw < 768){ // mobile
    zoom = 16.2
  }
  else if(vw < 1800){ // notebook
    zoom = 17.2
  }
  else{ // desktop grande
    zoom = 17.7
  }

  map.easeTo({
    center:[ 1.6187544, 44.0753192 ],
    zoom,
    duration:0
  })

})

map.setMaxBounds(bounds)

// ========================================
// CONTROLS
// ========================================

map.addControl(
  new mapboxgl.NavigationControl(),
  'top-right'
)

// ========================================
// GEOLOCATION
// ========================================

const geolocate =
new mapboxgl.GeolocateControl({

  positionOptions:{
    enableHighAccuracy:true
  },

  trackUserLocation:true,

  showUserHeading:true

})

map.addControl(geolocate)

// ========================================
// PLAYER + SIDEBAR
// ========================================

const playerPanel =
document.getElementById('player-panel')

const playerTitle =
document.getElementById('player-title')

const playerDescription =
document.getElementById('player-description')

const playerAuthor =
document.getElementById('player-author')

const descriptionToggle =
document.getElementById('description-toggle')

const backToMap =
document.getElementById('back-to-map')

// ========================================
// SIDEBAR
// ========================================

logoButton.addEventListener('click',()=>{

  playerPanel.classList.remove('active')

  sidebar.classList.add('active')

})

closeSidebar.addEventListener('click',()=>{

  sidebar.classList.remove('active')

})

backToMap.addEventListener('click',()=>{
  const vw =
  window.innerWidth
  let zoom
  if(vw < 768){
    zoom = 16.2
  }
  else if(vw < 1800){
    zoom = 17.2
  }
  else{
    zoom = 17.7
  }

  map.flyTo({
    center:[
      1.6187544,
      44.0753192
    ],
    zoom,
    duration:1500,
    essential:true
  })

  playerPanel.classList.remove('active')
})

// ========================================
// MARKER AND DECORATION SCALE
// ========================================

function updateDecorations(){

  const zoom =
  map.getZoom()

  document
  .querySelectorAll('.decoration')
  .forEach(el=>{

    const minZoom =
    parseFloat(
      el.dataset.minZoom
    )

    if(zoom < minZoom){
      el.style.opacity = 0
    }

    else{
      el.style.opacity = 1
    }

    const scale =
    parseFloat(
      el.dataset.scale || 1
    )

    const rotation =
    parseFloat(
      el.dataset.rotation || 0
    )

    el.style.transform =
    `scale(${scale}) rotate(${rotation}deg)`
  })

}

function updateMarkerScale(){
  const zoom = map.getZoom()
  const useImages = zoom >= 18
  let scale
  if(zoom <= 18){
    const vw =
    window.innerWidth

    if(vw < 768){
      scale = 0.4
    }
    else if(vw < 1800){
      scale = 0.55
    }
    else{
      scale = 0.75
    }
  }

  else{
    scale = 1.2*(zoom - 17.5)
  }
  document
  .querySelectorAll('.marker-inner')
  .forEach(marker => {

    marker.style.backgroundImage =
    useImages
    ? `url(${marker.dataset.image})`
    : `url(${marker.dataset.icon})`

    marker.classList.toggle('marker-image', useImages)
    marker.classList.toggle('marker-icon', !useImages)

    const isActive =
    marker.classList.contains('active-marker')

    const imageScale =
    parseFloat(marker.dataset.imageScale || 1)

    const finalScale =
    useImages
    ? scale * imageScale
    : scale

    const offsetX =
    useImages
    ? parseFloat(marker.dataset.offsetX || 0)
    : 0

    const offsetY =
    useImages
    ? parseFloat(marker.dataset.offsetY || 0)
    : 0

    marker.style.transform =
    `translate(${offsetX}px, ${offsetY}px) scale(${finalScale})`
  })
}

// ========================================
// DECORATIONS
// ========================================

const decorations = [

  // ======================================
  // BUILDINGS
  // ======================================

  {
    image:'assets/decorations/pont.png',
    lng:1.617,
    lat:44.0728,
    zoom:17,
    scale:1,
    rotation:0
  },

  {
    image:'assets/decorations/moulin.png',
    lng:1.61858,
    lat:44.0735, 
    zoom:17,
    scale:0.1,
    rotation:0
  },

  // ======================================
  // STREETS
  // ======================================

  {
    image:'assets/decorations/grand-rue.png',
    lng:1.612606,
    lat:44.070790,
    zoom:18.5,
    scale:1,
    rotation:-35
  },

  {
    image:'assets/decorations/rueDeLaResistence.png',
    lng:1.612606,
    lat:44.070790,
    zoom:18.5,
    scale:1,
    rotation:15
  },

  {
    image:'assets/decorations/rueDeLAqueduc.png',
    lng:1.612606,
    lat:44.070790,
    zoom:18.5,
    scale:1,
    rotation:-22
  }

]

// ========================================
// LOAD GEOJSON
// ========================================

map.on('load',async()=>{

  console.log('MAP LOADED')

  // ========================================
  // DECORATION MARKERS
  // ========================================

  decorations.forEach(item=>{

    const el =
    document.createElement('div')

    el.className =
    'decoration'

    el.style.backgroundImage =
    `url(${item.image})`

    el.dataset.minZoom =
    item.zoom

    el.dataset.scale =
    item.scale

    el.dataset.rotation =
    item.rotation

    new mapboxgl.Marker(el,{
      anchor:'center'
    })
    .setLngLat([
      item.lng,
      item.lat
    ])
    .addTo(map)

  })

  updateDecorations()

  const response =
  await fetch('data/pontos.geojson')

  const data =
  await response.json()

  data.features.forEach(feature => {

    const coords =
    feature.geometry.coordinates

    const props =
    feature.properties

    // ========================================
    // CREATE HTML MARKER
    // ========================================

    const el =
    document.createElement('div')

    el.className = 'marker marker-icon'

    const inner =
    document.createElement('div')

    inner.className =
    'marker-inner'

    inner.style.backgroundImage =
    `url(${props.icon})`

    inner.dataset.icon = props.icon

    inner.dataset.image = props.image
    inner.dataset.offsetX =
    props.offsetX || 0
    inner.dataset.offsetY =
    props.offsetY || 0
    inner.dataset.imageScale =
    props.imageScale || 1

    el.appendChild(inner)

    // ========================================
    // MARKER
    // ========================================

    new mapboxgl.Marker(el,{
      anchor: props.anchor || 'center'
    })
      .setLngLat(coords)
      .addTo(map)

    updateMarkerScale()

    // ========================================
    // CLICK
    // ========================================

    el.addEventListener('click',(event)=>{

      console.log('MARKER CLICK')

      event.stopPropagation()

      console.log(props.title)

      // CLOSE SIDEBAR

      sidebar.classList.remove('active')

      // OPEN PLAYER

      playerPanel.classList.add('active')

      // RESET ALL MARKERS

      document
      .querySelectorAll('.marker-inner')
      .forEach(marker => {

        marker.classList.remove('active-marker')

        /*marker.style.backgroundImage =
        `url(${marker.dataset.icon})`*/

      })

      // ZOOM TO MARKER

      map.flyTo({
        center:feature.geometry.coordinates,
        zoom:19,
        duration:2000,
        essential:true
      })

      // AFTER ZOOM FINISH

      map.once('moveend',()=>{

        // RESET ALL MARKERS

        document
        .querySelectorAll('.marker-inner')
        .forEach(marker => {

          marker.classList.remove('active-marker')

          /*marker.style.backgroundImage =
          `url(${marker.dataset.icon})`*/

        })

        // ACTIVATE CURRENT MARKER

        inner.classList.add('active-marker')

        /*inner.style.backgroundImage =
        `url(${props.image})`*/

        // UPDATE SCALE

        updateMarkerScale()

      })

      // UPDATE CONTENT

      const isEnglish =
      window.location.pathname.includes('en.html')

      function t(field){

        return isEnglish
          ? (props[`${field}-en`] || props[field])
          : props[field]

      }

      playerTitle.textContent =
      t('title')

      playerDescription.textContent =
      t('description')
      playerDescription.classList.remove('expanded')

      descriptionToggle.textContent =
      '+'

      playerAuthor.textContent =
      t('author')

      // AUDIO

     const subtitlePath =
      isEnglish
      ? `assets/subtitles/en/${props.subtitle.split('/').pop()}`
      : props.subtitle

      loadTrack({
        audio:props.audio,
        subtitle:subtitlePath
      })

    })

  })


  // ========================================
  // MAP CLICK
  // ========================================

  map.on('click',()=>{

    playerPanel.classList.remove('active')

  })

  // ========================================
  // ZOOM
  // ========================================

  map.on('zoom',()=>{
    updateMarkerScale()
    updateDecorations()
  })

})

// ========================================
// ACCORDION
// ========================================

const accordions =
document.querySelectorAll('.accordion')

accordions.forEach((accordion)=>{

  const button =
  accordion.querySelector('.accordion-button')

  button.addEventListener('click',()=>{

    accordion.classList.toggle('active')

  })

})


// ========================================
// DESCRIPTION ACCORDION
// ========================================

descriptionToggle.addEventListener('click',()=>{

  playerDescription.classList.toggle('expanded')

  const expanded =
  playerDescription.classList.contains('expanded')

  descriptionToggle.textContent =
  expanded
    ? '−'
    : '+'

})