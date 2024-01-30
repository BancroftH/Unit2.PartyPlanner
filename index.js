const COHORT = "2311-FSA-ET-WEB-PT-SF"
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

// ** Variable for deleteing party
// const deletePartyForm = document.querySelector("deleteParty");
// deletePartyForm.addEventListener("submit", deleteParty);

console.log("Before async function");
/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  renderParties();
  }
render();

/**
 * Update state with parties from API
 */
async function getParties() {
  try {
      const response = await fetch(API_URL);
      const json = await response.json();
      state.parties = json.data;
  } catch (error) {
      console.error(error);
  }
}
console.log("ran async function getParties");

/**
 * Render Parties in browser
 */
function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No Parties.</li>";
    return;
  }

  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h1>${party.name}</h1>
      <p>${party.date}</p>
      <p>${party.time}</p>
      <p>${party.location}</p>
      <p>${party.discription}</p>
      `;
    return li;    
  });

  partyList.replaceChildren(...partyCards);
}

/**
 * Ask the API to create a new Party based on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        date: addPartyForm.date.value,
        time: addPartyForm.time.value,
        location: addPartyForm.location.value,
        discription: addPartyForm.discription.value,
      }),
    });

    if(!response.ok) {
        throw new Error("Failed to add Party")
    }

    render();
  } catch (error) {
    console.error(error)  
  }
}  

// * Deletes unwanted party
async function deleteParty(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: deletePartyForm.name.value,
        date: deletePartyForm.date.value,
        time: deletePartyForm.time.value,
        location: deletePartyForm.location.value,
        discription: deletePartyForm.discription.value,
      }),
    });

    if(!response.ok) {
      throw new Error("Failed to delete Party")
  }

  render();
} catch (error) {
  console.error(error)  
  }
}