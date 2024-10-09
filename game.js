const result = document.getElementById("result");
const SYMBOLS_COUNT = {
    R: 20,
    B: 10,
    Y: 10,
    O: 20,
};

let intervalId; // Store the interval ID
let balanceResult = 30; // Initial balance

// Function to get symbols based on counts
const symbols = () => {
    const symbolsArray = [];
    for (const [value, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbolsArray.push(value);
        }
    }
    return symbolsArray;
};

// Function to determine the color based on the symbol
const colorOfTheElement = (symbol) => {
    switch (symbol) {
        case "R":
            return "#FF0000"; // Red
        case "B":
            return "#0000FF"; // Blue
        case "Y":
            return "#FFFF00"; // Yellow
        case "O":
            return "#FFA500"; // Orange
        default:
            return "#000000"; // Default color (Black)
    }
};

// Function to spin and get a random symbol
const spin = (symbolsArray) => {
    const symbolIndex = Math.floor(Math.random() * symbolsArray.length);
    const randomValue = symbolsArray[symbolIndex];
    symbolsArray.splice(symbolIndex, 1); // Remove the used symbol
    return randomValue;
};

// Function to count matching columns in a matrix based on selected color
const countMatchingColumns = (matrix, selectedColor) => {
    // console.log(matrix);
    // console.log(selectedColor);
    let matches = 0;
    const columnCount = matrix[0].length; // Number of columns

    for (let col = 0; col < columnCount; col++) {
        let allEqualAndColor = true;

        for (let row = 0; row < matrix.length; row++) {
            if (matrix[row][col] !== selectedColor) {
                allEqualAndColor = false; // If any color doesn't match selected color
                break; // No need to check further
            }
        }

        if (allEqualAndColor) {
            matches += 1; // Count matching column
        }
    }

    return matches;
};

// Function to update the balance display
function updateBalanceDisplay() {
    const balanceElement = document.getElementById("balance");
    balanceElement.innerHTML = `<h1>Balance: $${balanceResult}</h1>`;
}


let selectedLines = 0;

// Function to update selected value display and set the selected number of lines
const updateSelectedValue = () => {
    const selectedLineElement = document.querySelector('input[name="betLines"]:checked');
    selectedLines = selectedLineElement ? parseInt(selectedLineElement.value, 10) : 0;
    const selectedValueElement = document.getElementById("selectedValue");
    selectedValueElement.textContent = selectedLineElement
        ? `Selected value: ${selectedLineElement.value}`
        : "No selection made.";
};


// Add event listeners to radio buttons
const radioButtons = document.querySelectorAll('input[name="betLines"]');
const colorBet = document.getElementById("colorBet");

const placeBet = document.getElementById("placeBet");
const AddSub = document.getElementById("AddSub");
const deposit = document.getElementById("deposit");
const rules = document.getElementById("rules");
const sec3 = document.getElementById("sec3");
const cross = document.getElementById("cross");

radioButtons.forEach((radio) => {
    radio.addEventListener("change", updateSelectedValue);
    radio.addEventListener("click", () => {
        colorBet.style.display = "block";
    });
});

const clrBtn = document.querySelectorAll("#clrBtn"); // Select buttons by class
const showSelectedColor = document.getElementById("show");
let selectedColor = null;

clrBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        selectedColor = btn.value; // Access button value
        showSelectedColor.innerText = `Clicked button: ${selectedColor}`;
        placeBet.style.display = "block";
    });
});

AddSub.addEventListener("click", () => {
    deposit.style.display = "block";
});
rules.addEventListener("click", () => {
    sec3.style.display = "block";
});
cross.addEventListener("click", () => {
    sec3.style.display = "none";
});

// Initial display
updateBalanceDisplay();

