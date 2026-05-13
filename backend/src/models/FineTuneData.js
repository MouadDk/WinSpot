import mongoose from 'mongoose';

const fineTuneDataSchema = new mongoose.Schema({
    // Store the local path or cloud URL of the image
    imageUrl: { type: String, required: true },
    
    // This exact array structure is required by LLaVA for fine-tuning
    conversations: [
        {
            from: { type: String, default: 'human' },
            value: { type: String, default: 'Extract the visible text and determine if this is a restaurant.' }
        },
        {
            from: { type: String, default: 'gpt' },
            value: { type: String, required: true } // Holds the stringified JSON result
        }
    ],

    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },

    adminStatus: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    },
    
    createdAt: { type: Date, default: Date.now }
});

// Export it using modern ES syntax
export default mongoose.model('FineTuneData', fineTuneDataSchema);