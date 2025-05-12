const questionElement = document.getElementById('question');
const itemsElement = document.getElementById('items');
const resultElement = document.getElementById('result');
	resultElement.classList.add('result-message');
const checkButton = document.getElementById('check');
const highestLabel = document.getElementById('highest');
const lowestLabel = document.getElementById('lowest');
const playAgainScreenButton = document.getElementById('play-again-screen');
const modeSwitch = document.getElementById('mode-switch');
const easyLabel = document.getElementById('easy-label');
const hardLabel = document.getElementById('hard-label');
const livesContainer = document.getElementById('lives');


let currentQuestion = null;
let currentAnswer = null;
let livesRemaining = 5;
let guessedOrders = []; // Array to keep track of guessed orders
let streak = 0;
let highScore = localStorage.getItem('highScoreStreak') || 0;
let sortableInstance = null;
let modalPlayAgainClicked = false
let usedQuestionIndices = [];
let finalStreak = 0;
let lastResultWasWin = false;
let isEasyMode = false;
let pendingModeChange = null; // new global flag


if (modeSwitch.checked) {
    // Hard mode is active
    hardLabel.classList.add('active');
    easyLabel.classList.remove('active');
} else {
    // Easy mode is active
    easyLabel.classList.add('active');
    hardLabel.classList.remove('active');
}


modeSwitch.addEventListener('change', (e) => {
  e.preventDefault(); // prevent actual toggle
  pendingModeChange = !modeSwitch.checked; // store intended state
  document.getElementById('modeConfirmModal').style.display = 'flex'; // show modal
});

// Confirm button action
document.getElementById('confirmModeChange').addEventListener('click', () => {
  isEasyMode = pendingModeChange;
  modeSwitch.checked = !isEasyMode;

  if (isEasyMode) {
    easyLabel.classList.add('active');
    hardLabel.classList.remove('active');
    livesContainer.style.display = 'none';
  } else {
    hardLabel.classList.add('active');
    easyLabel.classList.remove('active');
    livesContainer.style.display = 'block';
    livesRemaining = 5;
    updateHearts();
  }

  streak = 0;
  streakCountElement.textContent = streak;
  guessedOrders = [];
  document.getElementById('modeConfirmModal').style.display = 'none';
  resetGame();
});

// Cancel button (X)
document.getElementById('cancelModeChange').addEventListener('click', () => {
  modeSwitch.checked = isEasyMode ? false : true;

  document.getElementById('modeConfirmModal').style.display = 'none';
});


