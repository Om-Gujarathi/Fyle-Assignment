document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");

  const userDetailsContainer = document.getElementById("user-details");
  const repositoriesContainer = document.getElementById("repositories");
  const paginationContainer = document.getElementById("pagination");
  const reposPerPageSelect = document.getElementById("reposPerPageSelect");

  let perPage = parseInt(reposPerPageSelect.value, 10);
  let currentPage = 1;

  function updatePerPage() {
    perPage = parseInt(reposPerPageSelect.value, 10);
    currentPage = 1;
    fetchRepositories();
  }

  reposPerPageSelect.addEventListener("change", updatePerPage);

  fetch(`https://api.github.com/users/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  })
    .then((response) => response.json())
    .then((userData) => {
      console.log(userData);
      const userElement = document.createElement("div");
      userElement.classList.add("flex");
      userElement.innerHTML = `
            <div>
                <img src="${userData.avatar_url}" alt="${
        userData.login
      }" width="100" height="100">
            </div>
            <div>
                <h2>${userData.login}</h2>
                <p>Name: ${userData.name || "Not available"}</p>
                <p>Location: ${userData.location || "Not available"}</p>
                <p>Followers: ${userData.followers}</p>
                <p>Following: ${userData.following}</p>
            </div>
          `;
      userDetailsContainer.appendChild(userElement);
    })
    .catch((error) => {
      console.log(error);
    });

  function fetchRepositories() {
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    )
      .then((response) => response.json())
      .then((repositories) => {
        displayRepositories(repositories);
        displayPagination();
      })
      .catch((error) => {
        console.error("Error fetching repositories:", error);
      });
  }

  function displayRepositories(repositories) {
    repositoriesContainer.innerHTML = "";
    console.log(repositories);

    repositories.forEach((repo) => {
      const repoElement = document.createElement("div");
      const topicsHTML = repo.topics
        .map((topic) => `<span class="topic">${topic}</span>`)
        .join(" ");
      repoElement.classList.add("repository");
      repoElement.innerHTML = `
            <a href="${repo.html_url}" target="_blank"><h3>${repo.name}</h3></a>
            <p>${repo.description || "No description available"}</p>
            <div class="topics-container">${topicsHTML}</div>
          `;
      repositoriesContainer.appendChild(repoElement);
    });
  }

  function displayPagination() {
    paginationContainer.innerHTML = "";

    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous";
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchRepositories();
      }
    });
    paginationContainer.appendChild(prevButton);

    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.addEventListener("click", () => {
      currentPage++;
      fetchRepositories();
    });
    paginationContainer.appendChild(nextButton);
  }

  fetchRepositories();
});
