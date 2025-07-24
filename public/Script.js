const movies = {
    upcoming: {
        title: "Pushpa",
        description: "Action-packed thriller",
        price: 300,
        releaseDate: "2024-12-15"
    },
    thriller: {
        title: "Kalki 2898 AD",
        description: "Sci-fi adventure",
        price: 250,
        releaseDate: "2023-06-01"
    },
    action: {
        title: "Avatar",
        description: "Action-packed thriller",
        price: 300,
        releaseDate: "2021-12-25"
    },
    comedy: {
        title: "Aavesham",
        description: "Laugh out loud comedy",
        price: 200,
        releaseDate: "2022-02-10"
    },
    drama: {
        title: "Follow Your Heart",
        description: "Intriguing drama",
        price: 200,
        releaseDate: "2022-05-15"
    }
};

let selectedMovie = "";

// Function to select a movie and proceed to seat selection
function selectMovie(movie) {
    selectedMovie = movie;
    document.getElementById("selected-movie").textContent = movies[movie].title;
    document.getElementById("booking-price").textContent = movies[movie].price;
    document.getElementById("movies").style.display = "none";
    document.getElementById("seats").style.display = "block";
    displaySeats();
}

// Function to go back to the movie selection screen
function goBack() {
    document.getElementById("seats").style.display = "none";
    document.getElementById("movies").style.display = "block";
    selectedMovie = "";
}

// Function to display available seats
function displaySeats() {
    const seatMap = document.getElementById("seat-map");
    seatMap.innerHTML = "";
    const totalSeats = 20;

    for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.textContent = i;
        seat.addEventListener("click", () => {
            seat.classList.toggle("selected");
        });
        seatMap.appendChild(seat);
    }
}

// Function to handle the ticket booking process
// Function to handle the ticket booking process
async function bookTickets() {
    const selectedSeats = document.querySelectorAll(".seat.selected");
    const bookingDate = document.getElementById("booking-date").value;
    const bookingTheater = document.getElementById("booking-theater").value;

    if (selectedSeats.length === 0 || !bookingDate || !bookingTheater) {
        alert("Please select at least one seat and fill in all booking details.");
        return;
    }

    const seatNumbers = Array.from(selectedSeats).map(seat => seat.textContent);
    const bookingDetails = {
        movie: movies[selectedMovie].title,
        date: bookingDate,
        theater: bookingTheater,
        seats: seatNumbers,
        price: movies[selectedMovie].price
    };

    const confirmed = confirm(`Are you sure you want to book ${seatNumbers.length} seat(s) for ${movies[selectedMovie].title} on ${bookingDate} at ${bookingTheater}?`);
    
    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch('/api/book_ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingDetails)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Server Error:', result);
            throw new Error(result.error || `HTTP error! Status: ${response.status}`);
        }

        alert(result.message); // should say "Booking confirmed"
        window.location.reload(); // Reload after success

    } catch (error) {
        console.error('Booking failed:', error);
        alert(`Booking failed. Please try again. Error: ${error.message}`);
    }
}