function updateHearts() {
  const livesHearts = document.getElementById('lives-hearts');
  livesHearts.innerHTML = '❤️'.repeat(livesRemaining) + '&nbsp;'.repeat(5 - livesRemaining);
}

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
  metrics: ['c. 1400 BC', '1045 BC', '43 AD', '1790 AD']
},
{
  question: 'Rank these capital cities by distance from the equator from closest to farthest:',
  highest: 'Closest to Equator',
  lowest: 'Farthest from Equator',
  options: ['Singapore', 'Kampala', 'Canberra', 'Helsinki'],
  answer: ['Kampala', 'Singapore', 'Canberra', 'Helsinki'],
  metrics: ['0.3°N', '1.3°N', '35.3°S', '60.2°N']
},
{
  question: 'Rank these capital cities by elevation from highest to lowest:',
  highest: 'Highest Elevation',
  lowest: 'Lowest Elevation',
  options: ['La Paz', 'Quito', 'Thimphu', 'Kampala'],
  answer: ['La Paz', 'Quito', 'Thimphu', 'Kampala'],
  metrics: ['3,640m', '2,850m', '2,648m', '1,189m']
},
{
  question: 'Rank these capital cities by average annual rainfall from most to least:',
  highest: 'Most Rainfall',
  lowest: 'Least Rainfall',
  options: ['Monrovia', 'Singapore', 'Wellington', 'Madrid'],
  answer: ['Monrovia', 'Singapore', 'Wellington', 'Madrid'],
  metrics: ['5,100mm', '2,340mm', '1,200mm', '436mm']
},
{
  question: 'Rank these capital cities by area from largest to smallest:',
  highest: 'Largest Area',
  lowest: 'Smallest Area',
  options: ['Brasília', 'Beijing', 'Tokyo', 'Paris'],
  answer: ['Beijing', 'Brasília', 'Tokyo', 'Paris'],
  metrics: ['16,410 sq km', '5,802 sq km', '2,194 sq km', '105 sq km']
},
{
  question: 'Rank these capital cities by number of UNESCO World Heritage Sites within the city:',
  highest: 'Most UNESCO Sites',
  lowest: 'Fewest UNESCO Sites',
  options: ['Rome', 'Istanbul', 'Kyiv', 'Mexico City'],
  answer: ['Rome', 'Istanbul', 'Mexico City', 'Kyiv'],
  metrics: ['4', '3', '2', '1']
},
{
  question: 'Rank these countries by Human Development Index (HDI) from highest to lowest:',
  highest: 'Highest HDI',
  lowest: 'Lowest HDI',
  options: ['Norway', 'Germany', 'Mexico', 'Nigeria'],
  answer: ['Norway', 'Germany', 'Mexico', 'Nigeria'],
  metrics: ['0.961', '0.942', '0.758', '0.535']
},
{
  question: 'Rank these countries by total vineyard acreage:',
  highest: 'Most Vineyard Land',
  lowest: 'Least Vineyard Land',
  options: ['Spain', 'France', 'Italy', 'United States'],
  answer: ['Spain', 'France', 'Italy', 'United States'],
  metrics: ['960K hectares', '790K hectares', '720K hectares', '420K hectares']
},
{
  question: 'Rank these countries by percentage of land below sea level:',
  highest: 'Most Below Sea Level',
  lowest: 'Least Below Sea Level',
  options: ['Netherlands', 'Egypt', 'United States', 'Bangladesh'],
  answer: ['Netherlands', 'Bangladesh', 'Egypt', 'United States'],
  metrics: ['26%', '10%', '6%', '<0.1%']
},
{
  question: 'Rank these islands by land area from largest to smallest:',
  highest: 'Largest Island',
  lowest: 'Smallest Island',
  options: ['Greenland', 'New Guinea', 'Borneo', 'Madagascar'],
  answer: ['Greenland', 'New Guinea', 'Borneo', 'Madagascar'],
  metrics: ['2.1M sq km', '785K sq km', '748K sq km', '587K sq km']
},
{
  question: 'Rank these cities by latitude from farthest north to farthest south:',
  highest: 'Farthest North',
  lowest: 'Farthest South',
  options: ['Oslo', 'Toronto', 'Beijing', 'Sydney'],
  answer: ['Oslo', 'Toronto', 'Beijing', 'Sydney'],
  metrics: ['59°N', '43°N', '39°N', '34°S']
},
{
  question: 'Rank these regions by number of tectonic plate boundaries nearby:',
  highest: 'Most Boundaries',
  lowest: 'Fewest Boundaries',
  options: ['Japan', 'Iceland', 'California', 'South Africa'],
  answer: ['Japan', 'California', 'Iceland', 'South Africa'],
  metrics: ['4 plates', '3 plates', '2 plates', '1 plate']
},
{
  question: 'Rank these tectonic plates by size from largest to smallest:',
  highest: 'Largest Plate',
  lowest: 'Smallest Plate',
  options: ['Pacific Plate', 'Eurasian Plate', 'African Plate', 'Nazca Plate'],
  answer: ['Pacific Plate', 'Eurasian Plate', 'African Plate', 'Nazca Plate'],
  metrics: ['103M sq km', '67M sq km', '61M sq km', '15M sq km']
},
{
  question: 'Rank these mountain ranges by age, from most recent to oldest:',
  highest: 'Most Recently Formed',
  lowest: 'Oldest Formed',
  options: ['Himalayas', 'Andes', 'Alps', 'Appalachians'],
  answer: ['Himalayas', 'Andes', 'Alps', 'Appalachians'],
  metrics: ['~50M years', '~65M years', '~100M years', '~480M years']
},
{
  question: 'Rank these countries by percentage of land designated as protected areas from most to least:',
  highest: 'Most Protected Land',
  lowest: 'Least Protected Land',
  options: ['Venezuela', 'Germany', 'Australia', 'United States'],
  answer: ['Venezuela', 'Germany', 'Australia', 'United States'],
  metrics: ['54%', '38%', '19%', '13%']
},
{
  question: 'Rank these countries by number of national parks from most to least:',
  highest: 'Most National Parks',
  lowest: 'Least National Parks',
  options: ['Australia', 'Brazil', 'Canada', 'Japan'],
  answer: ['Australia', 'Brazil', 'Canada', 'Japan'],
  metrics: ['685', '334', '48', '34']
},
{
  question: 'Rank these countries by biodiversity (number of known species) from most to least:',
  highest: 'Most Biodiverse',
  lowest: 'Least Biodiverse',
  options: ['Brazil', 'Indonesia', 'Mexico', 'India'],
  answer: ['Brazil', 'Indonesia', 'Mexico', 'India'],
  metrics: ['~56,000', '~51,000', '~49,000', '~47,000']
},
{
  question: 'Rank these maritime routes by annual cargo volume from highest to lowest:',
  highest: 'Most Cargo Volume',
  lowest: 'Least Cargo Volume',
  options: ['Strait of Malacca', 'Suez Canal', 'Panama Canal', 'Bosporus Strait'],
  answer: ['Strait of Malacca', 'Suez Canal', 'Panama Canal', 'Bosporus Strait'],
  metrics: ['>80,000 ships/year', '~25,000', '~14,000', '~9,000']
},
{
  question: 'Rank these ports by container throughput (TEUs) from highest to lowest:',
  highest: 'Busiest Port',
  lowest: 'Least Busy Port',
  options: ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles'],
  answer: ['Shanghai', 'Singapore', 'Rotterdam', 'Los Angeles'],
  metrics: ['47M TEUs', '37M', '15M', '9M']
},
{
  question: 'Rank these countries by total value of merchandise exports (2023) from most to least:',
  highest: 'Largest Exporter',
  lowest: 'Smallest Exporter',
  options: ['China', 'United States', 'Germany', 'Japan'],
  answer: ['China', 'United States', 'Germany', 'Japan'],
  metrics: ['$3.6T', '$2.1T', '$1.7T', '$757B']
},
{
  question: 'Rank these countries by wheat exports from most to least:',
  highest: 'Most Wheat Exports',
  lowest: 'Least Wheat Exports',
  options: ['Russia', 'United States', 'Canada', 'France'],
  answer: ['Russia', 'United States', 'Canada', 'France'],
  metrics: ['45M tons', '26M', '25M', '19M']
},
{
  question: 'Rank these countries by value of electronics exports from most to least:',
  highest: 'Most Electronics Exports',
  lowest: 'Least Electronics Exports',
  options: ['China', 'South Korea', 'Germany', 'Taiwan'],
  answer: ['China', 'South Korea', 'Taiwan', 'Germany'],
  metrics: ['$800B', '$240B', '$200B', '$160B']
},
{
  question: 'Rank these countries by urban population percentage from highest to lowest:',
  highest: 'Most Urbanized',
  lowest: 'Least Urbanized',
  options: ['Japan', 'Brazil', 'France', 'India'],
  answer: ['Japan', 'Brazil', 'France', 'India'],
  metrics: ['92%', '87%', '81%', '36%']
},
{
  question: 'Rank these countries by population density from highest to lowest:',
  highest: 'Densest',
  lowest: 'Least Dense',
  options: ['Bangladesh', 'Netherlands', 'India', 'United States'],
  answer: ['Bangladesh', 'Netherlands', 'India', 'United States'],
  metrics: ['1,265/km²', '523/km²', '464/km²', '36/km²']
},
{
  question: 'Rank these countries by median age from highest to lowest:',
  highest: 'Oldest Median Age',
  lowest: 'Youngest Median Age',
  options: ['Germany', 'Canada', 'Brazil', 'Nigeria'],
  answer: ['Germany', 'Canada', 'Brazil', 'Nigeria'],
  metrics: ['47', '41', '33', '18']
},
{
  question: 'Rank these countries by life expectancy from highest to lowest:',
  highest: 'Longest Life Expectancy',
  lowest: 'Shortest Life Expectancy',
  options: ['Japan', 'Italy', 'Mexico', 'South Africa'],
  answer: ['Japan', 'Italy', 'Mexico', 'South Africa'],
  metrics: ['85 years', '84 years', '75 years', '65 years']
},
{
  question: 'Rank these languages by number of native speakers from most to least:',
  highest: 'Most Native Speakers',
  lowest: 'Fewest Native Speakers',
  options: ['Mandarin', 'Spanish', 'Hindi', 'Russian'],
  answer: ['Mandarin', 'Spanish', 'Hindi', 'Russian'],
  metrics: ['920M', '485M', '344M', '154M']
},
{
  question: 'Rank these countries by Muslim population from highest to lowest:',
  highest: 'Most Muslims',
  lowest: 'Fewest Muslims',
  options: ['Indonesia', 'Pakistan', 'India', 'Bangladesh'],
  answer: ['Indonesia', 'Pakistan', 'India', 'Bangladesh'],
  metrics: ['231M', '212M', '200M', '153M']
},
{
  question: 'Rank these cities by metro area population from largest to smallest:',
  highest: 'Largest Metro Area',
  lowest: 'Smallest Metro Area',
  options: ['Tokyo', 'Delhi', 'New York City', 'London'],
  answer: ['Tokyo', 'Delhi', 'New York City', 'London'],
  metrics: ['37M', '32M', '20M', '14M']
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
  question: 'Rank these countries by average income tax rate for the national average income, from highest to lowest:',
  highest: 'Highest Average Tax Rate',
  lowest: 'Lowest Average Tax Rate',
  options: ['Belgium', 'Germany', 'United States', 'Mexico'],
  answer: ['Belgium', 'Germany', 'United States', 'Mexico'],
  metrics: ['42%', '39%', '25%', '10%']
},
{
  question: 'Rank these countries by average rent for a 1-bedroom apartment (city center):',
  highest: 'Most Expensive',
  lowest: 'Least Expensive',
  options: ['United States', 'Japan', 'Portugal', 'Philippines'],
  answer: ['United States', 'Japan', 'Portugal', 'Philippines'],
  metrics: ['$1,650', '$1,200', '$900', '$500']
},
{
  question: 'Rank these cities by average rent for a 1-bedroom apartment (city center):',
  highest: 'Most Expensive',
  lowest: 'Least Expensive',
  options: ['San Francisco', 'Toronto', 'Berlin', 'Buenos Aires'],
  answer: ['San Francisco', 'Toronto', 'Berlin', 'Buenos Aires'],
  metrics: ['$3,200', '$2,000', '$1,500', '$430']
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
  question: 'Rank these capital cities by GDP from highest to lowest:',
  highest: 'Highest GDP (PPP)',
  lowest: 'Lowest GDP (PPP)',
  options: ['Seoul', 'Buenos Aires', 'Ankara', 'Nairobi'],
  answer: ['Seoul', 'Buenos Aires', 'Ankara', 'Nairobi'],
  metrics: ['$926B', '$490B', '$303B', '$110B']
},
{
  question: 'Rank these countries by number of international airports from most to least:',
  highest: 'Most International Airports',
  lowest: 'Fewest International Airports',
  options: ['United States', 'Russia', 'Germany', 'Japan'],
  answer: ['United States', 'Russia', 'Germany', 'Japan'],
  metrics: ['130+', '70+', '40+', '30+']
},
{
  question: 'Rank these airports by annual passenger traffic from most to least:',
  highest: 'Most Passengers',
  lowest: 'Fewest Passengers',
  options: ['Hartsfield–Jackson Atlanta (ATL)', 'Dubai International (DXB)', 'London Heathrow (LHR)', 'Tokyo Haneda (HND)'],
  answer: ['Hartsfield–Jackson Atlanta (ATL)', 'Dubai International (DXB)', 'Tokyo Haneda (HND)', 'London Heathrow (LHR)'],
  metrics: ['93M', '86M', '83M', '80M']
},
{
  question: 'Rank these airports by annual cargo traffic, in metric tons, from most to least:',
  highest: 'Most Cargo Handled',
  lowest: 'Least Cargo Handled',
  options: ['Hong Kong (HKG)', 'Memphis (MEM)', 'Shanghai Pudong (PVG)', 'Anchorage (ANC)'],
  answer: ['Hong Kong (HKG)', 'Memphis (MEM)', 'Shanghai Pudong (PVG)', 'Anchorage (ANC)'],
  metrics: ['4.2M metric tons', '4.1M metric tons', '3.8M metric tons', '3.6M metric tons']
},
{
  question: 'Rank these airlines by number of countries they fly to from most to least:',
  highest: 'Most Countries Served',
  lowest: 'Fewest Countries Served',
  options: ['Turkish Airlines', 'Air France', 'Emirates', 'Qatar Airways'],
  answer: ['Turkish Airlines', 'Air France', 'Emirates', 'Qatar Airways'],
  metrics: ['129 countries', '93 countries', '84 countries', '82 countries']
},
{
  question: 'Rank these airlines by fleet size (number of aircraft) from largest to smallest:',
  highest: 'Largest Fleet',
  lowest: 'Smallest Fleet',
  options: ['American Airlines', 'Delta Air Lines', 'United Airlines', 'Lufthansa'],
  answer: ['American Airlines', 'Delta Air Lines', 'United Airlines', 'Lufthansa'],
  metrics: ['950+ planes', '900+ planes', '870+ planes', '350+ planes']
},
{
  question: 'Rank these flights by route distance from longest to shortest:',
  highest: 'Longest Route',
  lowest: 'Shortest Route',
  options: ['Singapore to New York', 'Auckland to Doha', 'Perth to London', 'Dallas to Sydney'],
  answer: ['Singapore to New York', 'Auckland to Doha', 'Perth to London', 'Dallas to Sydney'],
  metrics: ['15,300 km', '14,500 km', '14,000 km', '13,800 km']
},
{
  question: 'Rank these airlines by average aircraft age from oldest to newest:',
  highest: 'Oldest Fleet',
  lowest: 'Newest Fleet',
  options: ['Iran Air', 'Delta Air Lines', 'Singapore Airlines', 'Qatar Airways'],
  answer: ['Iran Air', 'Delta Air Lines', 'Singapore Airlines', 'Qatar Airways'],
  metrics: ['23 years', '15 years', '7 years', '5 years']
},
{
  question: 'Rank these airlines by annual passengers carried from most to least:',
  highest: 'Most Passengers',
  lowest: 'Fewest Passengers',
  options: ['Southwest Airlines', 'American Airlines', 'Ryanair', 'Emirates'],
  answer: ['American Airlines', 'Southwest Airlines', 'Ryanair', 'Emirates'],
  metrics: ['200M+', '180M+', '160M+', '60M+']
},
{
  question: 'Rank these international air routes by number of flights per year from most to least:',
  highest: 'Most Flights',
  lowest: 'Fewest Flights',
  options: ['Kuala Lumpur–Singapore', 'London–Dublin', 'New York–London', 'Hong Kong–Taipei'],
  answer: ['Kuala Lumpur–Singapore', 'Hong Kong–Taipei', 'London–Dublin', 'New York–London'],
  metrics: ['30,000+', '28,000+', '24,000+', '21,000+']
},
{
  question: 'Rank these capital cities by their latitude from farthest north to farthest south:',
  highest: 'Farthest North',
  lowest: 'Farthest South',
  options: ['Reykjavík', 'Oslo', 'Ottawa', 'Canberra'],
  answer: ['Reykjavík', 'Oslo', 'Ottawa', 'Canberra'],
  metrics: ['64°N', '59°N', '45°N', '35°S']
},
{
  question: 'Rank these countries by average annual snowfall from most to least:',
  highest: 'Most Snowfall',
  lowest: 'Least Snowfall',
  options: ['Japan', 'Canada', 'Russia', 'Norway'],
  answer: ['Japan', 'Canada', 'Russia', 'Norway'],
  metrics: ['600 in', '400 in', '300 in', '200 in']
},
{
  question: 'Rank these cities by population density from highest to lowest:',
  highest: 'Most Dense',
  lowest: 'Least Dense',
  options: ['Manila', 'Dhaka', 'Paris', 'New York City'],
  answer: ['Manila', 'Dhaka', 'Paris', 'New York City'],
  metrics: ['41,500/km²', '29,000/km²', '21,000/km²', '11,000/km²']
},
{
  question: 'Rank these rivers by average discharge volume from highest to lowest:',
  highest: 'Most Water Discharge',
  lowest: 'Least Water Discharge',
  options: ['Amazon', 'Congo', 'Ganges', 'Mississippi'],
  answer: ['Amazon', 'Congo', 'Ganges', 'Mississippi'],
  metrics: ['209,000 m³/s', '41,000 m³/s', '38,000 m³/s', '16,800 m³/s']
},
{
  question: 'Rank these countries by highest recorded temperature from highest to lowest:',
  highest: 'Hottest Temperature',
  lowest: 'Coolest Maximum',
  options: ['Kuwait', 'Iraq', 'Pakistan', 'Mexico'],
  answer: ['Kuwait', 'Iraq', 'Pakistan', 'Mexico'],
  metrics: ['54.0°C', '53.9°C', '53.7°C', '52.0°C']
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

    if (sortableInstance) {
    sortableInstance.destroy(); // Clean up the old instance first
    }


    sortableInstance = Sortable.create(itemsElement, {
  animation: 150,
  ghostClass: 'sortable-ghost',
  onEnd: function () {
  selectedElement = null;

  // Remove styling from previous guesses
  itemsElement.classList.remove('correct-order', 'incorrect-order');
  itemsElement.querySelectorAll('li').forEach(li => {
    li.classList.remove('selected-option', 'correct-item', 'incorrect-item');
    li.style.backgroundColor = '#f9f9f9';
    li.style.borderColor = '#ccc';
  });

  setupClickToMove();
}

});



    currentAnswer.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.dataset.value = option;
        li.draggable = true;
        itemsElement.appendChild(li);
    });

    // Add click-to-move functionality
    setupClickToMove();

    resultElement.textContent = '';
    updateHearts();
    checkButton.disabled = false;

    highestLabel.textContent = currentQuestion.highest;
    lowestLabel.textContent = currentQuestion.lowest;
}

