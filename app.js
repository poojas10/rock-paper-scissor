let iconOptions = document.querySelectorAll(".icons");
let userSelectedIcon;
let randomNumber;
let computerSelection;
let totalPlayers;
let playerUser;
let resultDisplay = document.querySelector(".result-show");
let computerWaitingMove = document.querySelector(".computer-pick");
let winner;
let computerChoice;
let score = 0;
if (sessionStorage.getItem("score") === null) {
  document.querySelector(".score").textContent = 0;

} else {
  document.querySelector(".score").textContent = sessionStorage.getItem("score");
}

const selections = [{
    name: "rock",
    beats: "scissors"
  },
  {
    name: "paper",
    beats: "rock"
  },
  {
    name: "scissors",
    beats: "paper"
  },
];
randomNumber = Math.floor(Math.random() * selections.length);
iconOptions.forEach((e) => {
  e.addEventListener(
    "click",
    function () {
      userSelectedIcon = this.id;
      playerUser = this.parentElement;
      computerSelection = selections[randomNumber].beats;
      computerChoice = computerSelection;
      iconOptions.forEach((e) => {
        if (e.parentElement.lastElementChild.id === `${computerSelection}`) {
          computerSelection = e.parentElement;
        }
      });
      displayUserChoice();
      e.style.pointerEvents = "none";
    }, {
      once: true
    }
  );
});

function winnerName() {
  selections.forEach((e) => {
    if (userSelectedIcon === e.name && computerChoice === e.beats) {
      winner = "user";
      score++;
      if (sessionStorage.getItem("score") === null) {
        sessionStorage.setItem("score", JSON.stringify(score));
      } else {
        score = JSON.parse(sessionStorage.getItem("score"));
        score++;
        sessionStorage.setItem("score", JSON.stringify(score));
      }
    } else if (computerChoice === e.name && userSelectedIcon === e.beats) {
      winner = "computer";
    } else {
      if (computerChoice === userSelectedIcon) {
        winner = "draw";
      }
    }
  });
  return winner;
}
const displayUserChoice = function () {
  resultDisplay.lastElementChild.style.gridArea = "1/3";
  let winner;
  let draw;
  let user;
  iconOptions.forEach((e) => {
    e.parentElement.style.display = "none";
    e.style.pointerEvents = "none";
    if (userSelectedIcon === e.id) {
      user = e.parentElement;
      user.classList.remove("gradient");
      user.classList.add("gradient-copy");
      user.classList.add("user");
      user.style.cursor = "default";

      // user.style.display="flex"
    } else if (computerSelection === e.id) {
      computerSelection = e.parentElement;
      computerSelection.classList.remove("gradient");
      computerSelection.classList.add("gradient-copy");
      // computerSelection.style.display="flex"
    } else if (computerSelection.lastElementChild.id === userSelectedIcon) {
      draw = userSelectedIcon;
    }
  });
  winningPageStyling(user);
  computerSelection.style.cursor = "default";
  if (draw) {
    resultDisplay.lastElementChild.style.gridArea = "1/3";
    generateDuplicate();
  }
  document.querySelector(".user-choosingOptions").remove();
};

function winningPageStyling(user) {
  document.querySelector(".player-title").style.display = "grid";
  computerWaitingMove.style.display = "grid";
  resultDisplay.append(user);
  user.style.display = "flex";
  user.style.cursor = "default";
  setTimeout(() => {
    if (computerWaitingMove !== null) {
      computerWaitingMove.remove();
    }
    if (computerSelection.lastElementChild.id !== userSelectedIcon) {
      resultDisplay.append(computerSelection);
      computerSelection.style.display = "flex";
      computerSelection.classList.add("computer");
      resultDisplay.lastElementChild.style.gridArea = "1/3";
    }

    setTimeout(() => {
      resultDisplay.style.gridTemplateColumns = "1fr 2fr 1fr";
      resultDisplay.lastElementChild.style.gridArea = "1/3";
      if (window.innerWidth <= 600) {
        document.querySelector('body').append(document.querySelector(".winner-announcement"));
      } else {
        resultDisplay.append(document.querySelector(".winner-announcement"))
      }
      window.addEventListener('resize', function () {
        if (window.innerWidth <= 600) {
          document.querySelector('body').append(document.querySelector(".winner-announcement"));
        } else {
          resultDisplay.append(document.querySelector(".winner-announcement"))
        }
      })
      document.querySelector(".winner-announcement button").style.display =
        "block";

      document
        .querySelector(".winner-announcement button")
        .addEventListener("click", () => {
          location.reload();
        });
      winner = winnerName();
      if (winner === "computer") {
        document.querySelector(".winner").textContent = "YOU LOSE";
      } else if (winner === "user") {
        document.querySelector(".winner").textContent = "YOU WIN";
      } else if (winner === "draw") {
        document.querySelector(".winner").textContent = "DRAW";
      }
      for (let i = 0; i < resultDisplay.children.length - 1; i++) {
        if (resultDisplay.children[i].classList.contains(`${winner}`)) {
          resultDisplay.children[i].classList.add("aroundIcons");
          resultDisplay.children[i].classList.add("winner-effect");
        }
      }
      document.querySelector(".player-title").style.width = "100vw";
      if (sessionStorage.getItem("score") !== null) {
        document.querySelector(".score").textContent = JSON.parse(
          sessionStorage.getItem("score")
        );
      } else {
        document.querySelector(".score").textContent = 0;
      }
    }, 1000);
  }, 1000);
}

function generateDuplicate() {
  // resultDisplay.lastElementChild.style.gridArea='1/3'
  iconOptions.forEach((e) => {
    e.style.pointerEvents = "none";
  });
  draw();
}

function draw() {
  let div = document.createElement("div");
  let child = document.createElement("div");
  let image = document.createElement("img");
  let source = `./images/icon-${userSelectedIcon}.svg`;
  image.setAttribute("src", source);
  div.classList.add(`${userSelectedIcon}-gradient`);
  div.classList.add(`gradient-copy`);
  child.classList.add(`${userSelectedIcon}-icon`);
  child.classList.add(`icons`);
  child.id = userSelectedIcon;
  child.append(image);
  div.append(child);
  resultDisplay.append(div);
  computerWaitingMove.style.display = "flex";
  computerSelection.style.display = "none";
  setTimeout(() => {
    resultDisplay.append(computerSelection);
    computerSelection.style.display = "flex";
  }, 1000);
}

window.addEventListener("resize", function () {
  console.log("yes");
  var mq = window.matchMedia("(max-width: 800px)");
  if (mq.matches) {
    resultDisplay.style.gridTemplateColumns = "1fr 1fr";
    resultDisplay.style.padding = "2rem 5rem";
    resultDisplay.style.gridGap = "20px";
    document.querySelector(".player-title").style.width = "100vw";
    document.querySelector(".winner-announcement").style.gridArea = "2/2";
  } else {
    document.querySelector(".winner-announcement").style.gridArea = "1/2";
  }
});