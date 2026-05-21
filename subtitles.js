window.parseSRT = function(data){

  const subtitles = []

  const blocks =
  data.trim().split('\n\n')

  blocks.forEach(block=>{

    const lines =
    block.split('\n')

    if(lines.length >= 3){

      const times =
      lines[1].split(' --> ')

      const start =
      toSeconds(times[0])

      const end =
      toSeconds(times[1])

      const text =
      lines.slice(2).join('\n')

      subtitles.push({
        start,
        end,
        text
      })

    }

  })

  return subtitles

}

function toSeconds(time){

  const parts =
  time.replace(',',':').split(':')

  return (
    parseInt(parts[0]) * 3600 +
    parseInt(parts[1]) * 60 +
    parseFloat(parts[2] + '.' + parts[3])
  )

}