function resetOptionStyles() {
  itemsElement.classList.remove('correct-order', 'incorrect-order'); // remove container-level styles
  itemsElement.querySelectorAll('li').forEach(li => {
    li.style.backgroundColor = '#f9f9f9'; // or your default background
    li.style.borderColor = '#ccc'; // or your default border
    li.classList.remove('correct-item', 'incorrect-item');
  });
}


let selectedElement = null;

function setupClickToMove() {
  const items = Array.from(itemsElement.children);

  items.forEach((li) => {
    li.onclick = () => {
      // Clear all previous highlights
      items.forEach(item => item.classList.remove('selected-option'));

      if (!selectedElement || selectedElement === li) {
        if (selectedElement === li) {
          // Deselect if clicking again
          selectedElement = null;
        } else {
          selectedElement = li;
          li.classList.add('selected-option');
        }
      } else {
        // Swap
        const selectedClone = selectedElement.cloneNode(true);
        const targetClone = li.cloneNode(true);

        selectedClone.classList.remove('selected-option');
        targetClone.classList.remove('selected-option');

        selectedClone.classList.add('option-move');

        // Replace
        itemsElement.replaceChild(selectedClone, li);
        itemsElement.replaceChild(targetClone, selectedElement);

        // After swapping
selectedElement = null;

// Clear all red/green styles after a swap
itemsElement.classList.remove('correct-order', 'incorrect-order');
itemsElement.querySelectorAll('li').forEach(li => {
  li.classList.remove('correct-item', 'incorrect-item');
  li.style.backgroundColor = '#f9f9f9';
  li.style.borderColor = '#ccc';
});

// Animate
setTimeout(() => {
  selectedClone.classList.remove('option-move');
}, 300);

// Re-bind click handlers
setupClickToMove();
      }
    };
  });
}




