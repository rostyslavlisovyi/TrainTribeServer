import { AuthResult, UnauthorizedError } from "express-oauth2-jwt-bearer";
import nodemailer, { Transporter } from "nodemailer";
import { NotFoundError } from "../errors/clientErrors.js";
import { IUser } from "../interfaces/user.interface.js";
import { UserModel } from "../models/index.js";

interface FeedbackData {
  name: string;
  email: string;
  message: string;
}

export class FeedbackService {
  private transporter: Transporter;
  protected readonly auth?: AuthResult;

  constructor(auth?: AuthResult) {
    this.auth = auth;
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });
  }

  async getAuthUser(populate?: string | string[]): Promise<IUser> {
    if (!this.auth) {
      throw new UnauthorizedError("User not authenticated");
    }
    const query = UserModel.findOne({
      authId: this.auth.payload.user_id
    });

    if (populate) {
      query.populate(populate);
    }
    const user = (await query) as IUser | null;

    if (!user) {
      throw new NotFoundError("User profile");
    }

    return user;
  }

  async sendFeedback(feedbackData: FeedbackData): Promise<void> {
    try {
      const { name, email, message } = feedbackData;

      const to = process.env.FEEDBACK_RECIPIENT_EMAIL?.split(",")
        ?.map((email) => email.trim())
        ?.filter((email) => email.length > 0);

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: `[TRAINTRIBE APP - FEEDBACK] Nuovo messaggio da ${name}`,
        html: `
          <h2>Nuovo Messaggio da TrainTribeApp: </h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <h3>Messaggio:</h3>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error("Failed to send feedback email", { cause: error });
    }
  }
}
