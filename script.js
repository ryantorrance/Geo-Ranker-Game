const questionElement = document.getElementById('question');
const itemsElement = document.getElementById('items');
const resultElement = document.getElementById('result');
	resultElement.classList.add('result-message');
const livesCountElement = document.getElementById('lives-count');
const checkButton = document.getElementById('check');
const highestLabel = document.getElementById('highest');
const lowestLabel = document.getElementById('lowest');
const playAgainScreenButton = document.getElementById('play-again-screen');


let currentQuestion = null;
let currentAnswer = null;
let livesRemaining = 4;
let guessedOrders = []; // Array to keep track of guessed orders
let streak = 0;
let highScore = localStorage.getItem('highScoreStreak') || 0;
let sortableInstance = null;
let modalPlayAgainClicked = false;

const streakCountElement = document.getElementById('streak-count');
const streakHighScoreElement = document.getElementById('streak-high-score');

// Display high score when page loads
streakHighScoreElement.textContent = highScore;

const questions = [
  {
  question: 'Rank these cities by elevation from highest to lowest:',
  highest: 'Highest Elevation',
  lowest: 'Lowest Elevation',
  options: ['La Paz', 'Quito', 'Mexico City', 'Kathmandu'],
  answer: ['La Paz', 'Quito', 'Mexico City', 'Kathmandu'],
  metrics: ['3,640m', '2,850m', '2,240m', '1,400m']
},
{
  question: 'Rank these African countries by population from most to least:',
  highest: 'Most Populous',
  lowest: 'Least Populous',
  options: ['Nigeria', 'Ethiopia', 'Egypt', 'South Africa'],
  answer: ['Nigeria', 'Ethiopia', 'Egypt', 'South Africa'],
  metrics: ['223M', '126M', '111M', '60M']
},
{
  question: 'Rank these U.S. states by total area from largest to smallest:',
  highest: 'Largest Area',
  lowest: 'Smallest Area',
  options: ['Alaska', 'Texas', 'California', 'Montana'],
  answer: ['Alaska', 'Texas', 'California', 'Montana'],
  metrics: ['1.72M sq km', '695k sq km', '424k sq km', '381k sq km']
},
{
  question: 'Rank these South American rivers by length from longest to shortest:',
  highest: 'Longest River',
  lowest: 'Shortest River',
  options: ['Amazon', 'Paraná', 'Madeira', 'Orinoco'],
  answer: ['Amazon', 'Paraná', 'Madeira', 'Orinoco'],
  metrics: ['6,400 km', '4,880 km', '3,380 km', '2,140 km']
},
{
  question: 'Rank these countries by number of time zones (including overseas territories):',
  highest: 'Most Time Zones',
  lowest: 'Fewest Time Zones',
  options: ['France', 'United States', 'Russia', 'United Kingdom'],
  answer: ['France', 'Russia', 'United States', 'United Kingdom'],
  metrics: ['12 zones', '11 zones', '9 zones', '9 zones']
},
{
  question: 'Rank these capital cities by population from most to least:',
  highest: 'Most Populated Capital',
  lowest: 'Least Populated Capital',
  options: ['Beijing', 'Tokyo', 'Jakarta', 'Bangkok'],
  answer: ['Tokyo', 'Jakarta', 'Beijing', 'Bangkok'],
  metrics: ['37M', '34M', '21M', '10.5M']
},
{
  question: 'Rank these deserts by area from largest to smallest:',
  highest: 'Largest Desert',
  lowest: 'Smallest Desert',
  options: ['Antarctic', 'Sahara', 'Arabian', 'Gobi'],
  answer: ['Antarctic', 'Sahara', 'Arabian', 'Gobi'],
  metrics: ['14M sq km', '9.2M sq km', '2.3M sq km', '1.3M sq km']
},
{
  question: 'Rank these countries by number of bordering nations from most to least:',
  highest: 'Most Borders',
  lowest: 'Least Borders',
  options: ['Russia', 'China', 'Germany', 'India'],
  answer: ['China', 'Russia', 'Germany', 'India'],
  metrics: ['14 borders', '14 borders', '9 borders', '7 borders']
},
{
  question: 'Rank these countries by GDP (nominal) from highest to lowest:',
  highest: 'Highest GDP',
  lowest: 'Lowest GDP',
  options: ['United States', 'Germany', 'Japan', 'United Kingdom'],
  answer: ['United States', 'Japan', 'Germany', 'United Kingdom'],
  metrics: ['$26.9T', '$4.4T', '$4.3T', '$3.1T']
},
{
  question: 'Rank these European countries by forest cover percentage from highest to lowest:',
  highest: 'Most Forested',
  lowest: 'Least Forested',
  options: ['Finland', 'Sweden', 'Slovenia', 'France'],
  answer: ['Finland', 'Sweden', 'Slovenia', 'France'],
  metrics: ['73%', '69%', '62%', '31%']
},
{
  question: 'Rank these countries by number of islands from most to least:',
  highest: 'Most Islands',
  lowest: 'Fewest Islands',
  options: ['Sweden', 'Finland', 'Indonesia', 'Canada'],
  answer: ['Sweden', 'Finland', 'Canada', 'Indonesia'],
  metrics: ['267,570', '188,000', '52,455', '17,504']
},
{
  question: 'Rank these landlocked countries by population from most to least:',
  highest: 'Most Populous',
  lowest: 'Least Populous',
  options: ['Ethiopia', 'Uzbekistan', 'Afghanistan', 'Chad'],
  answer: ['Ethiopia', 'Afghanistan', 'Uzbekistan', 'Chad'],
  metrics: ['126M', '41M', '36M', '18M']
},
{
  question: 'Rank these cities by average annual rainfall from highest to lowest:',
  highest: 'Most Rainfall',
  lowest: 'Least Rainfall',
  options: ['Mumbai', 'Singapore', 'London', 'Cairo'],
  answer: ['Mumbai', 'Singapore', 'London', 'Cairo'],
  metrics: ['2,200 mm', '2,170 mm', '600 mm', '18 mm']
},
{
  question: 'Rank these countries by number of UNESCO natural sites from most to least:',
  highest: 'Most Natural Sites',
  lowest: 'Least Natural Sites',
  options: ['Australia', 'Brazil', 'Mexico', 'India'],
  answer: ['Australia', 'India', 'Mexico', 'Brazil'],
  metrics: ['13 sites', '10 sites', '9 sites', '7 sites']
},
{
  question: 'Rank these seas by average depth from deepest to shallowest:',
  highest: 'Deepest Sea',
  lowest: 'Shallowest Sea',
  options: ['Caribbean Sea', 'Bering Sea', 'Mediterranean Sea', 'Baltic Sea'],
  answer: ['Caribbean Sea', 'Bering Sea', 'Mediterranean Sea', 'Baltic Sea'],
  metrics: ['2,200m', '1,547m', '1,500m', '55m']
},
{
  question: 'Rank these countries by total number of lakes from most to least:',
  highest: 'Most Lakes',
  lowest: 'Fewest Lakes',
  options: ['Canada', 'Russia', 'India', 'Australia'],
  answer: ['Canada', 'Russia', 'Australia', 'India'],
  metrics: ['879,800+', '200,000+', '14,500+', '3,000+']
},
{
  question: 'Rank these countries by population density from highest to lowest:',
  highest: 'Most Dense',
  lowest: 'Least Dense',
  options: ['Bangladesh', 'South Korea', 'Netherlands', 'United States'],
  answer: ['Bangladesh', 'South Korea', 'Netherlands', 'United States'],
  metrics: ['1,265/km²', '527/km²', '511/km²', '36/km²']
},
{
  question: 'Rank these world regions by number of countries from most to least:',
  highest: 'Most Countries',
  lowest: 'Fewest Countries',
  options: ['Africa', 'Europe', 'Asia', 'Oceania'],
  answer: ['Africa', 'Asia', 'Europe', 'Oceania'],
  metrics: ['54 countries', '49 countries', '44 countries', '16 countries']
},
{
  question: 'Rank these countries by number of volcanoes from most to least:',
  highest: 'Most Volcanoes',
  lowest: 'Least Volcanoes',
  options: ['Indonesia', 'Japan', 'Chile', 'Philippines'],
  answer: ['Indonesia', 'Japan', 'Philippines', 'Chile'],
  metrics: ['127 active', '110 active', '53 active', '40 active']
}
];

