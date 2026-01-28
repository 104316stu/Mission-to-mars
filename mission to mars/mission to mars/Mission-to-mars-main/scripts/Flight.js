const spaceTable  = {
    distance: 54600000000,
    speed: 531944,
    left: new Date().setHours(0, 0, 0, 0)
}

let distanceElement = document.getElementById('distance')
let speedElement = document.getElementById('speed')
let estimatedTimeElement = document.getElementById('estimated-time')
let rocket = document.getElementById("rocket")

const topPercent = 10
const lowPercentMars = 40
const lowPercentEarth = 35

const leftTopPercent = 84
const leftLowPercent = 13


function updateFlightInfo() {
    const Time = new Date().getTime()
    const timeSince = Time - spaceTable.left

    let secondsSince = timeSince / 1000
    let distanceTraveled = spaceTable.speed * secondsSince
    let distancePercentage =  (distanceTraveled/spaceTable.distance) * 100
    
    if (distancePercentage >= 100) { 
        estimatedTimeElement.textContent = "You have arrived at Station 15. MARS" 
        speedElement.textContent = "Stopped"
        distanceElement.textContent = "54.6 M KM / 54.6 M KM"
        rocket.style.top =  lowPercentMars + "%"
        rocket.style.left = leftTopPercent + "%"
        distancePercentage = 100
        distanceTraveled = spaceTable.distance

        return
    }

    let lowPercent = distancePercentage < 50 ? lowPercentEarth : lowPercentMars

    let hillTimes = 1 - Math.abs(distancePercentage-50) / 50
    rocket.style.top =  lowPercent - (lowPercent-topPercent) * hillTimes+"%"
    rocket.style.left = leftLowPercent - (leftLowPercent-leftTopPercent) * distancePercentage/100+"%"
    console.log(lowPercent)

    distanceElement.textContent = (distanceTraveled / 1000000000).toFixed(1) + ' M KM / 54.6 M KM'

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