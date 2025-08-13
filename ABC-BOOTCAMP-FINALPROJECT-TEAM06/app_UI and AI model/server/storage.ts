import { type CharacterState, type InsertCharacterState } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCharacterState(userId: string): Promise<CharacterState | undefined>;
  updateCharacterState(userId: string, state: Partial<InsertCharacterState>): Promise<CharacterState>;
  createCharacterState(state: InsertCharacterState): Promise<CharacterState>;
}

export class MemStorage implements IStorage {
  private characterStates: Map<string, CharacterState>;

  constructor() {
    this.characterStates = new Map();
    // Initialize default character state
    const defaultState: CharacterState = {
      id: randomUUID(),
      userId: "default_user",
      color: "yellow",
      mood: "calm",
      sleepHours: "7.5시간",
      sleepQuality: "좋음",
      wellnessScore: 85,
      lastPetTime: null,
      lastFeedTime: null,
      updatedAt: new Date(),
    };
    this.characterStates.set("default_user", defaultState);
  }

  async getCharacterState(userId: string): Promise<CharacterState | undefined> {
    return this.characterStates.get(userId);
  }

  async updateCharacterState(userId: string, state: Partial<InsertCharacterState>): Promise<CharacterState> {
    const existing = this.characterStates.get(userId);
    if (!existing) {
      throw new Error("Character state not found");
    }

    const updated: CharacterState = {
      ...existing,
      ...state,
      updatedAt: new Date(),
    };

    this.characterStates.set(userId, updated);
    return updated;
  }

  async createCharacterState(state: InsertCharacterState): Promise<CharacterState> {
    const id = randomUUID();
    const characterState: CharacterState = {
      id,
      userId: state.userId || "default_user",
      color: state.color || "yellow",
      mood: state.mood || "calm",
      sleepHours: state.sleepHours || "7.5시간",
      sleepQuality: state.sleepQuality || "좋음",
      wellnessScore: state.wellnessScore || 85,
      lastPetTime: state.lastPetTime || null,
      lastFeedTime: state.lastFeedTime || null,
      updatedAt: new Date(),
    };
    
    this.characterStates.set(characterState.userId, characterState);
    return characterState;
  }
}

export const storage = new MemStorage();
