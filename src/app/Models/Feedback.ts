import { FeedbackMessage } from "./FeedbackMessage";

export interface Feedback {
    feedbackId: number;
    title: string;
    fullname: string;
    senderId: string;
    senderEmail: string;
    responderId: string;
    responderEmail: string;
    created_at: string;
    updated_at: string;
    isdeleted: boolean;
    deleted_at: any;
    isresponded: boolean;
    FeedbackMessages: FeedbackMessage[];
}
  
