const questionElement = document.getElementById('question');
const itemsElement = document.getElementById('items');
const resultElement = document.getElementById('result');
	resultElement.classList.add('result-message');
const livesCountElement = document.getElementById('lives-count');
const checkButton = document.getElementById('check');
const highestLabel = document.getElementById('highest');
const lowestLabel = document.getElementById('lowest');

let currentQuestion = null;
let currentAnswer = null;
let livesRemaining = 4;
let guessedOrders = []; // Array to keep track of guessed orders

const questions = [
  {
    question: 'Rank these continents by population from most to least:',
    highest: 'Most Populated',
    lowest: 'Least Populated',
    options: ['Asia', 'Africa', 'Europe', 'South America'],
    answer: ['Asia', 'Africa', 'Europe', 'South America'],
    metrics: ['4.7B', '1.3B', '746M', '430M']
  },
  {
    question: 'Rank these countries by total area from largest to smallest:',
    highest: 'Largest Area',
    lowest: 'Smallest Area',
    options: ['Russia', 'Canada', 'China', 'United States'],
    answer: ['Russia', 'Canada', 'China', 'United States'],
    metrics: ['17.1M sq km', '9.98M sq km', '9.6M sq km', '9.5M sq km']
  },
  {
    question: 'Rank these countries by population from largest to smallest:',
    highest: 'Most Populous',
    lowest: 'Least Populous',
    options: ['China', 'India', 'United States', 'Indonesia'],
    answer: ['China', 'India', 'United States', 'Indonesia'],
    metrics: ['1.4B', '1.39B', '331M', '273M']
  },
  {
    question: 'Rank these countries by coastline length from longest to shortest:',
    highest: 'Longest Coastline',
    lowest: 'Shortest Coastline',
    options: ['Canada', 'Indonesia', 'Russia', 'Norway'],
    answer: ['Canada', 'Indonesia', 'Russia', 'Norway'],
    metrics: ['202,080 km', '54,716 km', '37,653 km', '25,148 km']
  },
  {
    question: 'Rank these countries by number of international land borders from most to least:',
    highest: 'Most Borders',
    lowest: 'Least Borders',
    options: ['China', 'Russia', 'Brazil', 'United States'],
    answer: ['China', 'Russia', 'Brazil', 'United States'],
    metrics: ['15 borders', '14 borders', '10 borders', '2 borders']
  },
  {
    question: 'Rank these countries by percentage of land area covered by forest from highest to lowest:',
    highest: 'Most Forested',
    lowest: 'Least Forested',
    options: ['Canada', 'Russia', 'United States', 'Brazil'],
    answer: ['Canada', 'Russia', 'United States', 'Brazil'],
    metrics: ['38%', '35%', '33.9%', '33%']
  },
  {
    question: 'Rank these mountain ranges by average elevation from highest to lowest:',
    highest: 'Highest Average Elevation',
    lowest: 'Lowest Average Elevation',
    options: ['Himalayas', 'Andes', 'Alps', 'Rocky Mountains'],
    answer: ['Himalayas', 'Andes', 'Alps', 'Rocky Mountains'],
    metrics: ['6,100m', '4,000m', '2,900m', '2,000m']
  },
  {
    question: 'Rank these countries by number of UNESCO World Heritage Sites from most to least:',
    highest: 'Most World Heritage Sites',
    lowest: 'Least World Heritage Sites',
    options: ['Italy', 'China', 'Germany', 'Spain'],
    answer: ['Italy', 'China', 'Germany', 'Spain'],
    metrics: ['58 sites', '56 sites', '51 sites', '49 sites']
  },
  {
    question: 'Rank these countries by number of active volcanoes from most to least:',
    highest: 'Most Active Volcanoes',
    lowest: 'Least Active Volcanoes',
    options: ['United States', 'Indonesia', 'Russia', 'Japan'],
    answer: ['United States', 'Indonesia', 'Russia', 'Japan'],
    metrics: ['173 volcanoes', '127 volcanoes', '120 volcanoes', '110 volcanoes']
  },
  {
    question: 'Rank these countries by agricultural land area from largest to smallest:',
    highest: 'Largest Agricultural Land',
    lowest: 'Smallest Agricultural Land',
    options: ['United States', 'China', 'Australia', 'Brazil'],
    answer: ['United States', 'China', 'Australia', 'Brazil'],
    metrics: ['442M hectares', '525M hectares', '427M hectares', '258M hectares']
  },
  {
    question: 'Rank these rivers by length from longest to shortest:',
    highest: 'Longest River',
    lowest: 'Shortest River',
    options: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'],
    answer: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'],
    metrics: ['6,650 km', '6,400 km', '6,300 km', '3,730 km']
  },
  {
    question: 'Rank these countries by total renewable water resources from most to least:',
    highest: 'Most Renewable Water Resources',
    lowest: 'Least Renewable Water Resources',
    options: ['Brazil', 'Russia', 'Canada', 'United States'],
    answer: ['Brazil', 'Russia', 'Canada', 'United States'],
    metrics: ['8,233 km³', '4,508 km³', '2,902 km³', '2,818 km³']
  },
  {
    question: 'Rank these lakes by depth from deepest to shallowest:',
    highest: 'Deepest',
    lowest: 'Shallowest',
    options: ['Baikal', 'Tanganyika', 'Caspian Sea', 'Victoria'],
    answer: ['Baikal', 'Tanganyika', 'Caspian Sea', 'Victoria'],
    metrics: ['1,642m', '1,470m', '1,025m', '83m']
  },
  {
    question: 'Rank these mountains by elevation from highest to lowest:',
    highest: 'Highest Elevation',
    lowest: 'Lowest Elevation',
    options: ['Everest', 'K2', 'Kangchenjunga', 'Lhotse'],
    answer: ['Everest', 'K2', 'Kangchenjunga', 'Lhotse'],
    metrics: ['8,848m', '8,611m', '8,586m', '8,516m']
  },
  {
    question: 'Rank these deserts by area from largest to smallest:',
    highest: 'Largest Area',
    lowest: 'Smallest Area',
    options: ['Sahara', 'Arabian', 'Gobi', 'Kalahari'],
    answer: ['Sahara', 'Arabian', 'Gobi', 'Kalahari'],
    metrics: ['9.2M sq km', '2.3M sq km', '1.3M sq km', '0.9M sq km']
  },
  {
    question: 'Rank these islands by population from most to least:',
    highest: 'Most Populated',
    lowest: 'Least Populated',
    options: ['Java', 'Honshu', 'Great Britain', 'Luzon'],
    answer: ['Java', 'Honshu', 'Great Britain', 'Luzon'],
    metrics: ['145M', '104M', '68M', '64M']
  },
  {
    question: 'Rank these oceans by size from largest to smallest:',
    highest: 'Largest Ocean',
    lowest: 'Smallest Ocean',
    options: ['Pacific', 'Atlantic', 'Indian', 'Southern'],
    answer: ['Pacific', 'Atlantic', 'Indian', 'Southern'],
    metrics: ['168M sq km', '85M sq km', '70M sq km', '21M sq km']
  },
  {
    question: 'Rank these cities by population from most to least:',
    highest: 'Most Populated',
    lowest: 'Least Populated',
    options: ['Tokyo', 'Delhi', 'Shanghai', 'São Paulo'],
    answer: ['Tokyo', 'Delhi', 'Shanghai', 'São Paulo'],
    metrics: ['37M', '31M', '27M', '22M']
  },
  {
    question: 'Rank these continents by land area from largest to smallest:',
    highest: 'Largest Land Area',
    lowest: 'Smallest Land Area',
    options: ['Asia', 'Africa', 'North America', 'South America'],
    answer: ['Asia', 'Africa', 'North America', 'South America'],
    metrics: ['44.5M sq km', '30.2M sq km', '24.7M sq km', '17.8M sq km']
  },
  {
    question: 'Rank these US states by population from most to least:',
    highest: 'Most Populated',
    lowest: 'Least Populated',
    options: ['California', 'Texas', 'Florida', 'New York'],
    answer: ['California', 'Texas', 'Florida', 'New York'],
    metrics: ['39M', '29M', '21M', '19M']
  }
];



function displayQuestion() {
    const index = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[index];
    currentAnswer = [...currentQuestion.options]; // Copy the options array
    currentAnswer.sort(() => Math.random() - 0.5); // Shuffle the answer options

    questionElement.textContent = currentQuestion.question;
    itemsElement.innerHTML = ''; // Clear previous items

    Sortable.create(itemsElement, {
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
        showResultsModal(true);
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
            showResultsModal(false);
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

        order.forEach(item => {
            const orderItem = document.createElement('span');
            orderItem.classList.add('order-item');
            orderItem.textContent = item;
            guessedOrderLine.appendChild(orderItem);
        });
        guessedOrdersSection.appendChild(guessedOrderLine);
    });

    modalContent.appendChild(guessedOrdersSection);

    modal.style.display = 'block';

    // Close the modal when clicking on the close button
    const closeButton = modal.querySelector('.close');
    closeButton.onclick = function () {
        modal.style.display = 'none';
    };

    // Close the modal when clicking outside of the modal content
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}




document.getElementById('check').addEventListener('click', checkOrder);

displayQuestion();
