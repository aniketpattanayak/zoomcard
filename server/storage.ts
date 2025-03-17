import { Member, type IMember } from "./models/Member";

export interface IStorage {
  createMember(member: Omit<IMember, "_id">): Promise<IMember>;
  getMember(id: string): Promise<IMember | null>;
  getMemberByEmail(email: string): Promise<IMember | null>;
  getAllMembers(): Promise<IMember[]>;
}

export class MongoStorage implements IStorage {
  async createMember(insertMember: Omit<IMember, "_id">): Promise<IMember> {
    const member = new Member({
      ...insertMember,
    });

    await member.save();
    return member;
  }

  async getMember(id: string): Promise<IMember | null> {
    return await Member.findById(id);
  }

  async getMemberByEmail(email: string): Promise<IMember | null> {
    return await Member.findOne({ email });
  }

  async getAllMembers(): Promise<IMember[]> {
    return await Member.find();
  }
}

export const storage = new MongoStorage();
