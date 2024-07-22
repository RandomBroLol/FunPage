document.addEventListener('DOMContentLoaded', () => {
    const changeColorBtn = document.getElementById('changeColorBtn');
    const showMessageBtn = document.getElementById('showMessageBtn');
    const changeTextColorBtn = document.getElementById('changeTextColorBtn');
    const getJokeBtn = document.getElementById('getJokeBtn');
    const messageDiv = document.getElementById('message');
    const jokeDiv = document.getElementById('joke');
    const ipAddressDiv = document.getElementById('ipAddress');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Fetch and display IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            ipAddressDiv.textContent = `Your IP Address: ${data.ip}`;
            
            // Send IP address to the server
            fetch('/log-ip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ip: data.ip })
            })
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to log IP address');
                }
            })
            .catch(error => console.error('Error logging IP address:', error));
        })
        .catch(error => {
            ipAddressDiv.textContent = 'Unable to fetch IP Address';
            console.error('Error fetching IP address:', error);
        });

    // Change background color
    changeColorBtn.addEventListener('click', () => {
        document.body.style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    });

    // Show surprise message
    showMessageBtn.addEventListener('click', () => {
        messageDiv.classList.toggle('hidden');
    });

    // Change text color
    changeTextColorBtn.addEventListener('click', () => {
        const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#FF69B4'];
        document.querySelector('h1').style.color = colors[Math.floor(Math.random() * colors.length)];
    });

    // Get a random joke
    getJokeBtn.addEventListener('click', () => {
        fetch('https://official-joke-api.appspot.com/random_joke')
            .then(response => response.json())
            .then(data => {
                jokeDiv.textContent = `${data.setup} - ${data.punchline}`;
                jokeDiv.classList.remove('hidden');
            })
            .catch(error => {
                jokeDiv.textContent = 'Error fetching joke';
                console.error('Error fetching joke:', error);
            });
    });

    // Canvas animation
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function draw(e) {
        ctx.fillStyle = 'rgba(0, 150, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(e.clientX, e.clientY, 20, 0, Math.PI * 2, false);
        ctx.fill();
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', draw);
    resizeCanvas();

    // Game logic for Guess the Number
    const guessInput = document.getElementById('guessInput');
    const guessBtn = document.getElementById('guessBtn');
    const gameMessage = document.getElementById('gameMessage');

    let secretNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    guessBtn.addEventListener('click', () => {
        const userGuess = parseInt(guessInput.value, 10);
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            gameMessage.textContent = 'Please enter a number between 1 and 100.';
            gameMessage.style.color = '#dc3545'; // Red for error
            return;
        }

        attempts++;
        if (userGuess === secretNumber) {
            gameMessage.textContent = `Congratulations! You guessed the number ${secretNumber} in ${attempts} attempts.`;
            gameMessage.style.color = '#28a745'; // Green for success
            resetGame();
        } else if (userGuess < secretNumber) {
            gameMessage.textContent = 'Too low! Try again.';
            gameMessage.style.color = '#ffc107'; // Yellow for hint
        } else {
            gameMessage.textContent = 'Too high! Try again.';
            gameMessage.style.color = '#ffc107'; // Yellow for hint
        }
    });

    function resetGame() {
        secretNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        guessInput.value = '';
    }
});
