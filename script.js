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

  renderWorldCopies:false

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

  const isMobile =
  window.innerWidth < 768

  const center =
  map.getCenter()

  if(isMobile){

    map.easeTo({
      center:[
        center.lng + 0.0015,
        center.lat
      ],
      duration:0
    })

  }

  else{

    map.easeTo({
      center:[
        center.lng,
        center.lat + 0.0006
      ],
      duration:0
    })

  }

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

// ========================================
// MARKER SCALE
// ========================================

function updateMarkerScale(){

  const zoom = map.getZoom()
  const useImages = zoom >= 19.5

  let scale

  if(zoom <= 15){

    scale = 1

  }

  else if(zoom <= 20){

    scale =
    1 + ((zoom - 15) * 0.45)

  }

  else{

    scale = 3.25

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

    const finalScale =
    isActive
    ? scale * 1.05
    : scale

    marker.style.transform =
    `scale(${finalScale})`

  })

}

// ========================================
// LOAD GEOJSON
// ========================================

map.on('load',async()=>{

  console.log('MAP LOADED')

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

    inner.dataset.icon =
    props.icon

    inner.dataset.image =
    props.image

    el.appendChild(inner)

    // ========================================
    // MARKER
    // ========================================

    new mapboxgl.Marker(el)
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
        zoom:20,
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

  map.on('zoom',updateMarkerScale)

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