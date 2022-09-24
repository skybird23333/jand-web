# Contents
- [Contents](#contents)
- [Definitions](#definitions)
- [Processes](#processes)
  - [Get all running processes](#get-all-running-processes)
  - [Edit a processes running config](#edit-a-processes-running-config)
  - [Rename a process](#rename-a-process)
  - [Change process configuration](#change-process-configuration)
  - [Stop a process](#stop-a-process)
  - [Start/restart a process](#startrestart-a-process)
- [Daemon](#daemon)
  - [Get JanD daemon status](#get-jand-daemon-status)
  - [Save the daemon process list](#save-the-daemon-process-list)
  - [Get the daemon config](#get-the-daemon-config)
  - [Edit the daemon config](#edit-the-daemon-config)
- [Console](#console)
  - [Application log stream](#application-log-stream)
  - [Get application log](#get-application-log)
  - [Send command to process](#send-command-to-process)

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

**Types**

Date: A UNIX timestamp of number.

# Processes

## Get all running processes

**GET** `/process/all`

Returns: An array of [jand-ipc.RuntimeProcessInfo](https://github.com/skybird23333/jand-ipc#runtimeprocessinfo--object)

## Edit a processes running config

**PATCH** `/process/:name/runconfig`

> At least one field should be provided.

| Params       | Type    | Description                                                   |
| ------------ | ------- | ------------------------------------------------------------- |
| enabled?     | Boolean | Whether the application will restart once the machine reboots |
| autorestart? | Boolean | The timestamp of the log                                      |

Returns: the modified [jand-ipc.RuntimeProcessInfo](process info)

## Rename a process
**POST** `/process/:name/edit`
> Processes are identified by their name. If your client caches the processes, you should immediately update the cache upon successful request.

| Params | Type   | Description             |
| ------ | ------ | ----------------------- |
| name   | String | Name of the new process |

Returns: the modified [jand-ipc.RuntimeProcessInfo](process info)

## Change process configuration

**PATCH** `/process/:name/config`

> After a successful request, the process then needs to be restarted for this to take effect.

| Params           | Type     | Description                                      |
| ---------------- | -------- | ------------------------------------------------ |
| Filename         | String   | Name of the file/command name without arguments. |
| Arguments        | String[] | An array of arguments for the command.           |
| WorkingDirectory | String   | Working directory of the process.                |

Returns: the modified [jand-ipc.RuntimeProcessInfo](process info)

Examples of filename/arguments

```
Filename          Arguments
"install.sh"      []
"python"          ["app.py"]
"npm"             ["run", "start"]
```


## Stop a process

**POST** `/process/:name/stop`

Returns: the modified [jand-ipc.RuntimeProcessInfo](process info)


## Start/restart a process

**POST** `/process/:name/restart`

Returns: the modified [jand-ipc.RuntimeProcessInfo](process info)

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

# Console

## Application log stream

**GET** `/console/:name/event`

Upon connected, the log stream will send back latest 15 lines of `stdin` and `stderr`.

Each log entry is a JSON object indicating a line and whether it came from `stdin` or `stderr`. If a timestamp is available, it will be sent as well.
| Params | Type                  | Description               |
| ------ | --------------------- | ------------------------- |
| data   | String                | The log entry             |
| type   | `"stdin" \| "stderr"` | The type of the log entry |
| time?  | Date                  | The timestamp of the log  |

## Get application log

**GET** `/console/:name/logs`

Returns an array of log entries, 15 each. See *Application log stream* for type definitions.

## Send command to process

Send a text to the processes `stdin`.

**POST** `/console/:name/send`

| Params | Type   | Description      |
| ------ | ------ | ---------------- |
| data   | String | The text to send |