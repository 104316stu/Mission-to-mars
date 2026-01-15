let containerDiv = document.getElementById("container")
let screenDiv = document.getElementById("screen")
let videoDiv = document.getElementById("Trailer")
let infoDiv = document.getElementById("information")
let movieImage = document.getElementById("movieImage")

const Movies = {
    'space odyssey': "./Videos/2001 A SPACE ODYSSEY - Trailer - Warner Bros. (720p, h264).mp4",
    'Interstellar': "./Videos/Interstellar.mp4",
}

const MovieInfo = {
    'space odyssey': {
        Title: '2001: A Space Odyssey',
        IMDB: 8.062,
        Genre: 'Science Fiction, Mystery, Adventure',
        Duration: '149 min',
        Release: '1968',
        Actors: 'Keir Dullea Gary Lockwood William Sylvester Douglas Rain Daniel Richter',
        Overview: "Humanity finds a mysterious object buried beneath the lunar surface and sets off to find its origins with the help of HAL 9000, the world's most advanced super computer.",
        image: "https://static.posters.cz/image/1300/75298.jpg"
    },
    'Interstellar': {
        Title: 'Interstellar',
        IMDB: 8.5,
        Genre: 'Adventure Drama Science Fiction',
        Duration: '169 min',
        Release: '2014',
        Actors: 'Matthew McConaughey Anne Hathaway Michael Caine Jessica Chastain Casey Affleck',
        Overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        image: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg"
    },
    'gravity': {
        Title: 'Gravity',
        IMDB: 7.7,
        Genre: 'Science Fiction, Thriller',
        Duration: '91 min',
        Release: '2013',
        Actors: 'Sandra Bullock George Clooney Ed Harris',
        Overview: "Two astronauts work together to survive after an accident leaves them stranded in space.",
        image: "https://upload.wikimedia.org/wikipedia/en/f/f6/Gravity_Poster.jpg"
    },
    'the martian': {
        Title: 'The Martian',
        IMDB: 8.0,
        Genre: 'Science Fiction, Adventure, Drama',
        Duration: '144 min',
        Release: '2015',
        Actors: 'Matt Damon Jessica Chastain Kristen Wiig Jeff Daniels',
        Overview: "An astronaut becomes stranded on Mars and must rely on his ingenuity to find a way to signal to Earth that he is alive.",
        image: "https://upload.wikimedia.org/wikipedia/en/c/cd/The_Martian_film_poster.jpg"
    },
    'apollo 13': {
        Title: 'Apollo 13',
        IMDB: 7.6,
        Genre: 'Drama, History',
        Duration: '140 min',
        Release: '1995',
        Actors: 'Tom Hanks Bill Paxton Kevin Bacon Gary Sinise Ed Harris',
        Overview: "NASA must devise a strategy to return Apollo 13 to Earth safely after the spacecraft undergoes massive internal damage.",
        image: "https://upload.wikimedia.org/wikipedia/en/9/9e/Apollo_thirteen_movie.jpg"
    },
    'star wars': {
        Title: 'Star Wars: A New Hope',
        IMDB: 8.6,
        Genre: 'Action, Adventure, Fantasy',
        Duration: '121 min',
        Release: '1977',
        Actors: 'Mark Hamill Harrison Ford Carrie Fisher Alec Guinness',
        Overview: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee, and two droids to save the galaxy.",
        image: "https://upload.wikimedia.org/wikipedia/en/8/87/StarWarsMoviePoster1977.jpg"
    },
    'arrival': {
        Title: 'Arrival',
        IMDB: 7.9,
        Genre: 'Drama, Science Fiction',
        Duration: '116 min',
        Release: '2016',
        Actors: 'Amy Adams Jeremy Renner Forest Whitaker',
        Overview: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
        image: "https://upload.wikimedia.org/wikipedia/en/d/df/Arrival%2C_Movie_Poster.jpg"
    },
    'ad astra': {
        Title: 'Ad Astra',
        IMDB: 6.5,
        Genre: 'Adventure, Drama, Mystery',
        Duration: '123 min',
        Release: '2019',
        Actors: 'Brad Pitt Tommy Lee Jones Ruth Negga',
        Overview: "Astronaut Roy McBride undertakes a mission across an unforgiving solar system to uncover the truth about his missing father.",
        image: "https://upload.wikimedia.org/wikipedia/en/c/cb/Ad_Astra_-_film_poster.jpg"
    },
    'first man': {
        Title: 'First Man',
        IMDB: 7.3,
        Genre: 'Biography, Drama, History',
        Duration: '141 min',
        Release: '2018',
        Actors: 'Ryan Gosling Claire Foy Jason Clarke',
        Overview: "A look at the life of the astronaut, Neil Armstrong, and the legendary space mission that led him to become the first man to walk on the Moon.",
        image: "https://upload.wikimedia.org/wikipedia/en/a/a8/First_Man_%28film%29.png"
    },
    'hidden figures': {
        Title: 'Hidden Figures',
        IMDB: 7.8,
        Genre: 'Biography, Drama, History',
        Duration: '127 min',
        Release: '2016',
        Actors: 'Taraji P. Henson Octavia Spencer Janelle Monáe',
        Overview: "The story of a team of female African-American mathematicians who served a vital role in NASA during the early years of the U.S. space program.",
        image: "https://upload.wikimedia.org/wikipedia/en/4/4f/The_official_poster_for_the_film_Hidden_Figures%2C_2016.jpg"
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


for (const movie in MovieInfo) {
    let newDiv = document.createElement("div")
    newDiv.className = "movie"
    newDiv.onclick = function() { clickedMovie(movie) }
    let newImg = document.createElement("img")
    newImg.src = MovieInfo[movie].image
    newDiv.appendChild(newImg)
    containerDiv.appendChild(newDiv)
}

function clickedMovie(Movie) {
    let Title = document.getElementById("Title")
    let AlsoKnownAs = document.getElementById("AlsoKnownAs")
    let IMDB = document.getElementById("IMDB")
    let Genre = document.getElementById("Genre")
    let Duration = document.getElementById("Duration")
    let Release = document.getElementById("Release")
    let Actors = document.getElementById("Actors")
    let Overview = document.getElementById("Overview")

    console.log(Movie)
    document.body.style.cursor = "progress"

    if (MovieInfo[Movie]) {
        videoDiv.src = Movies[Movie] || "./Videos/placeholder.mp4"
        Title.innerHTML = MovieInfo[Movie].Title
        Overview.innerHTML = MovieInfo[Movie].Overview
        IMDB.innerHTML = MovieInfo[Movie].IMDB
        Genre.innerHTML = MovieInfo[Movie].Genre
        Duration.innerHTML = MovieInfo[Movie].Duration
        Release.innerHTML = MovieInfo[Movie].Release
        Actors.innerHTML = MovieInfo[Movie].Actors
        movieImage.src = MovieInfo[Movie].image
        console.log(MovieInfo[Movie])
    } else {
        console.log(`Nothing found for '${Movie}'`)
        document.body.style.cursor = ""
        return
    }

    hideSelection()
    document.body.style.cursor = ""
}
