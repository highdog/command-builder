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
            '0x00', '0x01', '0x02', '0x03', '0x06', '0x07', '0x08', '0x09', '0x0a',
            '0x14', '0x15', '0x16', '0x17', '0x19', '0x20', '0x21', '0x30', '0x31',
            '0x32', '0x33', '0x34', '0x35', '0x36', '0x37', '0x38', '0x41', '0x44',
            '0x45', '0x46', '0x47', '0x48', '0x49', '0x4a', '0x4b', '0x4c', '0x4d',
            '0x4e', '0x4f', '0x57', '0x58', '0x59', '0x5a', '0x5b', '0x5c', '0x5d',
            '0x5e', '0x5f', '0x60', '0x61', '0x62', '0x63', '0x64', '0x65', '0x66',
            '0x67', '0x68', '0x69', '0x70', '0x71', '0x72', '0x73', '0x7c', '0x7d',
            '0x7e', '0x7f'
        ];
    }

    /**
     * Load a specific command handler
     * @param {string} commandId - Command ID (e.g., '0x00')
     * @param {boolean} forceReload - Force reload even if already cached
     * @returns {Promise<BaseCommand>} Promise that resolves to the command instance
     */
    async loadCommand(commandId, forceReload = false) {
        if (this.commands[commandId] && !forceReload) {
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
            console.log(`Creating instance of ${commandClassName} for ${commandId}`);
            const commandInstance = new CommandClass(commandId);
            this.commands[commandId] = commandInstance;

            console.log(`Successfully created command instance for ${commandId}:`, commandInstance);
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
        try {
            // Load all commands (editor mixin is already loaded in HTML)
            const loadPromises = CommandLoader.AVAILABLE_COMMANDS.map(
                commandId => this.loadCommand(commandId)
            );

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
        // For development, always reload scripts to avoid cache issues
        // if (this.loadedScripts.has(scriptPath)) {
        //     return Promise.resolve();
        // }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            // Add cache-busting parameter
            const cacheBuster = Date.now();
            script.src = `${scriptPath}?v=${cacheBuster}`;
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
        console.log('Creating legacy handlers from commands:', Object.keys(this.commands));

        for (const [commandId, command] of Object.entries(this.commands)) {
            console.log(`Processing command ${commandId}:`, command);
            const handlerObject = {
                render: (container) => command.render(container),
                attachListeners: () => command.attachListeners(),
                getPayload: () => command.getPayload(),
                getPacketType: () => command.getPacketType()
            };

            // Copy any additional methods/properties from the command instance
            for (const prop in command) {
                if (typeof command[prop] === 'function' &&
                    !['constructor'].includes(prop)) {
                    handlerObject[prop] = command[prop].bind(command);
                }
            }

            // Ensure specific methods are available
            const methodsToEnsure = [
                'canEdit', 'renderEditMode', 'addOption', 'removeOption', 'addField', 'removeField',
                'selectField', 'editFieldName', 'updateFieldName', 'updateFieldProperty', 'updateOfflineValue', 'setFieldType', 'updateOption', 'updateCondition', 'refreshModal',
                'closeEditModal', 'saveModalChanges', 'showEditModal', 'renderFieldList', 'renderConditionEditor',
                'previewBuilder', 'saveChanges', 'cancelEdit'
            ];
            methodsToEnsure.forEach(methodName => {
                if (typeof command[methodName] === 'function' && !handlerObject[methodName]) {
                    handlerObject[methodName] = command[methodName].bind(command);
                }
            });

            // Debug: Log available methods for 0x00 and 0x01 commands
            if (commandId === '0x00' || commandId === '0x01') {
                console.log(`${commandId} command methods:`, Object.keys(handlerObject));
                console.log(`${commandId} canEdit method:`, typeof handlerObject.canEdit);
                console.log(`${commandId} renderEditMode method:`, typeof handlerObject.renderEditMode);
                console.log(`${commandId} showEditModal method:`, typeof handlerObject.showEditModal);
                console.log(`${commandId} addField method:`, typeof handlerObject.addField);
                console.log(`${commandId} removeField method:`, typeof handlerObject.removeField);
                console.log(`${commandId} selectField method:`, typeof handlerObject.selectField);
                console.log(`${commandId} editFieldName method:`, typeof handlerObject.editFieldName);
            }

            // Add handler with both lowercase and uppercase keys for compatibility
            legacyHandlers[commandId] = handlerObject;
            legacyHandlers[commandId.toUpperCase()] = handlerObject;
        }

        return legacyHandlers;
    }

    /**
     * Reload a specific command's configuration
     * @param {string} commandId - Command ID to reload
     */
    async reloadCommandConfig(commandId) {
        if (this.commands[commandId] && typeof this.commands[commandId].loadConfigFromServer === 'function') {
            await this.commands[commandId].loadConfigFromServer();
            console.log(`Reloaded config for command ${commandId}`);
        }
    }
}

// Create global instance
window.commandLoader = new CommandLoader();

// Export for use in other modules
window.CommandLoader = CommandLoader;
