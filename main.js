import { setupGlobalBoundary } from "./error-boundary.js";
import { setupListeners } from "./event-delegation.js";
import { Game } from "./game.js";

function main() {
  const game = new Game();

  setupGlobalBoundary();
  setupListeners(game.start.bind(game), game.end.bind(game));
}

main();
