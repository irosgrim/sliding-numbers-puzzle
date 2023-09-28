const app = document.getElementById('app');
const play = document.getElementById('play');
const movesEl = document.getElementById('moves');

const elements = [];
const gridSize = 4;
let clicks = 0;

const isSolvable = (arrangement) => {
  const rowSize = Math.sqrt(arrangement.length);
  let inversions = 0;

  for (let i = 0; i < arrangement.length - 1; i++) {
    for (let j = i + 1; j < arrangement.length; j++) {
      if (
        arrangement[i] !== ' ' &&
        arrangement[j] !== ' ' &&
        arrangement[i] > arrangement[j]
      ) {
        inversions++;
      }
    }
  }

  if (rowSize % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    const emptyRowFromBottom =
      rowSize - Math.floor(arrangement.indexOf(' ') / rowSize);
    return (inversions + emptyRowFromBottom) % 2 === 1;
  }
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateSolvablePuzzle = (size) => {
  const solvedPuzzle = Array.from(
    { length: size * size - 1 },
    (_, i) => i + 1
  ).concat(' ');
  let shuffledPuzzle;

  do {
    shuffledPuzzle = shuffleArray([...solvedPuzzle]);
  } while (!isSolvable(shuffledPuzzle));

  return shuffledPuzzle;
};

const checkWinner = (size = 3) => {
  let winningString = '';
  for (let i = 1; i < size ** 2; i++) {
    winningString += i;
  }
  winningString += '_';
  const currentState = [...document.querySelectorAll('.btn')]
    .map((x) => x.innerText || '_')
    .join('');
  if (currentState === winningString) {
    document.getElementById('win').innerText = 'You won!';
    document
      .querySelectorAll('.btn')
      .forEach((btn) => btn.setAttribute('disabled', true));
    play.style.visibility = 'visible';
  } else {
    document.getElementById('win').innerText = '';
  }
};

const handleClick = (e) => {
  if (!e.target.classList.contains('none')) clicks += 1;
  movesEl.innerText = clicks;
  const [currY, currX] = e.target.id.split('_');
  const none = document.querySelector('.none');
  const [noneY, noneX] = none.id.split('_');
  const deltaX = Math.abs(noneX - currX);
  const deltaY = Math.abs(noneY - currY);

  if ((deltaX === 1 && deltaY === 0) || (deltaX === 0 && deltaY === 1)) {
    none.textContent = e.target.textContent;
    none.classList.remove('none');

    e.target.textContent = '';
    e.target.classList.add('none');    
    checkWinner(gridSize);
  }
};

const btn = (n, y, x) => {
  const b = document.createElement('button');
  b.innerText = n;
  b.setAttribute('class', 'btn');
  b.setAttribute('id', `${y}_${x}`);
  b.addEventListener('click', handleClick);
  return b;
};

const createBtns = (size = 3) => {
  const randNumbers = generateSolvablePuzzle(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = randNumbers.shift();
      if (n === ' ') {
        const b = btn('', y, x);
        b.setAttribute('class', 'btn none');
        elements.push(b);
      } else {
        const b = btn(n, y, x);
        elements.push(b);
      }
    }
  }
  for (const el of elements) {
    app.appendChild(el);
  }
};

app.style['grid-template-columns'] = `repeat(${gridSize}, 1fr)`;
createBtns(gridSize);

play.addEventListener('click', () => {
  window.location.reload();
});
