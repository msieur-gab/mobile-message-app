// Generate unique IDs
export function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Create DOM elements with attributes
export function createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

// Template replacement
export function replaceTemplate(template, replacements) {
    return template.replace(/{(\w+)}/g, (match, key) => {
        const replacement = replacements[key];
        
        // If replacement is empty, remove the placeholder and any preceding comma/space
        if (!replacement || replacement.trim() === '') {
            // Look for patterns like ", {nom}" or " {nom}" and remove them completely
            const pattern = new RegExp(`[,\\s]*\\s*\\{${key}\\}`, 'g');
            return template.includes(pattern.source.replace(/\\\\/g, '\\')) ? '' : match;
        }
        
        return replacement;
    });
}

// Specialized template replacement for English names that handles punctuation better
export function replaceNameTemplate(template, replacements) {
    let result = template;
    
    Object.entries(replacements).forEach(([key, value]) => {
        if (!value || value.trim() === '') {
            // Remove the placeholder and any preceding comma with optional spaces
            // Patterns: ", {name}", " , {name}", ",{name}", " {name}"
            result = result.replace(new RegExp(`\\s*,\\s*\\{${key}\\}`, 'g'), '');
            result = result.replace(new RegExp(`\\s+\\{${key}\\}`, 'g'), '');
            result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), '');
        } else {
            result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
        }
    });
    
    // Clean up any double spaces or trailing/leading spaces
    return result.replace(/\s+/g, ' ').trim();
}

// Specialized template replacement for Chinese names that handles Chinese punctuation
export function replaceChineseNameTemplate(template, replacements) {
    let result = template;
    
    Object.entries(replacements).forEach(([key, value]) => {
        if (!value || value.trim() === '') {
            // Remove the placeholder and any preceding Chinese comma
            // Patterns: "，{name}", " ，{name}", "， {name}"
            result = result.replace(new RegExp(`\\s*，\\s*\\{${key}\\}`, 'g'), '');
            result = result.replace(new RegExp(`，\\{${key}\\}`, 'g'), '');
            result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), '');
        } else {
            result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
        }
    });
    
    // Clean up any remaining punctuation issues
    return result.trim();
}

// Debounce function
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}