export interface FeedbackMessage {
    feedbackMessageId: number;
    feedbackId: number;
    senderId: string;
    senderEmail: string;
    responderId: string | null;
    responderEmail: string | null;
    feedback: string;
    response: string;
    created_at: Date | null;
    updated_at: Date | null;
    isdeleted: boolean | null;
    deleted_at: Date | null;
}