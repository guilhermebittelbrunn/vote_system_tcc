export default interface Queue<SendPayload = any> {
    send(payload: SendPayload): Promise<void> | void;
}
