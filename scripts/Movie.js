let containerDiv = document.getElementById("container")
let screenDiv = document.getElementById("screen")
let videoDiv = document.getElementById("trailer")
let movieImage = document.getElementById("movie-image")

const movies = {
    'space odyssey': "http://78.47.119.106:8000/Movies/2001%20A%20Space%20Odyssey%20%281968%29.mp4",
    'Interstellar': "http://78.47.119.106:8000/Movies/Interstellar%20%282014%29.mp4",
    'Moonfall': "http://78.47.119.106:8000/Movies/Moonfall%20%282022%29.mp4",
    'first man': "http://78.47.119.106:8000/Movies/First%20Man%20%282018%29.mp4",
    'avatar': "http://78.47.119.106:8000/Movies/Avatar%20%282009%29.mp4",
    'hidden figures': "http://78.47.119.106:8000/Movies/Hidden%20Figures%20%282016%29.mp4",
    'arrival': "http://78.47.119.106:8000/Movies/Arrival.mp4",
    'the martian': "http://78.47.119.106:8000/Movies/The%20Martian%20%282015%29.mp4",
    'gravity': "http://78.47.119.106:8000/Movies/Gravity%20%282013%29.mp4",
    'Dune': "http://78.47.119.106:8000/Movies/Dune%20%282021%29.mp4",
    'dune: part two': "http://78.47.119.106:8000/Movies/Dune%20Part%20Two%20%282024%29.mp4",
    'alien': "http://78.47.119.106:8000/Movies/Alien%20%281979%29.mp4",
    'apollo 13': "http://78.47.119.106:8000/Movies/Apollo%2013%20%281995%29.mp4",
    'star wars': "http://78.47.119.106:8000/Movies/Star%20Wars%20Episode%204%20A%20New%20Hope%20%281977%29.mp4",
    'ad astra': "http://78.47.119.106:8000/Movies/Ad%20Astra%20%282019%29.mp4",
    'guardians of the galaxy': "http://78.47.119.106:8000/Movies/Guardians%20of%20the%20Galaxy%20%282014%29.mp4"
}

const movieInfo = {
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
    'Moonfall': {
        title: 'Moonfall',
        imdb: 5.2,
        genre: 'Action, Adventure, Science Fiction',
        duration: '130 min',
        release: '2022',
        actors: 'Halle Berry Patrick Wilson John Bradley',
        overview: "A mysterious force knocks the Moon from its orbit around Earth and sends it hurtling on a collision course with life as we know it. As panic spreads and the world prepares for impact, a ragtag team ventures into space to uncover the real threat behind the disaster and save humanity.",
        image: "../Images/Movies/Moonfall.webp"
    },
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
    'Dune': {
        title: 'Dune',
        imdb: 8.0,
        genre: 'Action, Adventure, Science Fiction',
        duration: '155 min',
        release: '2021',
        actors: 'Timothée Chalamet Rebecca Ferguson Oscar Isaac Josh Brolin Zendaya',
        overview: "Paul Atreides, a gifted young man born into a great destiny, travels to the desert planet Arrakis to secure his family’s future as rival forces battle for control of the planet’s precious spice.",
       image: "../Images/Movies/Dune.jpg"
    },
    'dune: part two': {
       title: 'Dune: Part Two',
        imdb: 8.6,
        genre: 'Action, Adventure, Science Fiction',
        duration: '166 min',
        release: '2024',
        actors: 'Timothée Chalamet Zendaya Rebecca Ferguson Josh Brolin',
        overview: "Paul Atreides unites with the Fremen to wage war against the conspirators who destroyed his family and to decide the fate of Arrakis.",
        image: "../Images/Movies/Dune_Part_Two_poster.jpeg"
    },
    'alien': {
        title: 'Alien',
        imdb: 8.5,
        genre: 'Horror, Science Fiction',
        duration: '117 min',
        release: '1979',
        actors: 'Sigourney Weaver Tom Skerritt Veronica Cartwright John Hurt',
        overview: "The crew of a commercial spaceship encounters a deadly lifeform after investigating a distress signal on a remote planet.",
        image: "../Images/Movies/Alien.jpg"
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
    'avatar': {
        title: 'Avatar',
        imdb: 7.9,
        genre: 'Action, Adventure, Science Fiction',
        duration: '162 min',
        release: '2009',
        actors: 'Sam Worthington Zoe Saldana Sigourney Weaver Stephen Lang',
        overview: "A paralyzed marine is sent to the alien world Pandora and must choose between following orders and protecting his new home.",
        image: "../Images/Movies/Avatar.jpg"
    },
    'guardians of the galaxy': {
        title: 'Guardians of the Galaxy',
        imdb: 8.0,
        genre: 'Action, Adventure, Comedy, Science Fiction',
        duration: '121 min',
        release: '2014',
        actors: 'Chris Pratt Zoe Saldana Dave Bautista Vin Diesel Bradley Cooper',
        overview: "A band of misfit criminals forms an unlikely team to stop a powerful villain from using an artifact to destroy the galaxy.",
        image: "../Images/Movies/Guardians_of_the_Galaxy.jpg"
    },
}

let previousScroll = [0,0]

function hideSelection() {
    if (containerDiv.style.visibility == "hidden") {
        containerDiv.style.visibility = "visible"
        screenDiv.style.visibility = "hidden"
        window.scrollTo(previousScroll[1], previousScroll[0])
        videoDiv.pause()
    } else {
        containerDiv.style.visibility = "hidden"
        screenDiv.style.visibility = "visible"
        previousScroll = [window.scrollY, window.scrollX]
        window.scrollTo(0, 0)
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
        videoDiv.src = "../Videos/placeholder.mp4"

        if (movies[movie]) {

        fetch(movies[movie], { headers: { Range: 'bytes=0-0' } })
            .then(resp => {
                if (resp.ok) {
                    videoDiv.src = movies[movie]
                    videoDiv.play()
                }
            })
        }

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
    videoDiv.play()
}