function checkOrder() {
    const selectedItems = Array.from(itemsElement.children).map(item => item.textContent);

    if (guessedOrders.some(order => arraysEqual(order, selectedItems))) {
    // Count how many items are correct
    let correctCount = 0;
    selectedItems.forEach((item, index) => {
        if (item === currentQuestion.answer[index]) {
            correctCount++;
        }
    });

    resultElement.textContent = `Already guessed. ${correctCount}/${currentQuestion.answer.length} correct. Try a different order.`;
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
        itemsElement.classList.remove('incorrect-order');
        checkButton.disabled = true;

        if (sortableInstance) {
            sortableInstance.option("disabled", true);
        }

        showResultsModal(true);
        checkButton.disabled = true;
        checkButton.classList.add('hidden');
        streak++;
        streakCountElement.textContent = streak;

        // Update high score if needed
        if (streak > highScore) {
            highScore = streak;
            localStorage.setItem('highScoreStreak', highScore);
            streakHighScoreElement.textContent = highScore;
        }

    } else {
        resultElement.textContent = `Incorrect order. ${correctCount}/${currentQuestion.answer.length} correct. Please try again.`;
        itemsElement.classList.add('incorrect-order');
        itemsElement.classList.remove('correct-order');

        const items = Array.from(itemsElement.children);
        items.forEach((li, index) => {
            const guessedValue = li.textContent;
            const correctValue = currentQuestion.answer[index];

            // Reset styles
            li.classList.remove('correct-item', 'incorrect-item');
            li.style.backgroundColor = '';
            li.style.borderColor = '';

            // Mark correct/incorrect
            if (guessedValue === correctValue) {
                li.classList.add('correct-item');
            } else {
                li.classList.add('incorrect-item');
            }
        });

        // ✅ Only subtract lives in Hard Mode
        if (!isEasyMode) {
            livesRemaining--;
            updateHearts();

            if (livesRemaining === 0) {
                finalStreak = streak;
                showResultsModal(false);

                resultElement.textContent = 'Game over. You are out of lives.';
                itemsElement.querySelectorAll('li').forEach(li => {
                    li.draggable = false;
                });

                checkButton.disabled = true;
                if (sortableInstance) {
                    sortableInstance.option("disabled", true);
                }

                checkButton.classList.add('hidden');
                document.getElementById('share-button').classList.remove('hidden');

                streak = 0;
                streakCountElement.textContent = streak;
            }
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
    lastResultWasWin = isWin;
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
    checkButton.classList.add('hidden');
    playAgainScreenButton.classList.remove('hidden');

    // Update main screen button text
    playAgainScreenButton.textContent = lastResultWasWin ? 'Next Question' : 'Play Again';
    };

    window.onclick = function (event) {
  if (event.target === modal) {
    modal.classList.remove('show');
    checkButton.classList.add('hidden');
    playAgainScreenButton.classList.remove('hidden');

    // Update main screen button text
    playAgainScreenButton.textContent = lastResultWasWin ? 'Next Question' : 'Play Again';
  }
  };



    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = isWin ? 'Next Question' : 'Play Again';
    playAgainButton.classList.add('play-again-button');
    playAgainButton.onclick = function () {
    modal.classList.remove('show');
    modalPlayAgainClicked = true; // mark that they used the modal CTA
    guessedOrders = [];
    resetGame();
    };

    modalContent.appendChild(playAgainButton);

	const shareButtonModal = document.createElement('button');
	shareButtonModal.textContent = 'Share Your Score';
	shareButtonModal.classList.add('share-button'); // Style it same as the main button
	shareButtonModal.style.display = 'none';

	// Set up click event
	shareButtonModal.onclick = function () {
        const shareText = `I got a streak of ${finalStreak} in Geo Ranker! 🌎 Try to beat me: www.georankergame.com`;

    	if (navigator.share) {
        // Native mobile/desktop share
        navigator.share({
            title: 'Geo Ranker',
            text: shareText,
            url: 'https://georankergame.com'
        }).catch(err => {
            console.error('Error using native share', err);
        });
    } else {
        // Fallback if native share not supported
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Score copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
	};

	modalContent.appendChild(shareButtonModal);


	if (!isWin) {
    	shareButtonModal.style.display = 'block';
	}
}

function setupNativeShareButton(buttonId = 'native-share-button') {
  const shareButton = document.getElementById(buttonId);
  if (!shareButton) return; // Exit safely if button not found

  shareButton.addEventListener('click', async () => {
    try {
      await navigator.share({
        title: 'Geo Ranker 🌎',
        text: `I got a ${finalStreak} in Geo Ranker! 🌎 Try to beat me: www.georankergame.com`,
        url: 'https://www.georankergame.com',
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  });
}


function resetGame() {
    document.getElementById('resultsModal').classList.remove('show');
    if (livesRemaining === 0) {
        livesRemaining = 5;
        streak = 0;
        streakCountElement.textContent = streak;
    }
    resultElement.textContent = '';
    updateHearts();
    resetOrderStyles();  //This clears background/border styling
    itemsElement.classList.remove('correct-order', 'incorrect-order');  //Also remove group  classes
    displayQuestion();
    if (sortableInstance) {
    sortableInstance.option("disabled", false);
	}
	checkButton.classList.remove('hidden');
	checkButton.disabled = false;
	playAgainScreenButton.classList.add('hidden');
	document.getElementById('share-button').classList.add('hidden');
    finalStreak = 0;

}




document.getElementById('check').addEventListener('click', checkOrder);

window.onload = function() {
    const introModal = document.getElementById('introModal');
    const startGameButton = document.getElementById('startGameButton');

    introModal.classList.add('show');

    startGameButton.addEventListener('click', function() {
        introModal.classList.remove('show');
    });
    };


playAgainScreenButton.addEventListener('click', () => {
    playAgainScreenButton.classList.add('hidden');
    resetGame();
    });


displayQuestion();

setupNativeShareButton();

if (navigator.share) {
  document.getElementById('native-share-button').classList.remove('hidden');
}
