# jand-web
A web interface for the smash hit [JanD](https://github.com/jan0660/jand).

![image](https://user-images.githubusercontent.com/58811224/189389631-fba7794d-7ee9-4648-bf63-a40ac3cfea0a.png)

# Installing

1. Install [NodeJS](https://node.js.org/).
2. Clone the repository, and run `npm i`.

# Running
The recommended way of running jand-web is to start it with JanD.

```
cd jand-web && jand start jand-web "npm run start"
```

(In future versions) jand-web will auto detect whether it is being run under JanD and will exclude itself from the processes list.

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
