// main.js
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { app } from './firebase-init.js';

const auth = getAuth(app);

// ✅ Track auth state reliably (mobile & desktop)
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  console.log("Auth user:", user);
});

// ✅ Helper to block music for unauthenticated users
function checkAuthBeforePlay() {
  if (!currentUser) {
    alert("Please sign in to play music.");
    return false;
  }
  return true;
}

let music_list = [];
let track_index = 0;
let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");
let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
let wave = document.getElementById("wave");
let randomIcon = document.querySelector(".fa-random");
let repeatIcon = document.querySelector(".repeat-track i");
let curr_track = new Audio();
let updateTimer;
let isPlaying = false;
let isRandom = false;
let isRepeat = false;

// ✅ Parse query song
const params = new URLSearchParams(window.location.search);
const songURL = params.get('url');
const title = params.get('title');
const artist = params.get('artist');
const cover = params.get('cover');

if (songURL && title && artist) {
  music_list = [{
    name: title,
    artist: artist,
    img: cover || 'assets/images/default.jpg',
    music: songURL
  }];
  track_index = 0;
  loadTrack(track_index);
} else {
  window.addEventListener('DOMContentLoaded', async () => {
    music_list = await fetchSongsFromBackend();
    if (music_list.length > 0) {
      loadTrack(track_index);
      displaySongList();
    } else {
      track_name.textContent = "No songs";
      track_artist.textContent = "";
    }
  });
}

async function fetchSongsFromBackend() {
  try {
    const res = await fetch("http://192.168.5.6:5000/songs"); // <- Use your real IP
    const songs = await res.json();
    return songs.map(song => ({
      name: song.title,
      artist: song.artist,
      img: song.cover || 'assets/images/default.jpg',
      music: song.url
    }));
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

function loadTrack(index) {
  clearInterval(updateTimer);
  reset();

  curr_track.src = music_list[index].music;
  curr_track.load();

  track_art.style.backgroundImage = `url(${music_list[index].img})`;
  track_name.textContent = music_list[index].name;
  track_artist.textContent = music_list[index].artist;

  now_playing.textContent = `Playing music ${index + 1} of ${music_list.length}`;
  updateTimer = setInterval(setUpdate, 1000);
  curr_track.onended = () => isRepeat ? repeatSong() : nextTrack();
}

function reset() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  if (!checkAuthBeforePlay()) return;

  curr_track.play()
    .then(() => {
      isPlaying = true;
      track_art.classList.add("rotate");
      wave.classList.add("loader");
      playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
    })
    .catch((error) => {
      console.error("Playback error:", error);
      alert("🎧 Tap the screen or press play again to allow music playback on mobile.");
    });
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  track_art.classList.remove("rotate");
  wave.classList.remove("loader");
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
  track_index = isRandom ? Math.floor(Math.random() * music_list.length) : (track_index + 1) % music_list.length;
  loadTrack(track_index);
  playTrack();
  displaySongList();
}

function prevTrack() {
  track_index = isRandom ? Math.floor(Math.random() * music_list.length) : (track_index - 1 + music_list.length) % music_list.length;
  loadTrack(track_index);
  playTrack();
  displaySongList();
}

function randomTrack() {
  isRandom = !isRandom;
  randomIcon.style.color = isRandom ? "red" : "white";
}

function repeatTrack() {
  isRepeat = !isRepeat;
  if (repeatIcon) repeatIcon.style.color = isRepeat ? "blue" : "white";
}

function repeatSong() {
  curr_track.currentTime = 0;
  curr_track.play();
}

function seekTo() {
  curr_track.currentTime = curr_track.duration * (seek_slider.value / 100);
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function setUpdate() {
  if (!isNaN(curr_track.duration)) {
    seek_slider.value = curr_track.currentTime * (100 / curr_track.duration);

    const currentMinutes = Math.floor(curr_track.currentTime / 60).toString().padStart(2, '0');
    const currentSeconds = Math.floor(curr_track.currentTime % 60).toString().padStart(2, '0');
    const durationMinutes = Math.floor(curr_track.duration / 60).toString().padStart(2, '0');
    const durationSeconds = Math.floor(curr_track.duration % 60).toString().padStart(2, '0');

    curr_time.textContent = `${currentMinutes}:${currentSeconds}`;
    total_duration.textContent = `${durationMinutes}:${durationSeconds}`;
  }
}

function displaySongList() {
  const list = document.getElementById('song-list');
  if (!list) return;
  list.innerHTML = '';
  music_list.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${track.name} — ${track.artist}`;
    li.classList.add('song-item');
    li.onclick = () => {
      track_index = index;
      loadTrack(index);
      playTrack();
      displaySongList();
    };
    if (index === track_index) li.style.background = '#333';
    list.appendChild(li);
  });
}

// ✅ Search Songs
const searchInput = document.getElementById("search-bar");
const searchResults = document.getElementById("search-results");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    searchResults.innerHTML = "";

    music_list.forEach((track, index) => {
      if (
        track.name.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query)
      ) {
        const result = document.createElement("li");
        result.textContent = `${track.name} - ${track.artist}`;
        result.onclick = () => {
          track_index = index;
          loadTrack(index);
          playTrack();
          searchResults.innerHTML = "";
          searchInput.value = "";
        };
        searchResults.appendChild(result);
      }
    });
  });
}

// ✅ Hook up controls
playpause_btn.addEventListener("click", playpauseTrack);
next_btn.addEventListener("click", nextTrack);
prev_btn.addEventListener("click", prevTrack);
randomIcon.addEventListener("click", randomTrack);
if (repeatIcon) repeatIcon.addEventListener("click", repeatTrack);
seek_slider.addEventListener("input", seekTo);
volume_slider.addEventListener("input", setVolume);

function toggleSongList() {
  const list = document.getElementById('song-list-section');
  if (list) list.classList.toggle('visible');
}
