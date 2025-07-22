/**
 * Base class for all command handlers
 * Defines the common interface that all command handlers must implement
 */
class BaseCommand {
    constructor(commandId) {
        this.commandId = commandId;
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
}

// Export for use in other modules
window.BaseCommand = BaseCommand;
