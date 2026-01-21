let containerDiv = document.getElementById("container")
let screenDiv = document.getElementById("screen")
let videoDiv = document.getElementById("trailer")
let infoDiv = document.getElementById("information")
let movieImage = document.getElementById("movie-image")

const movies = {
    'space odyssey': "../Videos/2001 A SPACE ODYSSEY - Trailer - Warner Bros. (720p, h264).mp4",
    'Interstellar': "../Videos/Interstellar.mp4",
}

const movieInfo = {
    'space odyssey': {
        title: '2001: A Space Odyssey',
        imdb: 8.0,
        genre: 'Science Fiction, Mystery, Adventure',
        duration: '149 min',
        release: '1968',
        actors: 'Keir Dullea Gary Lockwood William Sylvester Douglas Rain Daniel Richter',
        overview: "Humanity finds a mysterious object buried beneath the lunar surface and sets off to find its origins with the help of HAL 9000, the world's most advanced super computer.",
        image: "../Images/Movies/SpaceOdyssey.jpg"
    },
    'Interstellar': {
        title: 'Interstellar',
        imdb: 8.5,
        genre: 'Adventure Drama Science Fiction',
        duration: '169 min',
        release: '2014',
        actors: 'Matthew McConaughey Anne Hathaway Michael Caine Jessica Chastain Casey Affleck',
        overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        image: "../Images/Movies/Interstellar.jpg"
    },
    'gravity': {
        title: 'Gravity',
        imdb: 7.7,
        genre: 'Science Fiction, Thriller',
        duration: '91 min',
        release: '2013',
        actors: 'Sandra Bullock George Clooney Ed Harris',
        overview: "Two astronauts work together to survive after an accident leaves them stranded in space.",
        image: "../Images/Movies/Gravity.jpg"
    },
    'the martian': {
        title: 'The Martian',
        imdb: 8.0,
        genre: 'Science Fiction, Adventure, Drama',
        duration: '144 min',
        release: '2015',
        actors: 'Matt Damon Jessica Chastain Kristen Wiig Jeff Daniels',
        overview: "An astronaut becomes stranded on Mars and must rely on his ingenuity to find a way to signal to Earth that he is alive.",
        image: "../Images/Movies/Martian.jpg"
    },
    'apollo 13': {
        title: 'Apollo 13',
        imdb: 7.6,
        genre: 'Drama, History',
        duration: '140 min',
        release: '1995',
        actors: 'Tom Hanks Bill Paxton Kevin Bacon Gary Sinise Ed Harris',
        overview: "NASA must devise a strategy to return Apollo 13 to Earth safely after the spacecraft undergoes massive internal damage.",
        image: "../Images/Movies/Apollo13.jpg"
    },
    'star wars': {
        title: 'Star Wars: A New Hope',
        imdb: 8.6,
        genre: 'Action, Adventure, Fantasy',
        duration: '121 min',
        release: '1977',
        actors: 'Mark Hamill Harrison Ford Carrie Fisher Alec Guinness',
        overview: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee, and two droids to save the galaxy.",
        image: "../Images/Movies/StarWars.jpg"
    },
    'arrival': {
        title: 'Arrival',
        imdb: 7.9,
        genre: 'Drama, Science Fiction',
        duration: '116 min',
        release: '2016',
        actors: 'Amy Adams Jeremy Renner Forest Whitaker',
        overview: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
        image: "../Images/Movies/Arrival.jpg"
    },
    'ad astra': {
        title: 'Ad Astra',
        imdb: 6.5,
        genre: 'Adventure, Drama, Mystery',
        duration: '123 min',
        release: '2019',
        actors: 'Brad Pitt Tommy Lee Jones Ruth Negga',
        overview: "Astronaut Roy McBride undertakes a mission across an unforgiving solar system to uncover the truth about his missing father.",
        image: "../Images/Movies/Astra.jpg"
    },
    'first man': {
        title: 'First Man',
        imdb: 7.3,
        genre: 'Biography, Drama, History',
        duration: '141 min',
        release: '2018',
        actors: 'Ryan Gosling Claire Foy Jason Clarke',
        overview: "A look at the life of the astronaut, Neil Armstrong, and the legendary space mission that led him to become the first man to walk on the Moon.",
        image: "../Images/Movies/FirstMan.png"
    },
    'hidden figures': {
        title: 'Hidden Figures',
        imdb: 7.8,
        genre: 'Biography, Drama, History',
        duration: '127 min',
        release: '2016',
        actors: 'Taraji P. Henson Octavia Spencer Janelle Monáe',
        overview: "The story of a team of female African-American mathematicians who served a vital role in NASA during the early years of the U.S. space program.",
        image: "../Images/Movies/Hidden.jpg"
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

let title = document.getElementById("title")
let imdb = document.getElementById("imdb")
let genre = document.getElementById("genre")
let duration = document.getElementById("duration")
let release = document.getElementById("release")
let actors = document.getElementById("actors")
let overview = document.getElementById("overview")

function clickedMovie(movie) {
    document.body.style.cursor = "progress"

    if (movieInfo[movie]) {
        videoDiv.src = movies[movie] || "../Videos/placeholder.mp4"
        title.innerHTML = movieInfo[movie].title
        overview.innerHTML = movieInfo[movie].overview
        imdb.innerHTML = movieInfo[movie].imdb
        genre.innerHTML = movieInfo[movie].genre
        duration.innerHTML = movieInfo[movie].duration
        release.innerHTML = movieInfo[movie].release
        actors.innerHTML = movieInfo[movie].actors
        movieImage.src = movieInfo[movie].image
    } else {
        document.body.style.cursor = ""
        return
    }

    hideSelection()
    document.body.style.cursor = ""
}
