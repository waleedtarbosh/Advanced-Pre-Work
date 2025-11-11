# ProSports ⚽



[![API](https://img.shields.io/badge/API-API--Football-blue.svg)](https://www.api-football.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> ProSports: A dynamic, multi-page football stats website built with vanilla HTML, CSS, and JS, powered by the API-Football API.

This is a website dedicated to providing comprehensive and real-time football (soccer) statistics. The site fetches data directly from the API-Football service to display team standings, player stats, match fixtures, and more.

---

## 📍 Live Demo

**[https://prosports-football.netlify.app/](https://prosports-football.netlify.app/)**

*(Note: The live demo may not function if the public API key has hit its daily limit. For guaranteed access, please run the project locally with your own key.)*

---

## 📖 Table of Contents

* [✨ Features & Pages](#-features--pages)
* [💻 Tech Stack & Styles](#-tech-stack--styles)
* [🚀 How to Install and Run](#-how-to-install-and-run)
* [💡 How to Use](#-how-to-use)
* [🤝 How to Contribute](#-how-to-contribute)
* [✍️ Author](#️-author)

---

## ✨ Features & Pages

The website is structured into numerous feature-specific pages:

* **index.html**: The homepage, featuring main navigation to all other sections.
* **standings/standings.html**: Displays the current league tables.
* **fixtures/fixtures.html**: Shows upcoming and past match results.
* **teams/teams.html**: A directory of teams.
* **team_squad/team_squad.html**: Displays the player roster for a specific team.
* **players/players.html**: A directory of players.
* **player_name/player_name.html**: Shows detailed stats for a specific player.
* **top_scorers/top_scorers.html**: Lists the top goal scorers.
* **top_assists/top_assists.html**: Lists the top assist providers.
* ...and many other pages for assists, cards, injuries, player history, and transfers.

## 💻 Tech Stack & Styles

* **Front-End:** Vanilla HTML5, CSS3, and JavaScript (ES6+).
* **Data:** [API-Football](https://www.api-football.com/) for all statistical data.
* **Development:** Git & GitHub (Feature Branch Workflow).
* **Styles:** The site's global styles are controlled by `style.css` (layout, typography, color) and `media.css` (responsiveness). Each feature folder (e.g., `fixtures/`) also contains its own specific stylesheet (e.g., `fixtures.css`) to keep the project modular and organized.

---

## 🚀 How to Install and Run

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[YourUsername]/Advanced-Pre-Work.git
    ```
    *(Don't forget to replace `[YourUsername]` with your actual GitHub username!)*

2.  **‼️ IMPORTANT: Add Your API Key**

    This project requires a valid API key from [API-Football](https://www.api-football.com/) to function.

    * After cloning, you must get your own API key.
    * In the project, find the JavaScript files (e.g., `fixtures/fixtures.js`, `standings/standings.js`, etc.).
    * Inside each file, find the variable `const API_KEY`.
    * Replace the placeholder string `"PUT_YOUR_REAL_API_KEY_HERE"` with your actual key.

3.  **Navigate to the project directory:**
    ```bash
    cd Advanced-Pre-Work
    ```
4.  **Open in your browser:**
    Open the `index.html` file directly in your preferred web browser.

## 💡 How to Use

The ProSports website provides detailed football statistics. You can navigate to the different pages (Standings, Fixtures, Players, etc.) by clicking on the links in the navigation bar on the homepage.

## 🤝 How to Contribute

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## ✍️ Author

* **Waleed Tarbosh** - *Project Creator*