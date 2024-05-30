import './Ratings.css';

const Ratings = ({ value, onChange }) => {
    const handleStarClick = (index) => {
        const newRating = index === value - 1 ? 0 : index + 1;
        onChange(newRating);
    };

    return (
        <div className="rating">
            {[...Array(5)].map((_, index) => (
                <span
                    key={index}
                    className={`star ${index < value ? 'filled' : ''}`}
                    onClick={() => handleStarClick(index)}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
};

export default Ratings;

