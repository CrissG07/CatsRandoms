
const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3&api_key=live_xeUxEca19X0fhQ72MiaBUH0ucdYqRVsX48qirHs82e3U2oBf93Yw9hRiBtpkYsaB';

const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites?'

const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?`

const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload'

const spanError = document.getElementById('error');

async function fetchdata() {
    try {
        const response = await fetch(API_URL_RANDOM)

        const data = await response.json()
        console.log('random')
        console.log(data)

        if (response.status !== 200) {
            spanError.innerHTML = 'Hubo un error: ' + response.status;
        } else {
            const img1 = document.getElementById('img1');
            const img2 = document.getElementById('img2');
            const img3 = document.getElementById('img3');
            const fav1 = document.getElementById('fav1');
            const fav2 = document.getElementById('fav2');
            const fav3 = document.getElementById('fav3');
            img1.src = data[0].url;
            img2.src = data[1].url;
            img3.src = data[2].url;

            fav1.onclick = () => saveFavoriteCats(data[0].id)
            fav2.onclick = () => saveFavoriteCats(data[1].id)
            fav3.onclick = () => saveFavoriteCats(data[2].id)
        }

    } catch (error) {
        console.error('Error', error);
    }
}

async function fetchdatafavorite() {
    try {
        const response = await fetch(API_URL_FAVORITES,{
            method:'GET',
            headers:{
                'X-API-KEY':'live_xeUxEca19X0fhQ72MiaBUH0ucdYqRVsX48qirHs82e3U2oBf93Yw9hRiBtpkYsaB',
            },
        });

        if (!response.ok) {
            throw new Error('Error en el llamado de la api')
        }
        const data = await response.json()
        console.log('favorites')
        console.log(data)

        if (response.status !== 200) {
            spanError.innerHTML = 'Hubo un error: ' + response.status + data.message;
        } else {
            const div = document.getElementById('favoriteCats');
            div.innerHTML = "";  // Limpiar contenido anterior
            
            
            
            data.forEach(cat => {
                const article = document.createElement('article');
                const img = document.createElement('img');
                const btn = document.createElement('button');
                const btnText = document.createTextNode('Sacar de favorito');
            
                img.src = cat.image.url;
                img.width = 400;
                img.alt='Imagen de gato aleatoria'
                btn.appendChild(btnText);
                btn.onclick = () => deleteFavoriteCats(cat.id);
                
                article.appendChild(img);
                article.appendChild(btn);
                div.appendChild(article);
                
                article.classList.add('body-article');
                btn.classList.add('article--button');
            });
        }

    } catch (error) {
        console.error('Error', error);
    }
}

async function saveFavoriteCats(id) {
    const response = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY':'live_xeUxEca19X0fhQ72MiaBUH0ucdYqRVsX48qirHs82e3U2oBf93Yw9hRiBtpkYsaB',
        },
        body: JSON.stringify({
            image_id: id,
        }),
    });

    const data = await response.json();
    console.log('save')
    console.log(response)

    if (response.status !== 200) {
        spanError.innerHTML = 'Hubo un error: ' + response.status + data.message;
    } else {
        console.log('cat agregado')
        fetchdatafavorite()
    }
}

async function deleteFavoriteCats(id) {
    const response = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers:{
            'X-API-KEY':'live_xeUxEca19X0fhQ72MiaBUH0ucdYqRVsX48qirHs82e3U2oBf93Yw9hRiBtpkYsaB',
        },
    });

    const data = await response.json();


    if (response.status !== 200) {
        spanError.innerHTML = 'Hubo un error: ' + response.status + data.message;
    } else {
        console.log('Cat eliminado')
        fetchdatafavorite()
    }
}

async function uploadCatFoto(){
    const form= document.getElementById('uploadingForm');
    const formData= new FormData(form);
 
    const res = await fetch(API_URL_UPLOAD,{
        method: 'POST',
        headers: {
            
            'X-API-KEY':'live_xeUxEca19X0fhQ72MiaBUH0ucdYqRVsX48qirHs82e3U2oBf93Yw9hRiBtpkYsaB',
        },
        body:formData,
    })
    
}

fetchdata();
fetchdatafavorite()

const button = document.getElementById('btn');
button.addEventListener('click', fetchdata)

