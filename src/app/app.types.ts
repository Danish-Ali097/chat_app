export type IChat = {
    id: string,
    receipients?: string[],
    messages?: IMesage[]
};

export type IMesage = {
    to: string,
    from: string,
    content: string,
    sentAt: Date,
    receivedAt: Date,
    seenAt: Date,
    sentDate: Date,
    receivedDate: Date,
    seenDate: Date
};