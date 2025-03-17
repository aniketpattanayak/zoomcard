import { members, type Member, type InsertMember } from "@shared/schema";

export interface IStorage {
  createMember(member: InsertMember): Promise<Member>;
  getMember(id: number): Promise<Member | undefined>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  getAllMembers(): Promise<Member[]>;
}

export class MemStorage implements IStorage {
  private members: Map<number, Member>;
  private currentId: number;

  constructor() {
    this.members = new Map();
    this.currentId = 1;
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = this.currentId++;
    const cardNumber = `AMP${String(id).padStart(6, '0')}`;
    const member: Member = {
      ...insertMember,
      id,
      cardNumber,
      paymentAmount: 9440, // 8000 + 18% GST
      paymentStatus: "completed",
    };
    this.members.set(id, member);
    return member;
  }

  async getMember(id: number): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    return Array.from(this.members.values()).find(
      (member) => member.email === email
    );
  }

  async getAllMembers(): Promise<Member[]> {
    return Array.from(this.members.values());
  }
}

export const storage = new MemStorage();