function displayQuestion() {
    const index = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[index];
    currentAnswer = [...currentQuestion.options]; // Copy the options array
    currentAnswer.sort(() => Math.random() - 0.5); // Shuffle the answer options

    questionElement.textContent = currentQuestion.question;
    itemsElement.innerHTML = ''; // Clear previous items

    sortableInstance = Sortable.create(itemsElement, {
    animation: 150,
    ghostClass: 'sortable-ghost'
});


    currentAnswer.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.dataset.value = option;
        li.draggable = true;
        itemsElement.appendChild(li);
    });

    resultElement.textContent = '';
    livesCountElement.textContent = livesRemaining;
    checkButton.disabled = false;

    // Set dynamic labels
    highestLabel.textContent = currentQuestion.highest;
    lowestLabel.textContent = currentQuestion.lowest;

    

    if (droppedItem && targetItem) {
        const droppedIndex = Array.from(itemsElement.children).indexOf(droppedItem);
        const targetIndex = Array.from(itemsElement.children).indexOf(targetItem);

        if (droppedIndex > targetIndex) {
            itemsElement.insertBefore(droppedItem, targetItem);
        } else {
            itemsElement.insertBefore(droppedItem, targetItem.nextSibling);
        }

        checkButton.disabled = false;
        resetOrderStyles(); // Reset styles when items are rearranged
    }
}

