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
let modalPlayAgainClicked = false
let usedQuestionIndices = [];


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
  options: ['France', 'United States', 'Russia', 'Canada'],
  answer: ['France', 'Russia', 'United States', 'Canada'],
  metrics: ['12 zones', '11 zones', '9 zones', '6 zones']
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
  metrics: ['879K+', '200K+', '14.5K+', '3K+']
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
},
{
  question: 'Rank these countries by average elevation from highest to lowest:',
  highest: 'Highest Average Elevation',
  lowest: 'Lowest Average Elevation',
  options: ['Bhutan', 'Nepal', 'Afghanistan', 'Switzerland'],
  answer: ['Bhutan', 'Nepal', 'Afghanistan', 'Switzerland'],
  metrics: ['3,280m', '3,265m', '1,884m', '1,654m']
},
{
  question: 'Rank these countries by total railroad mileage from most to least:',
  highest: 'Most Railroad Mileage',
  lowest: 'Least Railroad Mileage',
  options: ['United States', 'China', 'Russia', 'India'],
  answer: ['United States', 'China', 'Russia', 'India'],
  metrics: ['148,500 km', '110,000 km', '87,000 km', '67,000 km']
},
{
  question: 'Rank these countries by paved road length from most to least:',
  highest: 'Most Paved Roads',
  lowest: 'Least Paved Roads',
  options: ['United States', 'India', 'China', 'Brazil'],
  answer: ['United States', 'India', 'China', 'Brazil'],
  metrics: ['4.3M km', '2.7M km', '2.5M km', '1.6M km']
},
{
  question: 'Rank these countries by tallest peak from highest to lowest:',
  highest: 'Tallest Peak',
  lowest: 'Shortest Peak',
  options: ['Nepal', 'Pakistan', 'Argentina', 'Tanzania'],
  answer: ['Nepal', 'Pakistan', 'Argentina', 'Tanzania'],
  metrics: ['Everest: 8,848m', 'K2: 8,611m', 'Aconcagua: 6,961m', 'Kilimanjaro: 5,895m']
},
{
  question: 'Rank these Asian rivers by length from longest to shortest:',
  highest: 'Longest River',
  lowest: 'Shortest River',
  options: ['Yangtze', 'Yellow', 'Ganges', 'Mekong'],
  answer: ['Yangtze', 'Yellow', 'Ganges', 'Mekong'],
  metrics: ['6,300 km', '5,464 km', '2,525 km', '2,200 km']
},
{
  question: 'Rank these rivers in Asia by length from longest to shortest:',
  highest: 'Longest River',
  lowest: 'Shortest River',
  options: ['Yangtze', 'Yellow', 'Indus', 'Amu Darya'],
  answer: ['Yangtze', 'Yellow', 'Indus', 'Amu Darya'],
  metrics: ['6,300 km', '5,464 km', '3,180 km', '2,540 km']
},
{
  question: 'Rank these North American rivers by length from longest to shortest:',
  highest: 'Longest River',
  lowest: 'Shortest River',
  options: ['Missouri', 'Mississippi', 'Yukon', 'Colorado'],
  answer: ['Missouri', 'Mississippi', 'Yukon', 'Colorado'],
  metrics: ['3,767 km', '3,730 km', '3,185 km', '2,330 km']
},
{
  question: 'Rank these European rivers by length from longest to shortest:',
  highest: 'Longest River',
  lowest: 'Shortest River',
  options: ['Volga', 'Danube', 'Ural', 'Dnieper'],
  answer: ['Volga', 'Danube', 'Ural', 'Dnieper'],
  metrics: ['3,530 km', '2,860 km', '2,428 km', '2,290 km']
},
{
  question: 'Rank these countries by percentage of residents who are non-citizens from highest to lowest:',
  highest: 'Most Non-Citizens',
  lowest: 'Fewest Non-Citizens',
  options: ['United Arab Emirates', 'Qatar', 'Switzerland', 'Germany'],
  answer: ['United Arab Emirates', 'Qatar', 'Switzerland', 'Germany'],
  metrics: ['88%', '75%', '25%', '12%']
},
{
  question: 'Rank these countries by estimated lithium reserves from most to least:',
  highest: 'Most Lithium',
  lowest: 'Least Lithium',
  options: ['Chile', 'Australia', 'Argentina', 'China'],
  answer: ['Chile', 'Australia', 'Argentina', 'China'],
  metrics: ['9.3M tons', '6.2M tons', '2.7M tons', '2.0M tons']
},
{
  question: 'Rank these regions by number of major mountain ranges from most to least:',
  highest: 'Most Mountain Ranges',
  lowest: 'Least Mountain Ranges',
  options: ['Asia', 'South America', 'Europe', 'Africa'],
  answer: ['Asia', 'South America', 'Europe', 'Africa'],
  metrics: ['~15 ranges', '~10 ranges', '~8 ranges', '~6 ranges']
},
{
  question: 'Rank these US states by vertical relief (difference in elevation) from greatest to smallest:',
  highest: 'Greatest Elevation Difference',
  lowest: 'Smallest Elevation Difference',
  options: ['Alaska', 'California', 'Colorado', 'Florida'],
  answer: ['Alaska', 'California', 'Colorado', 'Florida'],
  metrics: ['6,000m', '4,300m', '2,900m', '105m']
},
{
  question: 'Rank these US states by average annual rainfall from most to least:',
  highest: 'Most Rainfall',
  lowest: 'Least Rainfall',
  options: ['Hawaii', 'Louisiana', 'Washington', 'Nevada'],
  answer: ['Hawaii', 'Louisiana', 'Washington', 'Nevada'],
  metrics: ['63.7 in', '60.1 in', '38.4 in', '9.5 in']
},
{
  question: 'Rank these countries by average annual rainfall from most to least:',
  highest: 'Most Rainfall',
  lowest: 'Least Rainfall',
  options: ['Colombia', 'Malaysia', 'Indonesia', 'Egypt'],
  answer: ['Colombia', 'Malaysia', 'Indonesia', 'Egypt'],
  metrics: ['3,240 mm', '2,875 mm', '2,702 mm', '51 mm']
},
{
  question: 'Rank these US states by average annual temperature from warmest to coolest:',
  highest: 'Warmest',
  lowest: 'Coolest',
  options: ['Florida', 'Texas', 'California', 'Alaska'],
  answer: ['Florida', 'Texas', 'California', 'Alaska'],
  metrics: ['71°F', '65°F', '59°F', '26°F']
},
{
  question: 'Rank these US states by average annual snowfall from most to least:',
  highest: 'Most Snowfall',
  lowest: 'Least Snowfall',
  options: ['Vermont', 'New York', 'Colorado', 'Texas'],
  answer: ['Vermont', 'New York', 'Colorado', 'Texas'],
  metrics: ['89.2 in', '62.7 in', '60.3 in', '1.1 in']
},
{
  question: 'Rank these countries by average annual sunshine (days) from most to least:',
  highest: 'Most Sunny Days',
  lowest: 'Least Sunny Days',
  options: ['Egypt', 'Australia', 'Spain', 'Germany'],
  answer: ['Egypt', 'Australia', 'Spain', 'Germany'],
  metrics: ['365 days', '280 days', '250 days', '150 days']
},
{
  question: 'Rank these countries by average annual air pollution (PM2.5) from most to least:',
  highest: 'Most Polluted',
  lowest: 'Least Polluted',
  options: ['India', 'Bangladesh', 'Pakistan', 'United States'],
  answer: ['Bangladesh', 'Pakistan', 'India', 'United States'],
  metrics: ['77.1 µg/m³', '59.0 µg/m³', '58.1 µg/m³', '8.0 µg/m³']
},
{
  question: 'Rank these countries by the number of official languages from most to least:',
  highest: 'Most Official Languages',
  lowest: 'Fewest Official Languages',
  options: ['South Africa', 'Switzerland', 'India', 'Canada'],
  answer: ['India', 'South Africa', 'Switzerland', 'Canada'],
  metrics: ['22', '11', '4', '2']
},
{
  question: 'Rank these lakes by surface area from largest to smallest:',
  highest: 'Largest Lake',
  lowest: 'Smallest Lake',
  options: ['Caspian Sea', 'Lake Superior', 'Lake Victoria', 'Lake Huron'],
  answer: ['Caspian Sea', 'Lake Superior', 'Lake Huron', 'Lake Victoria'],
  metrics: ['371,000 km²', '82,100 km²', '59,600 km²', '57,800 km²']
},
{
  question: 'Rank these countries by renewable energy production from highest to lowest:',
  highest: 'Most Renewable Energy',
  lowest: 'Least Renewable Energy',
  options: ['China', 'United States', 'Brazil', 'Germany'],
  answer: ['China', 'United States', 'Brazil', 'Germany'],
  metrics: ['2,480 TWh', '1,300 TWh', '600 TWh', '230 TWh']
},
{
  question: 'Rank these capital cities by founding date from oldest to newest:',
  highest: 'Oldest Capital',
  lowest: 'Newest Capital',
  options: ['Athens', 'Beijing', 'London', 'Washington D.C.'],
  answer: ['Athens', 'Beijing', 'London', 'Washington D.C.'],
  metrics: ['c. 1400 BCE', '1045 BCE', '43 CE', '1790 CE']
},
{
  question: 'Rank these capital cities by distance from the equator from closest to farthest:',
  highest: 'Closest to Equator',
  lowest: 'Farthest from Equator',
  options: ['Singapore', 'Kampala', 'Canberra', 'Helsinki'],
  answer: ['Kampala', 'Singapore', 'Canberra', 'Helsinki'],
  metrics: ['0.3°N', '1.3°N', '35.3°S', '60.2°N']
}
];

