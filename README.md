# Taskizer Desktop

Taskizer Desktop is a desktop client for the the Taskizer App. Taskizer is task-management app. It is not dependent on any backend, therefore there is no necessity to pay for a server, thus the app can be completely free. The projects and config are saved in JSON format making them easily readable. I am planning on implementing sync using third-party cloud services like Google Drive and others.

It was built using Angular and Electron.

## Features

+ Nested tasks
+ Scheduling
+ Project importing
+ System tray icon
+ Deadlines
+ Keyboard shortcuts
+ Repeated tasks
+ Repeat presets
+ Multiple themes
+ Reminders

For the features that are coming visit section [Roadmap](#Roadmap).

## Warning

+ Taskizer is in beta development.
+ The roadmap may change at any point in time.

## How to

### Install

#### Debian

``` bash
sudo apt install -y curl
sudo curl "https://bintray.com/user/downloadSubjectPublicKey?username=bintray" | sudo apt-key add
echo "deb https://dl.bintray.com/simonbrandner/simon-s-debian-repo default main" | sudo tee -a /etc/apt/sources.list.d/simon-s-debian-repo.list
sudo apt update
sudo apt install taskizer
```

#### RPM

``` bash
sudo yum install -y curl wget
sudo curl "https://bintray.com/user/downloadSubjectPublicKey?username=bintray" | sudo rpm --import
sudo wget https://bintray.com/simonbrandner/simon-s-rpm-repo/rpm -O /etc/yum.repos.d/bintray-simonbrandner-simon-s-rpm-repo.repo
sudo yum install taskizer
```

#### Other

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
