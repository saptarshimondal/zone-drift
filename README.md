<div id="top"></div>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/saptarshimondal/zone-drift">
    <img src="https://raw.githubusercontent.com/saptarshimondal/zone-drift/main/src/icons/icon-512.png" alt="ZoneDrift Logo" width="100" height="100">
  </a>

  <h3 align="center">ZoneDrift</h3>
  <p align="center">
    A powerful, cross-browser extension to effortlessly mock and spoof your timezone dynamically per-tab or globally.
    <br />
    <a href="#how-to-use"><strong>How to use »</strong></a>
    <br />
    <br />
    <a href="https://github.com/saptarshimondal/zone-drift/issues">Report Bug</a>
    ·
    <a href="https://github.com/saptarshimondal/zone-drift/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#quick-start">Quick Start</a></li>
    <li><a href="#permissions">Permissions</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#how-to-use">How To Use</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#development-setup">Development Setup</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

ZoneDrift is a lightweight, high-performance browser extension that allows you to trick websites into thinking you are in a completely different timezone. Built with Vanilla JS (MVC architecture) and TailwindCSS under a modern Vite build system, it offers a seamless way to test localization, bypass region locks, or protect your privacy.

<p align="right">(<a href="#top">back to top</a>)</p>

## Quick Start

1. Install the extension (see **<a href="#installation">Installation</a>** below).
2. Click the <img src="https://raw.githubusercontent.com/saptarshimondal/zone-drift/main/src/icons/icon-192.png" width="24" height="24" alt="Icon" style="vertical-align: middle"> extension icon in your browser toolbar.
3. Search for a timezone (e.g., "Asia/Tokyo" or "Europe/London").
4. Select the scope: **This Tab Only** or **Global**.
5. Click **Apply & Reload Tab**.

## Permissions

This extension only requires minimal permissions to operate securely:
- **storage**: Required to save your timezone preferences locally.
- **scripting**: Allows the extension to safely inject the timezone overriding scripts dynamically into the pages you visit.
- **tabs**: Allows the extension to reload tabs automatically when applying a timezone.
- **host permissions (`<all_urls>`)**: Required to allow the timezone spoofing logic to attach to any web page you navigate to.
- **webNavigation**: Used to seamlessly apply the timezone the millisecond the page begins loading.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- FEATURES -->
## Features

- **Granular Control**: Choose whether to apply a timezone to a **single specific tab** or establish a **Global** rule for your entire browser.
- **Aggressive SPA Support**: Automatically prepends `[ZoneDrift: {Timezone}]` to your tab's title to let you know it's active. Uses an advanced DOM mutation observer to ensure single-page applications (like React or GitHub) cannot overwrite the indicator.
- **Instant Visual Indicators**: Your extension icon will glow green with an "ON" badge when the current tab is being mocked.
- **Deep JS Mocking**: Seamlessly overrides `Intl.DateTimeFormat` and native `Date` objects directly in the page's MAIN execution world, bypassing typical extension sandbox limitations.
- **Safe Fallbacks**: You can explicitly opt-out a specific tab from a Global rule, reverting it independently to your system default.
- **Built-in Testing**: Instantly click the test button to open `webbrowsertools.com` and verify your spoofed timezone works.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- HOW TO USE -->
## How To Use

1. **Search & Select**: Open the extension and type a city, country, or timezone code into the search bar. The dropdown will filter automatically.
2. **Apply Scope**: 
   - **This Tab Only**: Only the currently active tab will drift to the new timezone.
   - **Global**: All current and future tabs will instantly adopt the selected timezone.
3. **Hard Reset**: Click the "Reset to System Default" button at any time. If you do this under the Global tab, it acts as a "kill switch" and completely sanitizes your browser back to the real system clock.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Installation

#### Google Chrome
1. Go to the [Releases][releases-url] page.
2. Download the latest `zonedrift-vX.X.X-chrome.zip` release.
3. Unzip the downloaded file.
4. Open Google Chrome and visit the `chrome://extensions` page.
5. Turn on **Developer mode** in the top right.
6. Click **Load unpacked** and select the unzipped folder.

#### Firefox
1. Go to the [Releases][releases-url] page.
2. Download the latest `zonedrift-vX.X.X-firefox.xpi` release.
3. Open the downloaded `.xpi` file with Firefox (drag and drop it into a Firefox window, or open `about:addons`, click the gear icon, and select **Install Add-on From File…**).
*(Note: If you are a developer and want to load it temporarily, you can alternatively download `zonedrift-vX.X.X-firefox.zip` and load it via `about:debugging#/runtime/this-firefox`)*

### Development Setup

Want to compile the project yourself? ZoneDrift uses a unified Vite build system that automatically generates specialized builds for both Chrome (Manifest V3 Service Workers) and Firefox (Manifest V3 Background Scripts).

#### Prerequisites
* [Node.js](https://nodejs.org/) (v20+ recommended)

#### Setting up

1. Clone the repo
   ```sh
   git clone https://github.com/saptarshimondal/zone-drift.git
   cd zone-drift
   ```

2. Install NPM packages
   ```sh
   npm install
   ```

3. **Development Build (Watch Mode)**:
   This will run Vite in watch mode. Every time you save a file, it will instantly re-bundle the project.
   ```sh
   npm run watch
   ```

4. **Production Build**:
   When you are ready to compile the final distribution folders (`dist/chrome` and `dist/firefox`):
   ```sh
   npm run build
   ```
   *Note: This command runs the Vite build and then automatically executes `scripts/patch-manifest.js` to create the browser-specific distributables.*

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Initial Timezone mocking logic
- [x] UI implementation with Tailwind CSS
- [x] Tab-specific vs Global scope logic
- [x] Cross-browser Vite compilation pipeline
- [x] Aggressive Tab Title mutation tracking
- [ ] Add explicit settings page

See the [open issues][issues-url] for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Saptarshi Mondal - [@Saptarshi_77](https://twitter.com/Saptarshi_77) - mondalsaptarshi7@gmail.com

Project Link: [GitHub Repo][repo-url]

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/saptarshimondal/zone-drift?style=for-the-badge
[contributors-url]: https://github.com/saptarshimondal/zone-drift/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/saptarshimondal/zone-drift?style=for-the-badge
[forks-url]: https://github.com/saptarshimondal/zone-drift/network/members
[stars-shield]: https://img.shields.io/github/stars/saptarshimondal/zone-drift?style=for-the-badge
[stars-url]: https://github.com/saptarshimondal/zone-drift/stargazers
[issues-shield]: https://img.shields.io/github/issues/saptarshimondal/zone-drift?style=for-the-badge
[issues-url]: https://github.com/saptarshimondal/zone-drift/issues
[license-shield]: https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge
[license-url]: https://github.com/saptarshimondal/zone-drift/blob/main/LICENSE
[releases-url]: https://github.com/saptarshimondal/zone-drift/releases
[repo-url]: https://github.com/saptarshimondal/zone-drift
