/**
 * Base class for all command handlers
 * Defines the common interface that all command handlers must implement
 */
class BaseCommand {
    constructor(commandId) {
        this.commandId = commandId;
        this.config = this.getDefaultConfig();
        this.loadConfigFromServer();

        // Mix in the editor functionality
        this.mixinEditorMethods();
    }

    /**
     * Mix in editor methods from CommandEditorMixin
     */
    mixinEditorMethods() {
        if (typeof CommandEditorMixin !== 'undefined') {
            const mixinMethods = Object.getOwnPropertyNames(CommandEditorMixin.prototype)
                .filter(name => name !== 'constructor' && typeof CommandEditorMixin.prototype[name] === 'function');

            console.log(`Mixing in editor methods for ${this.commandId}:`, mixinMethods);

            mixinMethods.forEach(methodName => {
                this[methodName] = CommandEditorMixin.prototype[methodName].bind(this);
            });

            console.log(`${this.commandId} now has showEditModal:`, typeof this.showEditModal);
        } else {
            console.error(`CommandEditorMixin not available for ${this.commandId}`);
        }
    }

    /**
     * Render the UI for this command
     * @param {HTMLElement} container - The container element to render into
     */
    render(container) {
        throw new Error('render() method must be implemented by subclass');
    }

    /**
     * Attach event listeners for this command's UI elements
     */
    attachListeners() {
        throw new Error('attachListeners() method must be implemented by subclass');
    }

    /**
     * Get the payload data for this command
     * @returns {Array} Array of bytes representing the payload
     */
    getPayload() {
        throw new Error('getPayload() method must be implemented by subclass');
    }

    /**
     * Get the packet type for this command
     * @returns {number} Packet type (0=COMMAND, 1=NOTIFICATION, 2=RESPONSE)
     */
    getPacketType() {
        throw new Error('getPacketType() method must be implemented by subclass');
    }

    /**
     * Get default configuration for this command
     * Should be overridden by subclasses
     * @returns {Object} Default configuration object
     */
    getDefaultConfig() {
        return {
            fields: []
        };
    }

    /**
     * Load configuration from server
     */
    async loadConfigFromServer() {
        try {
            const response = await fetch(`/api/commands/${this.commandId}/builder-config`);
            if (response.ok) {
                const savedConfig = await response.json();
                console.log(`Loaded saved config for ${this.commandId}:`, savedConfig);

                // Convert old format to new format if needed
                this.config = this.migrateConfig(savedConfig);

                // Re-render if already rendered
                const container = document.getElementById('payload-builder-container');
                if (container && container.innerHTML.trim() !== '' && window.currentCommand && window.currentCommand.hex_id === this.commandId) {
                    console.log(`Re-rendering ${this.commandId} with loaded config`);
                    this.render(container);
                }
            } else if (response.status === 404) {
                console.log(`No saved config found for ${this.commandId}, using defaults`);
            } else {
                console.error(`Failed to load config for ${this.commandId}:`, response.status);
            }
        } catch (error) {
            console.error(`Error loading config for ${this.commandId}:`, error);
        }
    }

    /**
     * Migrate old config format to new format
     * Should be overridden by subclasses if needed
     * @param {Object} config - Config to migrate
     * @returns {Object} Migrated config
     */
    migrateConfig(config) {
        // If it's already in new format, return as is
        if (config.fields && Array.isArray(config.fields)) {
            return config;
        }

        // Default migration - return as is or use defaults
        return config.fields ? config : this.getDefaultConfig();
    }

    /**
     * Helper method to create select options from an object
     * @param {Object} options - Object with key-value pairs for options
     * @param {*} selectedValue - The value that should be selected
     * @returns {string} HTML string for option elements
     */
    createSelect(options, selectedValue) {
        return Object.entries(options)
            .map(([name, value]) => 
                `<option value="${value}" ${value === selectedValue ? 'selected' : ''}>${name}</option>`
            ).join('');
    }

    /**
     * Helper method to convert string to padded byte array
     * @param {string} str - String to convert
     * @param {number} length - Target length of byte array
     * @returns {Array} Array of bytes
     */
    stringToPaddedBytes(str, length) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(str);
        const padded = new Uint8Array(length);
        padded.set(encoded.slice(0, length));
        return Array.from(padded);
    }

    /**
     * Helper method to convert MAC address string to bytes
     * @param {string} macString - MAC address in format "AA:BB:CC:DD:EE:FF"
     * @returns {Array} Array of 6 bytes
     */
    macToBytes(macString) {
        const cleanMac = macString.replace(/[^0-9A-Fa-f]/g, '');
        if (cleanMac.length !== 12) return [0, 0, 0, 0, 0, 0];
        
        const bytes = [];
        for (let i = 0; i < 12; i += 2) {
            bytes.push(parseInt(cleanMac.substr(i, 2), 16));
        }
        return bytes;
    }

    /**
     * Helper method to add event listener with automatic output generation
     * @param {string} elementId - ID of the element to attach listener to
     * @param {string} event - Event type (e.g., 'change', 'click')
     * @param {Function} callback - Optional callback function
     */
    addListener(elementId, event, callback) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, (e) => {
                if (callback) callback(e);
                if (typeof generateOutput === 'function') {
                    generateOutput();
                }
            });
        }
    }

    /**
     * Check if this command can be edited
     * @returns {boolean} True if command can be edited
     */
    canEdit() {
        return window.isAdmin === true;
    }

    /**
     * Render edit mode (should be overridden by subclasses that support editing)
     * @param {HTMLElement} container - Container to render edit mode into
     */
    renderEditMode(container) {
        if (!this.canEdit()) return;

        // Default implementation shows modal editor
        this.showEditModal();
    }
}

// Export for use in other modules
window.BaseCommand = BaseCommand;
