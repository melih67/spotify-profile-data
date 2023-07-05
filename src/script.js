const clientId = "79004ff506514d868c0cfed8eb26fdfb"; // Replace with your client ID
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    getAccessToken(clientId, code)
        .then(accessToken => fetchProfile(accessToken))
        .then(profile => populateUI(profile.profile, profile.playlists))
        .catch(error => console.error(error)); // Log any error
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

async function fetchProfile(token) {

    const profileResult = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!profileResult.ok) {
        throw new Error('Problem fetching profile');
    }

    const playlistsResult = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!playlistsResult.ok) {
        throw new Error('Problem fetching playlists');
    }

    const playlists = await playlistsResult.json();
    const profile = await profileResult.json();

    return { profile, playlists };
}

function populateUI(profile, playlists) {
    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
        document.getElementById("imgUrl").innerText = profile.images[0].url;
    }
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);

    const playlistList = document.getElementById("playlistList");
    playlistList.innerHTML = ''; // Clear the list before adding items

    if (playlists && playlists.items) {
        playlists.items.forEach((playlist) => {
            const playlistItem = document.createElement("li");
            playlistItem.innerText = playlist.name;
            playlistList.appendChild(playlistItem);
        });
    } else {
        const noPlaylistsMessage = document.createElement("p");
        noPlaylistsMessage.innerText = "No playlists found.";
        playlistList.appendChild(noPlaylistsMessage);
    }
}


function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
