# Spotify Profile Demo

This project demonstrates how to authenticate with Spotify and display a user's profile data using the Spotify Web API.

## Features

- Authenticate with Spotify and obtain an access token
- Fetch the user's profile data using the access token
- Display the user's profile information, including display name, user ID, email, Spotify URI, link, and profile image

## Technologies Used

- JavaScript
- HTML
- CSS (Tailwind CSS)
- Spotify Web API

## Setup Instructions

1. Clone the repository:

git clone https://github.com/melih67/spotify-profile-data.git

2. Navigate to the project directory:

cd spotify-profile-demo

3. Open the `index.html` file in a web browser:

open index.html

4. Follow the authentication flow to log in with your Spotify account.

5. Once logged in, the page will display your Spotify profile information.

## Configuration

To configure the project, you need to set your Spotify client ID in the `src/script.js` file:

const clientId = "your-client-id-here";

Replace "your-client-id-here" with your actual Spotify client ID.

## Dependencies

This project uses the following dependencies:

- Tailwind CSS (CDN link included in the HTML file)

## Contributing

Contributions are welcome! If you have any suggestions, improvements, or bug fixes, please submit a pull request.
