(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const imgRequest = new XMLHttpRequest();
        imgRequest.onload = addImage;
        imgRequest.onerror = function (err) {
            requestError(err, 'image');
        };

        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.setRequestHeader('Authorization', 'Client-ID eae38a885b0c30ea54e46193b174430e054c36da342d3b41e91d36af42fc6466');
        imgRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArcticles;
        articleRequest.onerror = function (err) {
            requestError(err, 'articles');
        };
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=83557c9462104e428de2ea23a75e76ca`);

        articleRequest.send();
    });


    // const searchedForText = 'hippos';
    // const unsplashRequest = new XMLHttpRequest();

    // unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
    // unsplashRequest.onload = addImage;
    // unsplashRequest.setRequestHeader('Authorization', 'Client-ID <your-client-id>');
    // unsplashRequest.send();


    function addImage() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        const firstImage = data.results[0];

        if (data && data.results && data.results[0]) {
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

    function addArcticles() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

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