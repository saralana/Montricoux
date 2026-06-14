const CACHE_NAME =
'montricoux-v20250614'

const urlsToCache = [

  '/',
  '/index.html',
  '/en.html',

  '/style.css',
  '/script.js',
  '/player.js',
  '/subtitles.js',
  '/favicon.ico',

  '/data/pontos.geojson',

  '/assets/logo.png',

  // UI

  '/assets/ui/back.png',
  '/assets/ui/geolocate.svg',
  '/assets/ui/language_ENbeige.svg',
  '/assets/ui/language_ENmarron.svg',
  '/assets/ui/language_FRbeige.svg',
  '/assets/ui/language_FRmarron.svg',
  '/assets/ui/zoom_in.svg',
  '/assets/ui/zoom_out.svg',
  '/assets/ui/play.svg',
  '/assets/ui/pause.svg',
  '/assets/ui/mute.svg',
  '/assets/ui/volume.svg',

  // IMAGES

  '/assets/images/1.png',
  '/assets/images/2.png',
  '/assets/images/3.png',
  '/assets/images/4.png',
  '/assets/images/5.png',
  '/assets/images/6.png',
  '/assets/images/7.png',
  '/assets/images/8.png',
  '/assets/images/9.png',
  '/assets/images/10.png',
  '/assets/images/11.png',
  '/assets/images/12.png',

  // ICONS

  '/assets/icons/1.png',
  '/assets/icons/2.png',
  '/assets/icons/3.png',
  '/assets/icons/4.png',
  '/assets/icons/5.png',
  '/assets/icons/6.png',
  '/assets/icons/7.png',
  '/assets/icons/8.png',
  '/assets/icons/9.png',
  '/assets/icons/10.png',
  '/assets/icons/11.png',
  '/assets/icons/12.png',

  // AUDIO

  '/assets/audio/1_audio.mp3',
  '/assets/audio/2_audio.mp3',
  '/assets/audio/3_audio.mp3',
  '/assets/audio/4_audio.mp3',
  '/assets/audio/5_audio.mp3',
  '/assets/audio/6_audio.mp3',
  '/assets/audio/7_audio.mp3',
  '/assets/audio/8_audio.mp3',
  '/assets/audio/9_audio.mp3',
  '/assets/audio/10_audio.mp3',
  '/assets/audio/11_audio.mp3',
  '/assets/audio/12_audio.mp3',

  // SUBTITLES FR

  '/assets/subtitles/1.srt',
  '/assets/subtitles/2.srt',
  '/assets/subtitles/3.srt',
  '/assets/subtitles/4.srt',
  '/assets/subtitles/5.srt',
  '/assets/subtitles/6.srt',
  '/assets/subtitles/7.srt',
  '/assets/subtitles/8.srt',
  '/assets/subtitles/9.srt',
  '/assets/subtitles/10.srt',
  '/assets/subtitles/11.srt',
  '/assets/subtitles/12.srt',

  // SUBTITLES EN

  '/assets/subtitles/en/1.srt',
  '/assets/subtitles/en/2.srt',
  '/assets/subtitles/en/3.srt',
  '/assets/subtitles/en/4.srt',
  '/assets/subtitles/en/5.srt',
  '/assets/subtitles/en/6.srt',
  '/assets/subtitles/en/7.srt',
  '/assets/subtitles/en/8.srt',
  '/assets/subtitles/en/9.srt',
  '/assets/subtitles/en/10.srt',
  '/assets/subtitles/en/11.srt',
  '/assets/subtitles/en/12.srt',

  // DECORATIONS

  '/assets/decorations/moulin.png',
  '/assets/decorations/grand-rue.png',
  '/assets/decorations/grand-rue-2.png',
  '/assets/decorations/pont.png',
  '/assets/decorations/PlaceMarcelLenoir.png',
  '/assets/decorations/PlaceNationale.png',
  '/assets/decorations/PlaceNeuve.png',
  '/assets/decorations/rueDeLAqueduc.png',
  '/assets/decorations/rueDeLaResistence.png',
  '/assets/decorations/rueSaintAntoine.png',
  '/assets/decorations/rueSaintEutrope.png',
  '/assets/decorations/rueDesRemparts.png',
  '/assets/decorations/rueDesTempliers.png',
  '/assets/decorations/rueDuMidi.png',
  '/assets/decorations/rueDeLindustrie.png',
  '/assets/decorations/RueDeLaMairie.png'

]

self.addEventListener(
  'install',
  event=>{
    self.skipWaiting()
    event.waitUntil(
      caches.open(CACHE_NAME)
      .then(cache=>{
        return cache.addAll(
          urlsToCache
        )
      })
    )
  }
)

self.addEventListener(
  'activate',
  event=>{
    event.waitUntil(
      caches.keys()
      .then(keys =>
        Promise.all(
          keys.map(key => {
            if(key !== CACHE_NAME){
              return caches.delete(key)
            }
          })
        )
      )

      .then(()=>
        self.clients.claim()
      )
    )
  }
)

self.addEventListener(
  'fetch',
  event => {

    event.respondWith(

      caches.match(event.request)

      .then(response => {

        if (response) {
          return response
        }

        return fetch(event.request)
          .catch(() => {

            console.log(
              'OFFLINE:',
              event.request.url
            )

            return new Response('', {
              status: 404
            })

          })

      })

    )

  }
)