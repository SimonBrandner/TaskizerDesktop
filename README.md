# Taskizer Desktop

Taskizer Desktop is a desktop client for the the Taskizer App. Taskizer is task-management app.

## Warning

The MacOS version hasn't been tested as I do not have a MacOS device.

## How to

### Install

+ Go to [releases](https://github.com/SimonBrandner/TaskizerDesktop/releases).
+ Download the archive for your platform.
+ Unpack the archive.
+ Go to the unpacked folder.
+ Now you can run `taskizer-desktop`, `taskizer-desktop.exe` or `taskizer-desktop.app`.

### Build

+ Install Node.js
+ Run the following commands.

``` bash
git clone https://github.com/SimonBrandner/TaskizerDesktop.git
cd TaskizerDesktop
npm install
mkdir build
npm run prod-build-linux
```

+ The compiled app should be in `./build/taskizer-desktop<platform>`.

## Roadmap

The roadmap can be found [here](https://github.com/users/SimonBrandner/projects/2).

## Credits

+ Code: [Šimon Brandner](https://github.com/users/SimonBrandner)
+ Icon: [Ondra Reitspies](https://github.com/OReitspies)
