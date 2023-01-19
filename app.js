

const createAutoCompleteConfig = {
    renderOption(movie){
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img class="poster" src = "${imgSrc}" />
            <span>${movie.Title} (${movie.Year})</span>
            `;
        },
        
        inputValue(movie){
            return movie.Title
        },
        async fetchData(term){
            const url = `http://www.omdbapi.com/?s=${term}&apikey=ff1ea760`;
            const res = await fetch(`${url}`);
            const data = await res.json();
            if(data.Error){
                return [];
            };
            return data.Search;
        }
};

createAutoComplete({
    root: document.querySelector('.autoComplete-one'),
    ...createAutoCompleteConfig,
    onOptionSelect(movie){
        onMovieSelect(movie.imdbID, document.querySelector('.summary-one'), 'left')
    },    
});
createAutoComplete({
    root: document.querySelector('.autoComplete-two'),
    ...createAutoCompleteConfig,
    onOptionSelect(movie){
        onMovieSelect(movie.imdbID, document.querySelector('.summary-two'), 'right')
    },
});
let leftMovie;
let rightMovie;
const onMovieSelect = async (id, targetSummary, side) => {
    const url = `http://www.omdbapi.com/?i=${id}&apikey=ff1ea760`;
    const res = await fetch(`${url}`);
    const data = await res.json();
    // console.log(data)
    targetSummary.innerHTML = movieTempelate(data)
    if(side == 'left'){
        leftMovie = data
    }else{
        rightMovie = data
    };

    if(leftMovie && rightMovie){
        runComparison()
    };

};

const runComparison = () => {
    
    const leftSideStat = document.querySelectorAll('.summary-one .notificaton')
    const rightSideStat = document.querySelectorAll('.summary-two .notificaton')
    leftSideStat.forEach((leftStat, index) => {
        rightStat = rightSideStat[index];
        leftStat.classList.remove('higher', 'lower', 'equal')
        rightStat.classList.remove('higher', 'lower', 'equal')
        console.log(rightStat)
        
        const leftValue = parseFloat(leftStat.dataset.value)
        const rightValue = parseFloat(rightStat.dataset.value)
        if(leftValue>rightValue){
            leftStat.classList.add('higher')
            rightStat.classList.add('lower')
        }
        else if(leftValue == rightValue){
            leftStat.classList.add('equal')
            rightStat.classList.add('equal')
        }else{
            rightStat.classList.add('higher')
            leftStat.classList.add('lower')
        }
    }); 
};
const checker = (data) => {
    if(data == 'N/A'){
        return 0
    }
    return data
}

const movieTempelate = (movieDetail) => {
    const boxOffice = parseInt(checker(movieDetail.BoxOffice).replace(/\$/g, '').replace(/,/g, ''));
    const metaScore = parseInt(checker(movieDetail.Metascore));
    const IMDBrating = parseFloat(checker(movieDetail.imdbRating));
    const IMDBvoting = parseInt(checker(movieDetail.imdbVotes).replace(/,/g,''));

    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        value = parseInt(word)
        if(isNaN(value)){
            return prev;
        }else{
            return prev + value;
        }
    }, 0);
    return `<div class="summaryContainer">
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}">
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <div  class="notification-area">
    <article data-value = ${awards} class="notificaton">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
</article>
<article data-value = ${boxOffice} class="notificaton">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
</article>
<article data-value = ${metaScore} class="notificaton">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
</article>
<article data-value = ${IMDBrating} class="notificaton">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
</article>
<article data-value = ${IMDBvoting} class="notificaton">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
</article>
</div>
</div>`
};
