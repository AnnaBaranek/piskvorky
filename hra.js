import { findWinner } from "https://unpkg.com/piskvorky@0.1.4";

let currentPlayer = "circle";

const selectButton = (event) => {
  const btn = event.target;
  event.target.disabled = true;
  if (currentPlayer === "circle") {
    btn.classList.add("board__field--circle");
    currentPlayer = "cross";
    const playsElement = document.getElementById("plays");
    playsElement.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35 style="height: 1em;"><g transform="translate(0,-290.65)"><path d="m6.0854 296.03-2.2274-2.2059 2.2051-2.225-0.68686-0.68079-2.2046 2.2262-2.2255-2.2042-0.68152 0.68151 2.2279 2.2083-2.2059 2.2274 0.68152 0.68152 2.21-2.2294 2.2265 2.2071z" stroke-width=".24253" fill="#fff"/></g></svg>';
    playsElement.style.height = "1em";
  } else {
    btn.classList.add("board__field--cross");
    currentPlayer = "circle";
    const playsElement = document.getElementById("plays");
    playsElement.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" version="1.1" viewBox="0 0 6.35 6.35 style="height: 1em;"><g transform="translate(0,-290.65)"><path d="m3.175 290.65c-1.7526 0-3.175 1.4224-3.175 3.175s1.4224 3.175 3.175 3.175 3.175-1.4224 3.175-3.175-1.4224-3.175-3.175-3.175zm0 0.74706c1.3402 0 2.4279 1.0877 2.4279 2.4279s-1.0877 2.4279-2.4279 2.4279-2.4279-1.0877-2.4279-2.4279 1.0877-2.4279 2.4279-2.4279z" stroke-width="10" fill="#fff"/></g></svg>';
    playsElement.style.height = "1em";
  }
};

const allButtons = document.querySelectorAll(".btn-field");
allButtons.forEach((button) => {
  button.addEventListener("click", selectButton);
});

// obnoveni polozek v poli po kazdem kliku a overeni, jestli nekdo vyhral

const updateField = async () => {
  const herniPole = Array.from(allButtons).map((clickedButton) => {
    if (clickedButton.classList.contains("board__field--circle")) {
      return "o";
    } else if (clickedButton.classList.contains("board__field--cross")) {
      return "x";
    } else {
      return "_";
    }
  });

  console.log(herniPole);

  const vitez = findWinner(herniPole);
  if (vitez === "o" || vitez === "x") {
    setTimeout(() => {
      alert(`Vyhrál hráč ${vitez}.`);
      location.reload();
    }, 300);
  }

  //zjisteni kdo je na tahu a volani API
  if (currentPlayer === "cross") {
   

    const response = await fetch(
      "https://piskvorky.czechitas-podklady.cz/api/suggest-next-move",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          board: herniPole,
          player: "x", 
        }),
      }
    );


    const data = await response.json();
    const { x, y } = data.position; // x bude 0 a y bude 1, protože to je jediné volné políčko. x 0 odpovídá prvnímu sloupci a y 1 druhému řádku.
    const field = allButtons[x + y * 10]; // Najde políčko na příslušné pozici.
    field.click(); // Simuluje kliknutí. Spustí událost `click` na políčku.
  }
};
allButtons.forEach((button) => {
  button.addEventListener("click", updateField);
});

// restart hry

const restartLink = document.querySelector(".icon-restart");
restartLink.addEventListener("click", (event) => {
  const confirmation = confirm("Opravdu chceš začít hrát znovu?");
  if (confirmation === false) {
    event.preventDefault();
  }
});
