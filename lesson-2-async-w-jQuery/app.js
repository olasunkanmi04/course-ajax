/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,

            headers: {
                Authorization: 'Client-ID eae38a885b0c30ea54e46193b174430e054c36da342d3b41e91d36af42fc6466'
            }
        }).done(addImage);

        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=83557c9462104e428de2ea23a75e76ca`

        }).done(addArticles);
    });




    function addImage(images) {
        let htmlContent = '';
        if (images && images.results && images.results[0]) {
            const firstImage = images.results[0];
            htmlContent = `<figure>
        <img src='${firstImage.urls.regular}' alt='${searchedForText}'>
        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption></figure>`;
        } else {
            htmlContent = '<div class="error-no-image">No Images available</div>';
        }
        responseContainer.insertAdjacentHTML(
            'afterbegin',
            htmlContent
        );
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