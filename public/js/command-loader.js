/**
 * Command Loader - Dynamically loads and manages command handlers
 */
class CommandLoader {
    constructor() {
        this.commands = {};
        this.loadedScripts = new Set();
    }

    /**
     * List of all available commands
     */
    static get AVAILABLE_COMMANDS() {
        return [
            '0x00', '0x02', '0x03', '0x06', '0x07', '0x09', '0x14', '0x15',
            '0x16', '0x17', '0x19', '0x20', '0x21', '0x30', '0x31', '0x32',
            '0x33', '0x34', '0x35', '0x36', '0x37', '0x38', '0x41', '0x44',
            '0x45', '0x46', '0x47', '0x48', '0x49', '0x4a', '0x4b', '0x4c',
            '0x4d', '0x4e', '0x4f', '0x57', '0x58', '0x59', '0x5a', '0x5b',
            '0x5c', '0x5d', '0x5e', '0x5f', '0x60', '0x61', '0x62', '0x63',
            '0x64', '0x65', '0x66', '0x67', '0x68', '0x69', '0x70', '0x71',
            '0x72', '0x73', '0x7c'
        ];
    }

    /**
     * Load a specific command handler
     * @param {string} commandId - Command ID (e.g., '0x00')
     * @returns {Promise<BaseCommand>} Promise that resolves to the command instance
     */
    async loadCommand(commandId) {
        if (this.commands[commandId]) {
            return this.commands[commandId];
        }

        const scriptPath = `js/commands/command-${commandId.toLowerCase()}.js`;
        
        try {
            await this.loadScript(scriptPath);
            
            // Get the command class from the global scope
            // Convert 0x00 -> Command00, 0x4a -> Command4A, etc.
            const hexPart = commandId.replace('0x', '').padStart(2, '0').toUpperCase();
            const commandClassName = `Command${hexPart}`;
            const CommandClass = window[commandClassName];
            
            if (!CommandClass) {
                throw new Error(`Command class ${commandClassName} not found`);
            }

            // Create instance and store it
            const commandInstance = new CommandClass(commandId);
            this.commands[commandId] = commandInstance;
            
            return commandInstance;
        } catch (error) {
            console.error(`Failed to load command ${commandId}:`, error);
            throw error;
        }
    }

    /**
     * Load all available commands
     * @returns {Promise<Object>} Promise that resolves to object with all command instances
     */
    async loadAllCommands() {
        const loadPromises = CommandLoader.AVAILABLE_COMMANDS.map(
            commandId => this.loadCommand(commandId)
        );

        try {
            await Promise.all(loadPromises);
            return this.commands;
        } catch (error) {
            console.error('Failed to load all commands:', error);
            throw error;
        }
    }

    /**
     * Get a loaded command instance
     * @param {string} commandId - Command ID
     * @returns {BaseCommand|null} Command instance or null if not loaded
     */
    getCommand(commandId) {
        return this.commands[commandId] || null;
    }

    /**
     * Check if a command is loaded
     * @param {string} commandId - Command ID
     * @returns {boolean} True if command is loaded
     */
    isCommandLoaded(commandId) {
        return !!this.commands[commandId];
    }

    /**
     * Load a script dynamically
     * @param {string} scriptPath - Path to the script
     * @returns {Promise} Promise that resolves when script is loaded
     */
    loadScript(scriptPath) {
        if (this.loadedScripts.has(scriptPath)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => {
                this.loadedScripts.add(scriptPath);
                resolve();
            };
            script.onerror = () => {
                reject(new Error(`Failed to load script: ${scriptPath}`));
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Create the legacy customCommandHandlers object for backward compatibility
     * @returns {Object} Object compatible with the old command_handlers.js format
     */
    createLegacyHandlers() {
        const legacyHandlers = {};
        
        for (const [commandId, command] of Object.entries(this.commands)) {
            legacyHandlers[commandId] = {
                render: (container) => command.render(container),
                attachListeners: () => command.attachListeners(),
                getPayload: () => command.getPayload(),
                getPacketType: () => command.getPacketType()
            };

            // Copy any additional methods/properties from the command instance
            for (const prop in command) {
                if (typeof command[prop] === 'function' && 
                    !['render', 'attachListeners', 'getPayload', 'getPacketType', 'constructor'].includes(prop)) {
                    legacyHandlers[commandId][prop] = command[prop].bind(command);
                }
            }
        }
        
        return legacyHandlers;
    }
}

// Create global instance
window.commandLoader = new CommandLoader();

// Export for use in other modules
window.CommandLoader = CommandLoader;
