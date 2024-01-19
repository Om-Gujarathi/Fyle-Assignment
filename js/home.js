document.addEventListener("DOMContentLoaded", function () {
  const viewButton = document.getElementById("view-button");
  const textField = document.getElementById("textfield");
  viewButton.addEventListener("click", function () {
    const username = document.getElementById("textfield").value;
    if (username != "") {
      window.location.href = "profile.html?username=" + username;
    }
  });
  textField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      viewButton.click();
    }
  });
});
