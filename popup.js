// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  console.log('in add clic event listener')
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: main
  });
});


// The body of this function will be execuetd as a content script inside the
// current page
async function main() {
  function getGuesses() {
    // chrome.storage.sync.get("color", ({ color }) => {
    //   document.body.style.backgroundColor = color;
    // });
    let guesses = [];
    let rows = document.querySelector("body > game-app").shadowRoot.querySelector("#board").childNodes
    for (var row of rows) {
      let word = row.getAttribute("letters");
      if (word) {
        guesses.push(word);
      }
    }
    console.log("guesses: " + guesses);
    return guesses;
  }

  async function oneCall(bodyData) {
    console.log(JSON.stringify(bodyData))
    const response = await fetch(`https://1vv6d7.deta.dev/onecall`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData)
    })
    const resp = await response.json();
    console.log(resp);
    return resp;
  }

  let wordsLeftText = document.getElementById("wordsLeft").innerText;  
  let bestLettersText = document.getElementById("bestLetters").innerText;  
  let bestGuessText = document.getElementById("bestGuess").innerText;  

  wordsLeftText = '1';
  bestLettersText = '2';
  bestGuessText = '3';
  
  guessList = getGuesses();
  const data = {guesses: guessList}
  await oneCall(data)
}