function checkOrder() {
    const selectedItems = Array.from(itemsElement.children).map(item => item.textContent);

    if (guessedOrders.some(order => arraysEqual(order, selectedItems))) {
        resultElement.textContent = 'You already guessed this. Try a different order.';
        return;
    }

    guessedOrders.push(selectedItems); // Add the new guess to the guessed orders array


    let correctCount = 0;
    selectedItems.forEach((item, index) => {
        if (item === currentQuestion.answer[index]) {
            correctCount++;
        }
    });

    if (arraysEqual(selectedItems, currentQuestion.answer)) {
        resultElement.textContent = 'Correct order!';
        itemsElement.classList.add('correct-order');
        itemsElement.classList.remove('incorrect-order'); // Remove incorrect-order class
        checkButton.disabled = true;
	if (sortableInstance) {
    	sortableInstance.option("disabled", true);
	}
        showResultsModal(true);
	streak++;
	streakCountElement.textContent = streak;


	// Check and update high score
	if (streak > highScore) {
    	highScore = streak;
    	localStorage.setItem('highScoreStreak', highScore);
    	streakHighScoreElement.textContent = highScore;

}

    } else {
        resultElement.textContent = `Incorrect order. ${correctCount}/${currentQuestion.answer.length} correct. Please try again.`;
        itemsElement.classList.add('incorrect-order'); // Add class for incorrect order
        itemsElement.classList.remove('correct-order'); // Remove correct-order class
        livesRemaining--;
        livesCountElement.textContent = livesRemaining;
        if (livesRemaining === 0) {
            resultElement.textContent = 'Game over. You are out of lives.';
            itemsElement.querySelectorAll('li').forEach(li => {
                li.draggable = false;
            });
            checkButton.disabled = true;
	    if (sortableInstance) {
    	    sortableInstance.option("disabled", true);
	}
            showResultsModal(false);
	    streak = 0;
	    streakCountElement.textContent = streak;
        }
    }
}

function resetOrderStyles() {
    itemsElement.classList.remove('incorrect-order'); // Remove incorrect-order class
    itemsElement.querySelectorAll('li').forEach(li => {
        li.style.backgroundColor = ''; // Reset background color
        li.style.borderColor = ''; // Reset border color
    });
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((value, index) => value === b[index]);
}

