# jand-web
A web interface for the smash hit [JanD](https://github.com/jan0660/jand).

![image](https://user-images.githubusercontent.com/58811224/203071322-5dfc4e01-24f2-4cd6-8171-54aadf213bab.png)


# Installing

1. Install [NodeJS](https://node.js.org/).
2. Clone the repository and enter it.
3. Run `npm i` to install dependencies.
4. Run `npm run build` to build it.

You can now start jand-web in the background using `npm run start`. It will by default start at `localhost:3000`, but you can change its port using the PORT environment variable.

Installation Script
```
git clone https://github.com/skybird23333/jand-web/
cd jand-web
npm i
npm run build
```

# Running and Updating
The recommended way of running jand-web is to start it with JanD.

```
cd jand-web && jand start jand-web "npm run start"
```

(In future versions) jand-web will auto detect whether it is being run under JanD and will exclude itself from the processes list.

To update:
```
git pull #pull changes
npm i #if any, install additional modules
npm run build #re build the thing
jand restart jandweb #restart jand web
```

# Roadmap

* Stage 1: Basic JanD Features
  - [x] Viewing processes information
  - [x] Restarting/stopping processes
  - [ ] Creating new process on existing dir
  - [x] Viewing the processes logs
  - [ ] Viewing the processes historical logs
  - [x] Sending stuff to process stdin
  - [ ] Changing processes launch config(command, dir, etc)
  - [ ] Saving the list
  - [ ] Deleting processes
* Stage 2: User & permissions
  - [ ] User
  - [ ] Permissions
  - [ ] Registeration?
* Stage 3: Automation/Deployment
  - [ ] Deploy from Github w oauth2(maybe)/git url
  - [ ] Run tasks before/after deploy
* Stage 4: Extensions
  - [ ] The api
  - [ ] Example extension: BDS Config editor
