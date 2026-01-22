let displayCard = document.getElementById("pokemon-details");
let modalContainer = document.getElementById("pokemon-modal");
let loadingImage = document.getElementById("loading");
let searchButton = document.getElementById("search-button");
let toggleButton = document.getElementById("toggle-favourites");
let searchInput = document.getElementById("search-input");
let savedFavorites = {};

searchButton.addEventListener("click", initalizePoke);
let toggleFavorite = toggleButton.addEventListener("click", handleToggle);
let toggle = false;

loadFavorites();

function handleToggle() {
	// Toggle is true on favorites page
	// Toggle is false on search page
	if (toggle) {
		resetSearchPage();
	} else {
		viewFavorites();
	}
}

function saveFavorites() {
	// Save to localStorage
	localStorage.setItem("pokemonFavorites", JSON.stringify(savedFavorites));
}

function loadFavorites() {
	// Load from localStorage
	const saved = localStorage.getItem("pokemonFavorites");
	if (saved) {
		savedFavorites = JSON.parse(saved);
	}
}

function resetSearchPage() {
	toggle = false;
	toggleButton.innerText = "View Favorites";
	searchButton.classList.remove("hidden");
	searchInput.classList.remove("hidden");
	displayCard.innerHTML = "";
}

async function initalizePoke() {
	displayCard.innerHTML = "";
	loadingImage.classList.remove("hidden");
	let searchValue = document.getElementById("search-input").value.toLowerCase();

	try {
		let response = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${searchValue}`
		);

		loadingImage.classList.add("hidden");
		if (!response.ok || searchValue === "") {
			displayCard.innerText = "Pokemon not found!";
			return;
		}

		let poke = await response.json();
		pokemonCard(poke);
	} catch (error) {
		// if there is a problem with API
		loadingImage.classList.add("hidden");
		displayCard.innerText = "Error fetching Pokemon data";
		console.error(error);
	}
}

function addFavorites(pokemon) {
	if (Object.keys(savedFavorites).length >= 6) {
		alert("You already have 6 favorite pokemon!");
	} else if (pokemon.name in savedFavorites) {
		alert(`${pokemon.name} is already added!`);
	} else {
		savedFavorites[pokemon.name] = pokemon;
		alert(`${pokemon.name} added to favorites!`);
		saveFavorites();
	}
}

function viewFavorites() {
	displayCard.innerHTML = "";
	toggleButton.innerText = "Return to Search";
	toggle = true;
	searchButton.classList.add("hidden");
	searchInput.classList.add("hidden");

	for (let name in savedFavorites) {
		pokemonCard(savedFavorites[name]);
	}

	let favoriteButtonList = document.querySelectorAll(".favoriteButton");
	favoriteButtonList.forEach((b) => {
		b.remove();
	});
}

function modal(pokemon) {
	// Show modal
	modalContainer.classList.remove("hidden");

	// Exit options
	document.getElementById("close-modal").addEventListener("click", function () {
		modalContainer.classList.add("hidden");
	});
	document
		.getElementById("pokemon-modal")
		.addEventListener("click", function () {
			if (event.target === this) {
				modalContainer.classList.add("hidden");
			  }
		});

	// Upload content
	document.getElementById("modal-name").innerText = pokemon.name;
	document.getElementById("modal-id").innerText = `#${String(
		pokemon.id
	).padStart(3, "0")}`;
	document.getElementById("modal-img").src =
		pokemon.sprites.other["official-artwork"].front_default;
	document.getElementById("modal-height").innerText = `Height: ${(
		pokemon.height * 0.1
	).toFixed(1)} m`;
	document.getElementById("modal-weight").innerText = `Weight: ${(
		pokemon.weight * 0.1
	).toFixed(1)} kg`;

	let abilitiesList = [];
	pokemon.abilities.forEach((a) => {
		abilitiesList.push(`${a.ability.name}`);
	});
	document.getElementById(
		"modal-abilities"
	).innerText = `Abilities:  ${abilitiesList.join(", ")}`;

	let statList = [];
	pokemon.stats.forEach((s) => {
		statList.push(`${s.stat.name}: ${s.base_stat}`);
	});
	document.getElementById("modal-stats").innerText = `${statList.join("\r\n")}`;
}

function pokemonCard(pokemon) {
	let cardContainer = document.createElement("div");
	cardContainer.classList = "pokemon-card";

	let title = document.createElement("h2");
	title.innerText = `${pokemon.name}`;

	let pokeImg = document.createElement("img");
	pokeImg.src = pokemon.sprites.other["official-artwork"].front_default;

	let pokeId = document.createElement("p");
	pokeId.innerText = `ID: ${pokemon.id}`;

	let pokeType = document.createElement("p");
	pokeType.innerText = `Types: ${pokemon.types[0].type.name}`;

	let pokeAbilities = document.createElement("p");
	let abilitiesList = [];
	pokemon.abilities.forEach((a) => {
		abilitiesList.push(`${a.ability.name}`);
	});
	abilitiesList.join(", ");
	pokeAbilities.innerText = `Abilities: ${abilitiesList.join(", ")}`;

	let infoButton = document.createElement("button");
	infoButton.innerText = "More Info";
	infoButton.addEventListener("click", () => modal(pokemon));

	let favoriteButton = document.createElement("button");
	favoriteButton.innerText = "Add to Favorites";
	favoriteButton.classList.add("favoriteButton");
	favoriteButton.addEventListener("click", () => addFavorites(pokemon));

	displayCard.appendChild(cardContainer);
	cardContainer.appendChild(title);
	cardContainer.appendChild(pokeImg);
	cardContainer.appendChild(pokeId);
	cardContainer.appendChild(pokeType);
	cardContainer.appendChild(pokeAbilities);
	cardContainer.appendChild(infoButton);
	cardContainer.appendChild(favoriteButton);
}
