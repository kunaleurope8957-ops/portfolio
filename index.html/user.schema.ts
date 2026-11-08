import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
    email: string;
      role: 'GLOBAL_TECH_LEAD' | 'ARCHITECT' | 'OPERATOR';
        clearanceLevel: number;
          isActive: boolean;
            createdAt: Date;
            }

            const UserSchema = new Schema<IUser>({
              username: { type: String, required: true, unique: true, trim: true },
                email: { type: String, required: true, unique: true, lowercase: true },
                  role: { 
                      type: String, 
                          enum: ['GLOBAL_TECH_LEAD', 'ARCHITECT', 'OPERATOR'], 
                              default: 'GLOBAL_TECH_LEAD' 
                                },
                                  clearanceLevel: { type: Number, required: true, default: 17 },
                                    isActive: { type: Boolean, default: true },
                                      createdAt: { type: Date, default: Date.now }
                                      });

                                      export const UserModel = model<IUser>('User', UserSchema);
                                      