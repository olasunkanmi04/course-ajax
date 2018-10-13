(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    const searchIndex = document.querySelector('#search-index');
    let searchedForText;
    let searchForIndex;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        searchForIndex = searchIndex.value;

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
                headers: {
                    Authorization: 'Client-ID eae38a885b0c30ea54e46193b174430e054c36da342d3b41e91d36af42fc6466'
                }
            }).then(response => response.json())
            .then(addImage)
            .catch(e => requestError(e, 'image'));


        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=83557c9462104e428de2ea23a75e76ca`, {

            }).then(response => response.json())
            .then(addArticles)
            .catch(e => requestError(e, 'article'))
    });





    function addImage(data) {
        let htmlContent = '';
        if (data && data.results && data.results[searchForIndex]) {
            const firstImage = data.results[searchForIndex];
            htmlContent = `<figure>
        <img src='${firstImage.urls.regular}' alt='${searchedForText}'>
        <figcaption>${searchedForText} by ${firstImage.user.name} is the ${searchForIndex}th ${searchedForText} image</figcaption></figure>`;
        } else {
            htmlContent = '<div class="error-no-image">Unfortunately, no image was returned for your search.</div>';
        }
        responseContainer.insertAdjacentHTML(
            'afterbegin',
            htmlContent
        );
    }

    function requestError(e, part) {
        console.log(e);
        responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }


    function addArticles(data) {
        let htmlContent = '';

        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article"><h2><a href="${article.web_url}">${article.headline.main}</a></h2><p>${article.snippet}</p></li>`).join('') + '</ul>';
        } else {
            htmlContent = '<div class="error-no-article">No article available</div>';
        }
        responseContainer.insertAdjacentHTML(
            'beforeend',
            htmlContent
        );
    }
})();