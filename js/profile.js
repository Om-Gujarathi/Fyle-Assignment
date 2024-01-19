document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  if (username == null) {
    window.location.href = "home.html";
  }
  const userDetailsContainer = document.getElementById("user-details");
  const repositoriesContainer = document.getElementById("repositories");
  const paginationContainer = document.getElementById("pagination");
  const reposPerPageSelect = document.getElementById("reposPerPageSelect");
  const loader = document.getElementById("loader");

  let perPage = parseInt(reposPerPageSelect.value, 10);
  let currentPage = 1;

  function updatePerPage() {
    perPage = parseInt(reposPerPageSelect.value, 10);
    currentPage = 1;
    showLoader();
    fetchRepositories();
  }

  reposPerPageSelect.addEventListener("change", updatePerPage);

  function showLoader() {
    loader.style.display = "block";
  }

  function hideLoader() {
    loader.style.display = "none";
  }

  fetch(`https://api.github.com/users/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        window.location.href = "home.html";
      }
    })
    .then((userData) => {
      hideLoader();
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
    })
    .finally(() => {
      hideLoader();
    });

  function fetchRepositories() {
    showLoader();
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
      })
      .finally(() => {
        hideLoader();
      });
  }

  function displayRepositories(repositories) {
    repositoriesContainer.innerHTML = "";

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
    prevButton.classList.add("page-button");
    prevButton.innerText = "Previous";
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        showLoader();
        fetchRepositories();
      }
    });
    paginationContainer.appendChild(prevButton);

    const nextButton = document.createElement("button");
    nextButton.classList.add("page-button");
    nextButton.innerText = "Next";
    nextButton.addEventListener("click", () => {
      currentPage++;
      showLoader();
      fetchRepositories();
    });
    paginationContainer.appendChild(nextButton);
  }

  fetchRepositories();
});
