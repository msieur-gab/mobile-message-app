// Database service using Dexie
class MessageAppDB extends Dexie {
    constructor() {
        super('MessageAppDB');
        
        // Version 1 - Original schema
        this.version(1).stores({
            profiles: 'id, displayName, mainTranslation',
            categories: 'id, title, order'
        });

        // Version 2 - Updated field names for language neutrality
        this.version(2).stores({
            profiles: 'id, displayName, mainTranslation',
            categories: 'id, title, order'
        }).upgrade(tx => {
            // Migrate profiles - update nickname field names
            return tx.table('profiles').toCollection().modify(profile => {
                if (profile.nicknames) {
                    profile.nicknames.forEach(nickname => {
                        // Migrate fr_value -> baseLang_value
                        if (nickname.fr_value && !nickname.baseLang_value) {
                            nickname.baseLang_value = nickname.fr_value;
                            delete nickname.fr_value;
                        }
                        // Migrate cn_value -> targetLang_value
                        if (nickname.cn_value && !nickname.targetLang_value) {
                            nickname.targetLang_value = nickname.cn_value;
                            delete nickname.cn_value;
                        }
                    });
                }
            }).then(() => {
                // Migrate categories - update phrase field names and placeholders
                return tx.table('categories').toCollection().modify(category => {
                    if (category.phrases) {
                        category.phrases.forEach(phrase => {
                            // Migrate fr -> baseLang
                            if (phrase.fr && !phrase.baseLang) {
                                phrase.baseLang = phrase.fr.replace(/{nom}/g, '{name}');
                                delete phrase.fr;
                            }
                            // Migrate cn -> targetLang
                            if (phrase.cn && !phrase.targetLang) {
                                phrase.targetLang = phrase.cn.replace(/{nom}/g, '{name}');
                                delete phrase.cn;
                            }
                        });
                    }
                });
            });
        });
    }
}

export const db = new MessageAppDB();

// Database operations
export const DatabaseService = {
    // Generic operations
    async get(table, id) {
        return await db[table].get(id);
    },

    async getAll(table) {
        return await db[table].toArray();
    },

    async add(table, data) {
        return await db[table].add(data);
    },

    async update(table, id, data) {
        return await db[table].update(id, data);
    },

    async put(table, data) {
        return await db[table].put(data);
    },

    async delete(table, id) {
        return await db[table].delete(id);
    },

    async clear(table) {
        return await db[table].clear();
    },

    // Specific operations
    async getAllProfiles() {
        return await this.getAll('profiles');
    },

    async getAllCategories() {
        const categories = await this.getAll('categories');
        return categories.sort((a, b) => a.order - b.order);
    }
};