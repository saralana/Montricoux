console.log('SCRIPT NOVO 17:50')
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
  style:'mapbox://styles/saralgc/cmq5blqjy007z01r2ehghfwol',
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
// MARKER SCALE
// ========================================

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

  {
    id:'pont',
    image:'pont',
    lng:1.6169,
    lat:44.07328,
    zoom:17,
    scale:0.12,
    rotation:0
  },

  {
    id:'moulin',
    image:'moulin',
    lng:1.61858,
    lat:44.0736,
    zoom:17,
    scale:0.2,
    rotation:0
  },

  {
    id:'grand-rue',
    image:'grand-rue',
    lng:1.61898,
    lat:44.07542,
    zoom:18,
    scale:0.14,
    rotation:-35
  },

  {
    id:'grand-rue-2',
    image:'grand-rue-2',
    lng:1.618,
    lat:44.075128,
    zoom:18,
    scale:0.14,
    rotation:-5
  },

  {
    id:'PlaceMarcelLenoir',
    image:'PlaceMarcelLenoir',
    lng:1.6179,
    lat:44.07532,
    zoom:18,
    scale:0.15,
    rotation:0
  },

  {
    id:'PlaceNationale',
    image:'PlaceNationale',
    lng:1.6188,
    lat:44.07526,
    zoom:18,
    scale:0.3,
    rotation:-18
  },

  {
    id:'PlaceNeuve',
    image:'PlaceNeuve',
    lng:1.61915,
    lat:44.07485,
    zoom:18,
    scale:0.18,
    rotation:0
  },

  {
    id:'rueDeLAqueduc',
    image:'rueDeLAqueduc',
    lng:1.619076,
    lat:44.07505,
    zoom:18.1,
    scale:0.17,
    rotation:95
  },

  {
    id:'rueDeLaResistence',
    image:'rueDeLaResistence',
    lng:1.61874,
    lat:44.0751,
    zoom:18.1,
    scale:0.17,
    rotation:93
  },

  {
    id:'rueSaintAntoine',
    image:'rueSaintAntoine',
    lng:1.6187,
    lat:44.0756,
    zoom:18.1,
    scale:0.17,
    rotation:43
  },

  {
    id:'rueSaintEutrope',
    image:'rueSaintEutrope',
    lng:1.61891,
    lat:44.0756,
    zoom:18.1,
    scale:0.17,
    rotation:44
  },

  {
    id:'rueDesRemparts',
    image:'rueDesRemparts',
    lng:1.61993,
    lat:44.075,
    zoom:18.1,
    scale:0.27,
    rotation:110
  },

  {
    id:'rueDesTempliers',
    image:'rueDesTempliers',
    lng:1.61859,
    lat:44.075735,
    zoom:18.1,
    scale:0.15,
    rotation:-20
  }

]

// ========================================
// LOAD GEOJSON
// ========================================

map.on('load',async()=>{

  console.log('MAP LOADED')

  // ========================================
  // LOAD DECORATION IMAGES
  // ========================================

  for(const item of decorations){
    await new Promise(resolve=>{
      map.loadImage(
        `assets/decorations/${item.image}.png`,
        (error,image)=>{
          if(error){
            console.error(error)
            resolve()
            return
          }
          if(!map.hasImage(item.image)){
            map.addImage(
              item.image,
              image
            )
          }
          resolve()
        }
      )
    })
  }
  const decorationGeojson = {
    type:'FeatureCollection',
    features:
    decorations.map(item=>({
      type:'Feature',
      properties:{
        image:item.image,
        scale:item.scale,
        rotation:item.rotation,
        zoom:item.zoom
      },
      geometry:{
        type:'Point',
        coordinates:[
          item.lng,
          item.lat
        ]
      }
    }))
  }

  // ========================================
  // DECORATION SOURCE
  // ========================================

  map.addSource(
    'decorations',
    {
      type:'geojson',
      data:decorationGeojson
    }
  )
  // ========================================
  // BUILDINGS
  // ========================================

  map.addLayer({
    id:'decorations-buildings',
    type:'symbol',
    source:'decorations',
    minzoom:18.1,
    filter:[
      '<',
      ['get','zoom'],
      18.1
    ],
    layout:{
      'icon-image':['get','image'],
      'icon-size':[
        'interpolate',
        ['linear'],
        ['zoom'],
        17,
        ['get','scale'],
        20,
        ['*',['get','scale'],4]
      ],
      'icon-rotate':['get','rotation'],
      'icon-allow-overlap':true,
      'icon-ignore-placement':true
    }
  })

  // ========================================
  // STREETS
  // ========================================

  map.addLayer({
    id:'decorations-streets',
    type:'symbol',
    source:'decorations',
    minzoom:19,
    filter:[
      '>=',
      ['get','zoom'],
      18.1
    ],
    layout:{
      'icon-image':['get','image'],
      'icon-size':[
        'interpolate',
        ['linear'],
        ['zoom'],
        17,
        ['get','scale'],
        20,
        ['*',['get','scale'],3]
      ],
      'icon-rotate':['get','rotation'],
      'icon-allow-overlap':true,
      'icon-ignore-placement':true
    }
  })

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

      event.stopPropagation()

      // CLOSE SIDEBAR
      sidebar.classList.remove('active')

      // OPEN PLAYER
      playerPanel.classList.add('active')
      playerPanel.classList.remove('collapsed')

      // RESET ALL MARKERS
      document
      .querySelectorAll('.marker-inner')
      .forEach(marker => {
        marker.classList.remove('active-marker')
        /*marker.style.backgroundImage =
        `url(${marker.dataset.icon})`*/
      })

      // ZOOM TO MARKER
      const vw = window.innerWidth
      let zoom
      if(vw < 768){
          zoom = 18.5
      }
      else if(vw < 1800){
          zoom = 19
      }
      else{
          zoom = 20
      }

      map.flyTo({
        center:feature.geometry.coordinates,
        zoom,
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

      playerTitle.textContent = t('title')
      document.getElementById(
        'mini-title'
      ).textContent = t('title')

      playerDescription.textContent =
      t('description')
      playerDescription.classList.remove('expanded')

      descriptionToggle.textContent =
      isEnglish
        ? 'Read more'
        : 'Lire la suite'

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

  document
  .getElementById('mini-player')
  .addEventListener('click',()=>{

    playerPanel.classList.remove(
      'collapsed'
    )

  })

  // ========================================
  // MAP CLICK
  // ========================================

  map.on('click',()=>{
    if(!audio.paused){
      playerPanel.classList.add('collapsed')
    }
    else{
      playerPanel.classList.remove('active')
    }
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


// ========================================
// DESCRIPTION ACCORDION
// ========================================

descriptionToggle.addEventListener('click',()=>{

  playerDescription.classList.toggle('expanded')

  const expanded =
  playerDescription.classList.contains('expanded')

  const isEnglish =
  window.location.pathname.includes('en.html')

  descriptionToggle.textContent = expanded
    ? (isEnglish ? 'Show less' : 'Réduire')
    : (isEnglish ? 'Read more' : 'Lire la suite')
})


// ========================================
// SERVICE WORKER | CONTENT IN COOKIES
// ========================================

if('serviceWorker' in navigator){

  window.addEventListener(
    'load',
    ()=>{

      navigator
      .serviceWorker
      .register('/sw.js')

      .then(()=>{

        console.log(
          'SERVICE WORKER OK'
        )
      })

      .catch(error=>{

        console.error(
          error
        )

      })

    }
  )

}