// Event listener for the deposit button
const dSub = document.getElementById("dSub");
dSub.addEventListener("click", () => {
    const depositInput = document.getElementById("depositAmount");
    const depositAmount = parseFloat(depositInput.value);

    // Validate input
    if (!isNaN(depositAmount) && depositAmount > 0) {
        balanceResult += depositAmount;
        updateBalanceDisplay();
        depositInput.value = "";

        // Clear the input field
    } else {
        alert("Please enter a valid deposit amount.");
    }
    deposit.style.display = "none";
});

const playBtn = document.getElementById("playBtn");
const resultInfo = document.getElementById("ResultInfo");

let currentBet = 0;

// Function to hide betting options
const hideBettingOptions = () => {
    colorBet.style.display = "none";
    placeBet.style.display = "none";
};

// Function to show betting options
const showBettingOptions = () => {
    colorBet.style.display = "block";
    placeBet.style.display = "block";
    bettingAmountOnLine.value = "";
};


// Play button functionality
playBtn.addEventListener("click", () => {
    const betAmount = parseFloat(
        document.getElementById("bettingAmountOnLine").value
    );
    const timerElement = document.getElementById("timer");
    const timeLeft = parseInt(timerElement.textContent);

    // Check if betting is allowed based on time left
    if (timeLeft <= 2) {
        alert("Betting is closed for this round. Please wait for the next round.");
        return;
    }

    // Validate bet amount and balance
    if (!isNaN(betAmount) && betAmount > 0 && balanceResult >= betAmount) {
        balanceResult -= betAmount; // Deduct bet from balance
        currentBet = betAmount; // Store current bet for outcome calculation
        updateBalanceDisplay(); // Update balance display
        resultInfo.textContent = "Game has started! Waiting for results...";

        // Hide betting options after placing the bet
        hideBettingOptions();
    } else {
        alert("Please enter a valid bet amount that is within your balance.");
    }
});

// Function to refresh symbols and calculate winnings after each round
const refreshSymbols = () => {
    let won = 0;
    result.innerHTML = "";
    const matrixArray = [];

    // Generate and display new symbols in a 3x3 grid
    for (let i = 0; i < 3; i++) {
        let innerMatrix = [];
        for (let j = 0; j < 3; j++) {
            const randomSymbol = spin(symbols());
            innerMatrix.push(randomSymbol);
            const span = document.createElement("span");
            span.textContent = randomSymbol;
            span.style.background = colorOfTheElement(randomSymbol);
            span.style.margin = "5px";
            result.appendChild(span);
        }
        matrixArray.push(innerMatrix);
    }

    won += countMatchingColumns(matrixArray, selectedColor);

    // Calculate winnings and update balance if there were wins
    if (currentBet > 0) {
        // Calculate winnings based on the selected lines and the actual number of matched lines
        if (won > 0) {
            // Limit the number of winnings to the selected number of lines
            const applicableMatches = Math.min(won, selectedLines); // User can win only up to the selected number of lines

            // Calculate the winnings based on applicable matches
            const winnings = applicableMatches * currentBet * 2; // Multiply by applicable matches directly
            balanceResult += winnings; // Add winnings to balance

            updateBalanceDisplay();

            resultInfo.textContent = `Result: ${won} lines matched, but you get paid for ${applicableMatches} lines. You won $${winnings.toFixed(2)}! Place a new bet!`;
        } else {
            resultInfo.textContent = "No wins this round. Try again!";
        }


    } else {
        resultInfo.textContent = "No wins this round. Try again!";
    }

    currentBet = 0; // Reset current bet for the next round

    // Show betting options for the next round
    showBettingOptions();
};

// Timer to refresh symbols and trigger next round after 15 seconds
const startTimer = () => {
    const timerElement = document.getElementById("timer");
    let seconds = 15;

    intervalId = setInterval(() => {
        seconds--;

        if (seconds < 0) {
            clearInterval(intervalId); // Stop the timer
            refreshSymbols(); // Refresh symbols and determine outcome
            startTimer(); // Restart the timer
        } else {
            timerElement.textContent = seconds;
        }
    }, 1000); // Update every second
};

// Initial display setup and timer start
updateBalanceDisplay();
startTimer();
refreshSymbols();