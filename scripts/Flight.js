const spaceTable  = {
    distance: 54600000000,
    speed: 531944,
    left: new Date().setHours(0, 0, 0, 0)
}

let distanceElement = document.getElementById('distance')
let speedElement = document.getElementById('speed')
let estimatedTimeElement = document.getElementById('estimated-time')

function updateFlightInfo() {
    const Time = new Date().getTime()
    const timeSince = Time - spaceTable.left

    let secondsSince = timeSince / 1000
    let distanceTraveled = spaceTable.speed * secondsSince

    distanceElement.textContent = (distanceTraveled / 1000000000).toFixed(1) + ' M KM / 54.6 M KM'
    speedElement.textContent = spaceTable.speed.toLocaleString() + ' M/S'

    const distanceLeft = spaceTable.distance - distanceTraveled
    const secondsLeft = distanceLeft / spaceTable.speed

    let smallChange = (Math.random() - 0.5) * 0.02 * spaceTable.speed
    let speedText = Math.round(spaceTable.speed + smallChange)
    speedElement.textContent = speedText.toLocaleString() + ' M/S'

    let days = Math.floor(secondsLeft / 86400)
    let hours = Math.floor((secondsLeft % 86400) / 3600)
    let minutes = Math.floor((secondsLeft % 3600) / 60)
    let seconds = Math.floor(secondsLeft % 60)

    estimatedTimeElement.textContent = `${days}D ${hours}H ${minutes}M ${seconds}S`
}

setInterval(updateFlightInfo, 1000)
updateFlightInfo()