# Contents
- [Contents](#contents)
- [Definitions](#definitions)
- [Read before you start](#read-before-you-start)
  - [Fatal Error](#fatal-error)
- [Processes](#processes)
  - [Get Complete Current status](#get-complete-current-status)
  - [Get all processes(deprecated)](#get-all-processesdeprecated)
  - [Edit a processes running config](#edit-a-processes-running-config)
  - [Rename a process](#rename-a-process)
  - [Change process configuration](#change-process-configuration)
  - [Get a processes information](#get-a-processes-information)
  - [Stop a process](#stop-a-process)
  - [Start/restart a process](#startrestart-a-process)
- [Daemon](#daemon)
  - [Get JanD daemon status](#get-jand-daemon-status)
  - [Save the daemon process list](#save-the-daemon-process-list)
  - [Get the daemon config](#get-the-daemon-config)
  - [Edit the daemon config](#edit-the-daemon-config)
  - [Get the system information](#get-the-system-information)
- [Console](#console)
  - [Application log stream](#application-log-stream)
  - [Get application log](#get-application-log)
  - [Send command to process](#send-command-to-process)
- [Multimachine Support](#multimachine-support)
  - [Setup](#setup)

# Definitions

**Base URL**

In development/debug mode, the app and the server runs on different addresses.

In production mode, the app is served from the root of the server.
```
localhost:3001/api
```

**Error handling**

Errors use the standard HTTP response code(404, 403 etc.). Error responses are not in JSON format, but plain text.

**Data format**

Use JSON in request body unless specified otherwise. Upon a successful request, an endpoint might return 200 OK or 204 No Content if the endpoint doesnt specify a return value.

> NOTE: This documentation will reference a lot of types and interfaces from npm package jand-ipc unless stated otherwise.

**Types**

Date: A UNIX timestamp of number.


# Read before you start

## Fatal Error
If the server is unable to run for any reason(e.g unable to connect to JanD), the following JSON object will be returned for every request, with status code 503. The client should not attempt to make any other requests and should display the error message to the user. The client should always instruct the user to restart the server, as it will not change the status unless restarted.

The server will not return 503 ander any other cases.

| Params  | Type          | Description                                                   |
| ------- | ------------- | ------------------------------------------------------------- |
| errors? | JandWebErrors | The type of error occured. Their details are explained below. |

JandWebErrors:
| Error            | Description                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| "jand-conn-fail" | The target jand-web server was unable to connect to JanD through the default IPC pipe name.                              |
| "unknown"        | The target jand-web server was unable to start for an unknown reason. Check server logs for more details. |
# Processes

## Get Complete Current status

**GET** /status

Returns: the following JSON Object
| Params    | Type                                                              | Description                        |
| --------- | ----------------------------------------------------------------- | ---------------------------------- |
| processes | jand-ipc.RunTimeProcessInfo[]                                     | A list of processes on the machine |
| daemon    | jand-ipc.DaemonStatus                                             | JanD status object                 |
| system    | Response of [Get System Information](#get-the-system-information) | The system object.                 |

## Get all processes(deprecated)

> Deprecated: Use [Get Complete Current status](#get-complete-current-status) instead.

**GET** `/process/all`

Returns: An array of [jand-ipc.RuntimeProcessInfo](https://github.com/skybird23333/jand-ipc#runtimeprocessinfo--object)

## Edit a processes running config

**PATCH** `/process/:name/runconfig`

> At least one field should be provided.

| Params       | Type    | Description                                                   |
| ------------ | ------- | ------------------------------------------------------------- |
| enabled?     | Boolean | Whether the application will restart once the machine reboots |
| autorestart? | Boolean | The timestamp of the log                                      |

Returns: the modified [jand-ipc.RuntimeProcessInfo](https://github.com/skybird23333/jand-ipc#runtimeprocessinfo--object)

## Rename a process
**POST** `/process/:name/edit`
> Processes are identified by their name. If your client caches the processes, you should immediately update the cache upon successful request.

| Params | Type   | Description             |
| ------ | ------ | ----------------------- |
| name   | String | Name of the new process |

Returns: the modified [jand-ipc.RuntimeProcessInfo](https://github.com/skybird23333/jand-ipc#runtimeprocessinfo--object)

## Change process configuration

**PATCH** `/process/:name/config`

> After a successful request, the process then needs to be restarted for this to take effect.

| Params           | Type     | Description                                      |
| ---------------- | -------- | ------------------------------------------------ |
| Filename         | String   | Name of the file/command name without arguments. |
| Arguments        | String[] | An array of arguments for the command.           |
| WorkingDirectory | String   | Working directory of the process.                |

Returns: the modified [jand-ipc.RuntimeProcessInfo](https://github.com/skybird23333/jand-ipc#runtimeprocessinfo--object)

Examples of filename/arguments

```
Filename          Arguments
"install.sh"      []
"python"          ["app.py"]
"npm"             ["run", "start"]
```


## Get a processes information
**GET** `/process/:name`

Returns: the [jand-ipc.RuntimeProcessInfo](https://github.com/skybird23333/jand-ipc#runtimeprocessinfo--object)

## Stop a process

**POST** `/process/:name/stop`

Returns: the modified [jand-ipc.RuntimeProcessInfo](https://github.com/skybird23333/jand-ipc#runtimeprocessinfo--object)


## Start/restart a process

**POST** `/process/:name/restart`

Returns: the modified [jand-ipc.RuntimeProcessInfo](https://github.com/skybird23333/jand-ipc#runtimeprocessinfo--object)

If the process is not running, this will start it up. If it is already running, this will stop it then start it again.

# Daemon

## Get JanD daemon status

**GET** `/daemon/status`

Returns: [jand-ipc.DaemonStatus](https://github.com/skybird23333/jand-ipc#daemonstatus--object)

## Save the daemon process list

**POST** `/daemon/save`

## Get the daemon config
**GET** `/daemon/config`

## Edit the daemon config

**PATCH** `/daemon/config`

For list of fields, see [jand-ipc.Config](https://github.com/skybird23333/jand-ipc#config--object)

## Get the system information

**GET** `/daemon/system`

| Params   | Type   | Description                                              |
| -------- | ------ | -------------------------------------------------------- |
| hostname | String | The hostname(machine name) of the current active machine |
| username | String | The current user name(that is running jand web)          |

# Console

## Application log stream

**GET** `/console/:name/event`

Upon connected, the log stream will send back latest 15 lines of `stdin` and `stderr`.

Each log entry is a JSON object indicating a line and whether it came from `stdin` or `stderr`. If a timestamp is available, it will be sent as well.
| Params | Type                                                  | Description               |
| ------ | ----------------------------------------------------- | ------------------------- |
| data   | String                                                | The log entry             |
| type   | `"stdin" \| "stderr" \| "procstart" \| "procstop" \|` | The type of the log entry |
| time?  | Date                                                  | The timestamp of the log  |

## Get application log

**GET** `/console/:name/logs`

Returns an array of log entries, 15 each. See *Application log stream* for type definitions.

## Send command to process

Send a text to the processes `stdin`.

**POST** `/console/:name/send`

| Params | Type   | Description      |
| ------ | ------ | ---------------- |
| data   | String | The text to send |

# Multimachine Support
Multimachine allows accessing jand and jand-web across multiple machines within one jand-web app.
```
app
 |
 v
srv(main) - - - - - - - - - - - - {...}    
 |            |           |       
 |            v           v      
 |          srv(peer)  srv(peer)
 |            |           |      
 v            v           v      
jand         jand        jand
```

## Setup
1. User initiates a MM network on the main machine.
2. srv(main) generates a configuration file which is to be placed inside the srv(peer) directory.
> The file contains a hash of the main machine's token.
3. User should then reboot peer. Peer will start as peer mode output settings(i.e IP, port) to the console.
4. User input the details from peer into main.
5. Main initiates a connection test with peer.