function displayQuestion() {
    // If all questions have been used, reset
    if (usedQuestionIndices.length === questions.length) {
        usedQuestionIndices = [];
    }

    let index;
    do {
        index = Math.floor(Math.random() * questions.length);
    } while (usedQuestionIndices.includes(index));

    usedQuestionIndices.push(index);

    currentQuestion = questions[index];
    currentAnswer = [...currentQuestion.options];
    currentAnswer.sort(() => Math.random() - 0.5);

    questionElement.textContent = currentQuestion.question;
    itemsElement.innerHTML = '';

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

    highestLabel.textContent = currentQuestion.highest;
    lowestLabel.textContent = currentQuestion.lowest;
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
	checkButton.disabled = true;
	checkButton.classList.add('hidden');
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
	    checkButton.disabled = true;
	    checkButton.classList.add('hidden');

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
    modal.scrollTop = 0; // ensures internal scroll starts at top
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scrolls the whole page to the top


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


    const closeButton = modal.querySelector('.close');
    closeButton.onclick = function () {
  modal.classList.remove('show');
  checkButton.classList.add('hidden'); // Hide Check Order
  playAgainScreenButton.classList.remove('hidden'); // Show Play Again
    };

    window.onclick = function (event) {
  if (event.target === modal) {
    modal.classList.remove('show');
    checkButton.classList.add('hidden'); // Hide Check Order
    playAgainScreenButton.classList.remove('hidden'); // Show Play Again
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
	checkButton.classList.remove('hidden');
	checkButton.disabled = false;
	playAgainScreenButton.classList.add('hidden');
}

document.getElementById('check').addEventListener('click', checkOrder);

playAgainScreenButton.addEventListener('click', () => {
    playAgainScreenButton.classList.add('hidden');
    resetGame();
});


displayQuestion();

