import { useState, useEffect } from 'react'
import './App.css'
import Card from "./components/Card.jsx";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function App() {
    const [input, setInput] = useState("")
    const [bookData, setBookData] = useState(()=>{
        return JSON.parse(localStorage.getItem('bookData')) || []
    })
    const [error, setError] = useState(null)

    useEffect(() => {
        localStorage.setItem('bookData', JSON.stringify(bookData));
    }, [bookData]);

    const handleSubmit = (e) =>{
        e.preventDefault();
        // let apiUrl = `http://openlibrary.org/api/volumes/brief/isbn/${input}.json`
        let secondApiUrl = `http://openlibrary.org/search.json?q=isbn:${input}&fields=key,author_key,author_name,editions,editions.isbn,title,subtitle,editions.language,editions.title,editions.subtitle,edition_count,editions.cover_i`
        const trimmedInput = input.trim();

        if(!trimmedInput){
            setError("Please enter an ISBN Number")
            return;
        }

        if(!/^\d{10}$|^\d{13}$/.test(trimmedInput)) {
            setError("Please enter a 10 or 13 digit ISBN Number(Dashes not Necessary)")
            return;
        }

        axios.get(secondApiUrl)
        .then(response => {
            if(response.data.docs.length === 0){
                setError("Book Not Found")
                return;
            }
            const newBooks = response.data.docs.flatMap(book => {
                return book.editions?.docs?.map(edition=> ({
                    id: uuidv4(),
                    title: book.title,
                    authors: book.author_name || ['Unknown'],
                    coverImage: edition.cover_i ? `http://covers.openlibrary.org/b/id/${edition.cover_i}-M.jpg` : 'placeholder.jpg',
                    ISBNs: edition.isbn || ['Unknown'],
                    rating: 0
                }))
            })
            setBookData(prevBooks => [...prevBooks, ...newBooks]);
            setInput("")
            setError(null)
        })
        .catch(error => {
            console.error('Error getting data from API', error);
            setInput("")
            setError('Error Fetching');
        })
    }

    const handleDelete = (id) => {
        setBookData(prevBooks => prevBooks.filter(book => book.id !== id));
    };

  return (
    <>
      <h1>Book Inventory Manager</h1>
      <div className="search">
        <form onSubmit={handleSubmit}>
          <input
              className="search-input"
              placeholder="ENTER ISBN"
              onChange={(e) => setInput(e.target.value)}
              value={input}
          />
          <button className="search-name" type="submit">
              Add Book
          </button>
        </form>
          {error && <p>{error}</p>}
          {/*{searchResult==true ? error : null}*/}
        <div>
            {bookData?.map((book) => (
                <Card
                key={book.id}
                id={book.id}
                title={book.title}
                authors={book.authors}
                coverImage={book.coverImage}
                ISBNs={book.ISBNs}
                rating={parseInt(book.rating, 10)}
                onDelete={handleDelete}
                />
            ))}
        </div>
      </div>
    </>
  )
}

export default App
