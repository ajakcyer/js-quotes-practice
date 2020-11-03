const ul = document.querySelector('#quote-list')


// Populate page with quotes
const fetchQuotes = () =>{
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(r=> r.json())
    .then(renderQuotes)
}

///for each quote render quotes
const renderQuotes = (quotes) =>{
    quotes.forEach(quote =>{
        renderQuote(quote)
    })
}


///render 1 quote
const renderQuote = (quote)=>{
    const li = document.createElement('li')
    // debugger
    li.classList.add('quote-card')
    li.innerHTML = `<blockquote class="blockquote">
                    <p class="mb-${quote.id}">${quote.quote}</p>
                    <footer class="blockquote-footer">${quote.author}</footer>
                    <br>
                    <button class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
                    <button class='btn-danger'>Delete</button>
                    </blockquote>`
    ul.append(li)
}



/// Creating new quote
const form = document.querySelector('#new-quote-form')
form.addEventListener('submit', (event)=>{
    event.preventDefault()

    const quoteObj = {
        'quote': form.quote.value,
        'author': form.author.value
        // 'likes': []
    }
    
    const quoteObjConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(quoteObj)
    }

    form.reset()
    // debugger

    fetch("http://localhost:3000/quotes", quoteObjConfig)
    .then(r=> r.json())
    .then(renderQuote)
})

/// deleting a quote
//find parent delegation
ul.addEventListener('click', event=>{
    if (event.target.matches('.btn-danger')){
        const deleteBtn = event.target
        const quote = deleteBtn.closest('li')
        const id = quote.querySelector('p').className.replace('mb-', '')

        const deleteObj = {
            method: 'DELETE'
        }
        
        fetch(`http://localhost:3000/quotes/${id}`, deleteObj)
        .then(r=> r.json())
        .then(data=>{
            quote.remove()
        })
    } else if (event.target.matches('.btn-success')){
        const likeBtn = event.target
        let currentLikes = likeBtn.querySelector('span')
        const quote = likeBtn.closest('li')
        const id = parseInt(quote.querySelector('p').className.replace('mb-', ''))

        likeObj = {
            quoteId: id,
            createdAt: Date.now()
        }
        // debugger

        likesObjConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(likeObj)
        }
        
        fetch("http://localhost:3000/likes", likesObjConfig)
        .then(r=> r.json())
        .then(like =>{
            currentLikes.textContent = parseInt(currentLikes.textContent) + 1
        })
    }
})






fetchQuotes()