function showResultsModal(isWin) {
    const modal = document.getElementById('resultsModal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = ''; // Clear previous content
    modal.classList.add('show');

    if (isWin) {
        const winMessage = document.createElement('h2');
        winMessage.textContent = 'Correct!';
        winMessage.classList.add('win-message');
        modalContent.appendChild(winMessage);
    } else {
        const loseMessage = document.createElement('h2');
        loseMessage.textContent = 'Too bad! The correct order was:';
        loseMessage.classList.add('lose-message');
        modalContent.appendChild(loseMessage);
    }

    // Add Highest Label for Correct Order
    const highestLabel = document.createElement('p');
    highestLabel.textContent = currentQuestion.highest;
    highestLabel.classList.add('highest-label');
    modalContent.appendChild(highestLabel);

    const correctOrderList = document.createElement('ul');
    currentQuestion.answer.forEach((option, index) => {
        const li = document.createElement('li');
        li.textContent = `${option}: ${currentQuestion.metrics[index]}`;
        correctOrderList.appendChild(li);
    });
    modalContent.appendChild(correctOrderList);

    // Add Lowest Label for Correct Order
    const lowestLabel = document.createElement('p');
    lowestLabel.textContent = currentQuestion.lowest;
    lowestLabel.classList.add('lowest-label');
    modalContent.appendChild(lowestLabel);

    // Add horizontal dashed line before the Guessed Orders section
    const horizontalLine = document.createElement('hr');
    horizontalLine.style.borderTop = '1px dashed #000';
    horizontalLine.style.marginTop = '10px'; // Add some space above the line
    horizontalLine.style.marginBottom = '10px'; // Add some space below the line
    modalContent.appendChild(horizontalLine);

    // Create a section for guessed orders
    const guessedOrdersSection = document.createElement('div');
    guessedOrdersSection.classList.add('guessed-orders-section');
    const guessedOrdersTitle = document.createElement('h3');
    guessedOrdersTitle.textContent = 'Order of Guesses:';
    guessedOrdersSection.appendChild(guessedOrdersTitle);

    // Add Highest and Lowest Labels for Guessed Orders
    const guessedOrderLabels = document.createElement('div');
    guessedOrderLabels.style.display = 'flex';
    guessedOrderLabels.style.justifyContent = 'space-between';
    guessedOrderLabels.style.marginTop = '10px'; // Space between title and labels

    const lowestGuessedLabel = document.createElement('span');
    lowestGuessedLabel.textContent = currentQuestion.lowest;
    lowestGuessedLabel.classList.add('lowest-label');

    const highestGuessedLabel = document.createElement('span');
    highestGuessedLabel.textContent = currentQuestion.highest;
    highestGuessedLabel.classList.add('highest-label');

    guessedOrderLabels.appendChild(highestGuessedLabel);
    guessedOrderLabels.appendChild(lowestGuessedLabel);
    guessedOrdersSection.appendChild(guessedOrderLabels); // Append labels to the section

    // Add some space below the labels and above the horizontal results
    guessedOrderLabels.style.marginBottom = '10px';

    // Add each guessed order as a horizontal line with numbering
    guessedOrders.forEach((order, index) => {
    const guessedOrderLine = document.createElement('div');
    guessedOrderLine.classList.add('guessed-order-line');


        // Add the number at the start of each guessed order line
        const orderNumber = document.createElement('span');
        orderNumber.classList.add('order-number');
        orderNumber.textContent = `${index + 1}. `;
        guessedOrderLine.appendChild(orderNumber);

        order.forEach((item, i) => {
    const orderItem = document.createElement('span');
    orderItem.classList.add('order-item');
    orderItem.textContent = item;

    if (item === currentQuestion.answer[i]) {
        orderItem.classList.add('correct-item');
    } else {
        orderItem.classList.add('incorrect-item');
    }

    guessedOrderLine.appendChild(orderItem);
});

        guessedOrdersSection.appendChild(guessedOrderLine);
    });

    modalContent.appendChild(guessedOrdersSection);

    modalPlayAgainClicked = false;


    // Close the modal when clicking on the close button
    const closeButton = modal.querySelector('.close');
    closeButton.onclick = function () {
     modal.classList.remove('show');
    if (!modalPlayAgainClicked) {
        playAgainScreenButton.classList.remove('hidden');
    }
    };


    // Close the modal when clicking outside of the modal content
    window.onclick = function (event) {
    if (event.target === modal) {
        modal.classList.remove('show');
        if (!modalPlayAgainClicked) {
            playAgainScreenButton.classList.remove('hidden');
        }
    }
    };


    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.classList.add('play-again-button');
    playAgainButton.onclick = function () {
    modal.classList.remove('show');
    modalPlayAgainClicked = true; // mark that they used the modal CTA
    resetGame();
};

modalContent.appendChild(playAgainButton);
}

function resetGame() {
    document.getElementById('resultsModal').classList.remove('show');
    livesRemaining = 4;
    guessedOrders = [];
    resultElement.textContent = '';
    livesCountElement.textContent = livesRemaining;
    resetOrderStyles();  //This clears background/border styling
    itemsElement.classList.remove('correct-order', 'incorrect-order');  //Also remove group  classes
    displayQuestion();
    if (sortableInstance) {
    sortableInstance.option("disabled", false);
}

}




document.getElementById('check').addEventListener('click', checkOrder);

playAgainScreenButton.addEventListener('click', () => {
    playAgainScreenButton.classList.add('hidden');
    resetGame();
});


displayQuestion();
