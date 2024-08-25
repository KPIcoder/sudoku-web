export function setupGlobalBoundary() {
  window.onerror = (msg, url, line, col, error) => {
    console.error(msg);
    const errorNode = document.querySelector(".error-anchor");
    errorNode.style.display = "block";
    errorNode.innerText = error.message;

    setTimeout(() => {
      errorNode.style.display = "none";
      errorNode.innerText = "";
    }, 2000);
  };
}
