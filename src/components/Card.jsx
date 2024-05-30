import './Card.css'; // Make sure to create a corresponding CSS file
import Ratings from './Ratings.jsx';
import {useState, useEffect} from "react";

const Card = ({ id, title, authors, coverImage, ISBNs, rating, onDelete }) => {
    const [localRating, setLocalRating] = useState(rating);

    useEffect(() => {
        setLocalRating(rating);
    }, [rating]);

    const handleRatingChange = (newRating) => {
        setLocalRating(newRating);
        updateLocalStorageRating(id, newRating);
    };

    const updateLocalStorageRating = (bookId, newRating) => {
        const storedBooks = JSON.parse(localStorage.getItem('bookData'));
        const updatedBooks = storedBooks.map(book =>
            book.id === bookId ? { ...book, rating: newRating.toString() } : book
        );
        localStorage.setItem('bookData', JSON.stringify(updatedBooks));
    };

    return (
        <div className="card">
            <img src={coverImage} alt={`${title} cover`} className="card-image" />
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <h4>Authors</h4>
                {authors?.map((author, index) => (
                    <p key={index}>{author}</p>
                ))}
                <h4>ISBNs</h4>
                {ISBNs?.map((isbn, index) => (
                    <p key={index}>{isbn}</p>
                ))}
                <Ratings value={localRating} onChange={handleRatingChange}/>
                <button onClick={()=> onDelete(id)}>Delete</button>
            </div>
        </div>
    );
};

export default Card;