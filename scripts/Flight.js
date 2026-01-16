const spaceTable  = {
    distance: 54600000000,
    speed: 531944,
    left: new Date().setHours(0, 0, 0, 0)
}

let distanceElement = document.getElementById('distance')
let speedElement = document.getElementById('speed')
let estimatedTimeElement = document.getElementById('estimatedTime')

function updateFlightInfo() {
    const Time = new Date().getTime()
    const timesince = Time - spaceTable.left

    let secondsSince = timesince / 1000
    let distanceTraveled = spaceTable.speed * secondsSince

    console.log(timesince, distanceTraveled)

    distanceElement.textContent = (distanceTraveled / 1000000000).toFixed(1) + ' M KM'
    speedElement.textContent = spaceTable.speed.toLocaleString() + ' M/S'

    const distanceleft = spaceTable.distance - distanceTraveled
    const secondsleft = distanceleft / spaceTable.speed

    let smallchange = (Math.random() - 0.5) * 0.02 * spaceTable.speed
    let speedtext = Math.round(spaceTable.speed + smallchange)
    speedElement.textContent = speedtext.toLocaleString() + ' M/S'

    let days = Math.floor(secondsleft / 86400)
    let hours = Math.floor((secondsleft % 86400) / 3600)
    let minutes = Math.floor((secondsleft % 3600) / 60)
    let seconds = Math.floor(secondsleft % 60)

    console.log(distanceleft, secondsleft)
    estimatedTimeElement.textContent = `${days}D ${hours}H ${minutes}M ${seconds}S`
}

setInterval(updateFlightInfo, 1000)
updateFlightInfo()