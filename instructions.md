Project Title: Elemental Chef 2048

Concept: A 2048-style grid-based puzzle game where players merge ingredients and elements (Fire, Water) to fulfill complex recipes.
1. Core Logic & Tile Archetypes

The game engine treats the 4×4 board as a Reactive State Machine.
A. Tile Data Structure

Every tile is a JSON object tracking its evolution:

    Type: Ingredient | Element | Blocker | Result

    State: Raw | Cooked | Burnt | Soggy

    Level: Integer (1–4) representing ingredient stacks.

    Cooldown: Turn counter for "Stationary Zone" reactions.

B. Collision & Merge Rules

    Identity Merge: Ingredient A (State X) + Ingredient A (State X) = Ingredient A (State X) [Level +1]. (Max Level: 4).

    Transformation (Catalyst): Ingredient + Element = New State.

        Fire + Dough = Bread.

        Water + Flour = Dough.

    Complex Assembly: Ingredient A + Ingredient B = New Item.

        Bread + Cooked Patty = Burger.

    Annihilation: Fire + Water = Steam (A 3-turn temporary "Wildcard" tile).

2. Elemental Puzzle Mechanics

Elements are the "Active Ingredients" that add difficulty.

    Fire: Cooks ingredients. Moving an item into Fire "Levels it up" in the recipe chain. Over-exposure turns items into Burnt Carbon (Blocker).

    Water: Boils or cleans. Used to create dough/pasta or to remove Burnt Carbon from the board.

    The "State Guard" Rule: To prevent accidental destruction, a tile can only undergo one state change per swipe.

3. Level Design: Static vs. Dynamic

    Stationary Zones: The grid contains permanent tiles (e.g., a "Stovetop" square). Moving any ingredient here triggers a state change after 1 turn.

    Dynamic Tiles: Fire/Water tiles spawn like "2s" in 2048. The player must slide them into the ingredients they wish to transform.

    The Trash Can: A specific coordinate (3,3) acts as a "Sink." Sliding any tile here deletes it, allowing the player to clear the board at the cost of "Health."

4. Backend Architecture (Logic Flow)

The backend must evaluate moves in this sequence:

    Input: Player swipes [Direction].

    Shift: Calculate new coordinates for all tiles.

    Reaction Pass: Check for Ingredient + Element or Element + Element collisions. Update states.

    Merge Pass: Check for identical Type + State collisions. Sum the levels.

    Environment Pass: Apply effects from Stationary Zones (Fire/Water squares).

    Validation: Compare the board against the Active Orders (e.g., "Serve 1 Burger"). If a match exists, remove the tile and trigger "Success."

5. Progression & Recipes

Recipes scale in complexity to act as level "Bosses."

    Basic (Level 1): Dough + Fire = Bread.

    Intermediate (Level 5): Wheat + Water = Noodles → Meat + Fire = Roasted Pork → Noodles + Pork + Water = Ramen.

    Penalty States:

        Bread + Water = Soggy Mess (Requires "Fire" to dry out or "Sink" to clear).

        Cooked Meat + Fire = Burnt Carbon (Requires "Water" to clean).

6. Critical Implementation Guards (For LLM Coding)

    Weighted Spawning: Do not spawn Fire if the board contains only processed goods (prevents soft-locks).

    Order Exit Strategy: To prevent the board from filling up, the "Result" tile of a recipe must be automatically "Collected" (removed) once the order is met.

    Recipe Priority: If a combination could result in two different things, prioritize the "Active Order."

Instruction for the LLM: Use this design document to generate a TypeScript/React implementation of the board logic and a JSON configuration file for the first 10 levels of recipe progression.