import { prisma } from "./prisma";

export interface ConversationState {
  step: number;
  product_name?: string;
  user_name?: string;
}

export class ConversationHandler {
  static async getState(contactNumber: string): Promise<ConversationState> {
    let conversation = await prisma.conversation.findUnique({
      where: {
        contact_number: contactNumber,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          contact_number: contactNumber,
          step: 0,
        },
      });
    }

    return {
      step: conversation.step,
      product_name: conversation.product_name || undefined,
      user_name: conversation.user_name || undefined,
    };
  }

  static async updateState(
    contactNumber: string,
    updates: Partial<ConversationState>
  ): Promise<void> {
    await prisma.conversation.update({
        where : {
            contact_number : contactNumber,
        },
        data : updates
    })
  }
  static async clearState(contactNumber: string): Promise<void> {
    await prisma.conversation.delete({
      where: { contact_number: contactNumber },
    });
  }

  static async processMessage(contactNumber : string , message : string){
    const state = await this.getState(contactNumber);
    const trimmedMessage = message.trim();

    switch(state.step){
        case 0:
            await this.updateState(contactNumber , {step : 1});
            return 'Which product is this review for?';
        
        case 1:
            await this.updateState(contactNumber , {step : 2 , product_name : trimmedMessage});
            return "What's your name?";
        
        case 2:
        await this.updateState(contactNumber, { step: 3, user_name: trimmedMessage });
        return `Please send your review for ${state.product_name}.`;
        
        case 3:
        if (!state.product_name || !state.user_name) {
          await this.clearState(contactNumber);
          return 'Something went wrong. Let’s start over. Which product is this review for?';
        }

        await prisma.review.create({
            data : {
                contact_number : contactNumber,
                user_name : state.user_name,
                product_name: state.product_name,
                product_review: trimmedMessage,
            }
        });

        await this.clearState(contactNumber);

        return `Thanks ${state.user_name} -- your review for ${state.product_name} has been recorded.`;

        default:
        await this.updateState(contactNumber, { step: 0 });
        return 'Which product is this review for?';
    }
  }
}
