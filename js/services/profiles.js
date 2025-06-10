import { DatabaseService } from './database.js';
import { DEFAULT_PROFILES } from '../config/defaults.js';
import { eventBus, EVENTS } from '../utils/events.js';
import { generateId } from '../utils/helpers.js';

export const ProfileService = {
    async initialize() {
        const profiles = await DatabaseService.getAllProfiles();
        if (profiles.length === 0) {
            // Initialize with default profiles
            for (const profile of DEFAULT_PROFILES) {
                await DatabaseService.put('profiles', profile);
            }
        }
        eventBus.emit(EVENTS.PROFILES_UPDATED);
    },

    async getAllProfiles() {
        return await DatabaseService.getAllProfiles();
    },

    async createProfile(displayName, mainTranslation) {
        const newProfile = {
            id: generateId(),
            displayName,
            mainTranslation,
            image: `https://placehold.co/64x64/ccc/333?text=${displayName.charAt(0)}`,
            nicknames: []
        };
        
        await DatabaseService.put('profiles', newProfile);
        eventBus.emit(EVENTS.PROFILES_UPDATED);
        return newProfile;
    },

    async updateProfile(id, updates) {
        await DatabaseService.update('profiles', id, updates);
        eventBus.emit(EVENTS.PROFILES_UPDATED);
    },

    async deleteProfile(id) {
        await DatabaseService.delete('profiles', id);
        eventBus.emit(EVENTS.PROFILES_UPDATED);
    },

    async addNickname(profileId, display, targetLangValue) {
        const profile = await DatabaseService.get('profiles', profileId);
        if (profile) {
            const nickname = {
                id: generateId(),
                display,
                baseLang_value: display,
                targetLang_value: targetLangValue
            };
            profile.nicknames.push(nickname);
            await DatabaseService.put('profiles', profile);
            eventBus.emit(EVENTS.PROFILES_UPDATED);
            return nickname;
        }
    },

    async updateNickname(profileId, nicknameId, updates) {
        const profile = await DatabaseService.get('profiles', profileId);
        if (profile) {
            const nickname = profile.nicknames.find(n => String(n.id) === String(nicknameId));
            if (nickname) {
                Object.assign(nickname, updates);
                await DatabaseService.put('profiles', profile);
                eventBus.emit(EVENTS.PROFILES_UPDATED);
            }
        }
    },

    async deleteNickname(profileId, nicknameId) {
        const profile = await DatabaseService.get('profiles', profileId);
        if (profile) {
            profile.nicknames = profile.nicknames.filter(n => String(n.id) !== String(nicknameId));
            await DatabaseService.put('profiles', profile);
            eventBus.emit(EVENTS.PROFILES_UPDATED);
        }
    }
};