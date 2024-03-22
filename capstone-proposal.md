## Noah Kise

## Band Scrambler

### Project's Purpose or Goal:
* Provide a fun and challenging word game that appeals to user's musical interests.

### Minimum features the project requires to meet this purpose or goal:
* Game cycles through rounds picking a random band name and providing the user the name scrambled.  If the user correctly identifies the band, they get points.
* Users can sign up, log in, and log out.
* Users usernames and point totals are stored in a database so that when they return to the game their starting score is where they left off.
* Band photo appears blurred when game is running, and reveals when round is over
* Gaining enough points will bank hints, which can be used if user is stuck
* User's account details page includes a history of every band they have been quizzed on, and whether or not they were successful in guessing it. These will be links to the band's bandcamp page or maybe apple music page or wikipedia.
* User's account details page will provide visual statistics about their gameplay over time.
* Leaderboard shows users with top scores

### Tools, frameworks, libraries, APIs, modules and/or other resources that will be used to create this MVP:
* React for front end desktop version
* React native for front end mobile version
* Firebase for user database management
* Chart.js for data visualization
* React-Draggable for reordering and positioning tiles
* Material UI for some design elements
* Discogs API or similar music API for images, possibly for band names if they are not hardcoded

### Stretch Goals
* Daily mode that pushes same artist or group of artists to every user, updated daily sort of like wordle
* Audio hint possible, where 10 second snippet of a song by the artist is played as a clue
* Mini games between rounds, made with godot
* Sounds, settings screen to customize sounds
* Game customizeable by genre, stats available for each game mode
* Microtransactions

### Additional tools, frameworks, libraries, APIs, or other resources required by stretch goals:
* Web audio API
* Godot
* Steam microtransaction API