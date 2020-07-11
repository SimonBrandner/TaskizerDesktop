# Taskizer Desktop

Taskizer Desktop is a desktop client for the the Taskizer App. Taskizer is task-management app.

## Features

+ Nested tasks
+ Scheduling
+ Project importing
+ System tray icon
+ Deadlines
+ Keyboard shortcuts

For the features that are coming visit section [Roadmap](#Roadmap).

## Warning

+ Taskizer is in alpha development.
+ The roadmap may change at any point in time.
+ The app was not tested on MacOS.

## How to

### Install

+ Go to [releases](https://github.com/SimonBrandner/TaskizerDesktop/releases).
+ Download the package for your platform. The Windows installer works both on 32 bit and 64 bit systems.

### Build

+ Install [Node.js](https://nodejs.org/)
+ Run the following commands. Replace `<platform>` with `Linux`, `Win` or `Mac`. If you are building for Linux or Mac replace `<arch>` with `32`, `64` or if you're building for Windows simply use `npm run buildWin`.

``` bash
git clone https://github.com/SimonBrandner/TaskizerDesktop.git
cd TaskizerDesktop
npm install
mkdir build
npm run build<platform><arch>
```

+ The compiled app should be in `./build/`.

## Roadmap

The roadmap can be found [here](https://github.com/users/SimonBrandner/projects/2).

## Credits

+ Code: [Šimon Brandner](https://github.com/users/SimonBrandner)
+ Icon: [Ondra Reitspies](https://github.com/OReitspies)
