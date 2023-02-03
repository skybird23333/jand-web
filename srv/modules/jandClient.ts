import { JandIpcClient } from "jand-ipc";

export const jandClient = new JandIpcClient('/core')

jandClient.DEBUG = true