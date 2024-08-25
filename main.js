import { setupGlobalBoundary } from "./error-boundary.js";
import { setupListeners } from "./event-delegation.js";
import { Game } from "./game.js";

function main() {
  const game = new Game();

  setupListeners();
  setupGlobalBoundary();
}

main();
