let containerDiv = document.getElementById("container")
let screenDiv = document.getElementById("screen")
let videoDiv = document.getElementById("Trailer")
let infoDiv = document.getElementById("information")
let movieImage = document.getElementById("movieImage")

const movies = {
    'space odyssey': "./Videos/2001 A SPACE ODYSSEY - Trailer - Warner Bros. (720p, h264).mp4",
    'Interstellar': "./Videos/Interstellar.mp4",
}

const movieInfo = {
    'space odyssey': {
        Title: '2001: A Space Odyssey',
        IMDB: 8.0,
        Genre: 'Science Fiction, Mystery, Adventure',
        Duration: '149 min',
        Release: '1968',
        Actors: 'Keir Dullea Gary Lockwood William Sylvester Douglas Rain Daniel Richter',
        Overview: "Humanity finds a mysterious object buried beneath the lunar surface and sets off to find its origins with the help of HAL 9000, the world's most advanced super computer.",
        image: "./Images/Movies/SpaceOdyssey.jpg"
    },
    'Interstellar': {
        Title: 'Interstellar',
        IMDB: 8.5,
        Genre: 'Adventure Drama Science Fiction',
        Duration: '169 min',
        Release: '2014',
        Actors: 'Matthew McConaughey Anne Hathaway Michael Caine Jessica Chastain Casey Affleck',
        Overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        image: "./Images/Movies/Interstellar.jpg"
    },
    'gravity': {
        Title: 'Gravity',
        IMDB: 7.7,
        Genre: 'Science Fiction, Thriller',
        Duration: '91 min',
        Release: '2013',
        Actors: 'Sandra Bullock George Clooney Ed Harris',
        Overview: "Two astronauts work together to survive after an accident leaves them stranded in space.",
        image: "./Images/Movies/Gravity.jpg"
    },
    'the martian': {
        Title: 'The Martian',
        IMDB: 8.0,
        Genre: 'Science Fiction, Adventure, Drama',
        Duration: '144 min',
        Release: '2015',
        Actors: 'Matt Damon Jessica Chastain Kristen Wiig Jeff Daniels',
        Overview: "An astronaut becomes stranded on Mars and must rely on his ingenuity to find a way to signal to Earth that he is alive.",
        image: "./Images/Movies/Martian.jpg"
    },
    'apollo 13': {
        Title: 'Apollo 13',
        IMDB: 7.6,
        Genre: 'Drama, History',
        Duration: '140 min',
        Release: '1995',
        Actors: 'Tom Hanks Bill Paxton Kevin Bacon Gary Sinise Ed Harris',
        Overview: "NASA must devise a strategy to return Apollo 13 to Earth safely after the spacecraft undergoes massive internal damage.",
        image: "./Images/Movies/Apollo13.jpg"
    },
    'star wars': {
        Title: 'Star Wars: A New Hope',
        IMDB: 8.6,
        Genre: 'Action, Adventure, Fantasy',
        Duration: '121 min',
        Release: '1977',
        Actors: 'Mark Hamill Harrison Ford Carrie Fisher Alec Guinness',
        Overview: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee, and two droids to save the galaxy.",
        image: "./Images/Movies/StarWars.jpg"
    },
    'arrival': {
        Title: 'Arrival',
        IMDB: 7.9,
        Genre: 'Drama, Science Fiction',
        Duration: '116 min',
        Release: '2016',
        Actors: 'Amy Adams Jeremy Renner Forest Whitaker',
        Overview: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
        image: "./Images/Movies/Arrival.jpg"
    },
    'ad astra': {
        Title: 'Ad Astra',
        IMDB: 6.5,
        Genre: 'Adventure, Drama, Mystery',
        Duration: '123 min',
        Release: '2019',
        Actors: 'Brad Pitt Tommy Lee Jones Ruth Negga',
        Overview: "Astronaut Roy McBride undertakes a mission across an unforgiving solar system to uncover the truth about his missing father.",
        image: "./Images/Movies/Astra.jpg"
    },
    'first man': {
        Title: 'First Man',
        IMDB: 7.3,
        Genre: 'Biography, Drama, History',
        Duration: '141 min',
        Release: '2018',
        Actors: 'Ryan Gosling Claire Foy Jason Clarke',
        Overview: "A look at the life of the astronaut, Neil Armstrong, and the legendary space mission that led him to become the first man to walk on the Moon.",
        image: "./Images/Movies/FirstMan.png"
    },
    'hidden figures': {
        Title: 'Hidden Figures',
        IMDB: 7.8,
        Genre: 'Biography, Drama, History',
        Duration: '127 min',
        Release: '2016',
        Actors: 'Taraji P. Henson Octavia Spencer Janelle Monáe',
        Overview: "The story of a team of female African-American mathematicians who served a vital role in NASA during the early years of the U.S. space program.",
        image: "./Images/Movies/Hidden.jpg"
    },
}

function hideSelection() {
    if (containerDiv.style.visibility == "hidden") {
        containerDiv.style.visibility = "visible"
        screenDiv.style.visibility = "hidden"
        videoDiv.pause()
    } else {
        containerDiv.style.visibility = "hidden"
        screenDiv.style.visibility = "visible"
    }
    
}


for (const movie in movieInfo) {
    let newDiv = document.createElement("div")
    newDiv.className = "movie"
    newDiv.onclick = function() { clickedMovie(movie) }
    let newImg = document.createElement("img")
    newImg.src = movieInfo[movie].image
    newDiv.appendChild(newImg)
    containerDiv.appendChild(newDiv)
}

function clickedMovie(movie) {
    let title = document.getElementById("Title")
    let imdb = document.getElementById("IMDB")
    let genre = document.getElementById("Genre")
    let duration = document.getElementById("Duration")
    let release = document.getElementById("Release")
    let actors = document.getElementById("Actors")
    let overview = document.getElementById("Overview")

    console.log(movie)
    document.body.style.cursor = "progress"

    if (movieInfo[movie]) {
        videoDiv.src = movies[movie] || "./Videos/placeholder.mp4"
        title.innerHTML = movieInfo[movie].Title
        overview.innerHTML = movieInfo[movie].Overview
        imdb.innerHTML = movieInfo[movie].IMDB
        genre.innerHTML = movieInfo[movie].Genre
        duration.innerHTML = movieInfo[movie].Duration
        release.innerHTML = movieInfo[movie].Release
        actors.innerHTML = movieInfo[movie].Actors
        movieImage.src = movieInfo[movie].image
        console.log(movieInfo[v])
    } else {
        console.log(`Nothing found for '${movie}'`)
        document.body.style.cursor = ""
        return
    }

    hideSelection()
    document.body.style.cursor = ""
}
