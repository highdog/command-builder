/**
 * Command 0x03 - Feature Version Query/Response
 * Handles feature version information queries and responses
 */
class Command03 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x03">数据包类型:</label>
                <select id="field-packet-type-0x03" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x03">
                <div class="form-group">
                    <label for="field-feature-version-0x03">Feature Version (0-255):</label>
                    <input type="number" id="field-feature-version-0x03" min="0" max="255" value="0" style="width: 90%;">
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x03', 'change', (e) => {
            document.getElementById('response-options-0x03').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return [];
        return [parseInt(document.getElementById('field-feature-version-0x03').value) || 0];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x03').value, 10);
    }
}

// Register the command class globally
window.Command03 = Command03;
