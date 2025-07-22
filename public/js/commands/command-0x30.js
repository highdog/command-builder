/**
 * Command 0x30 - Auto-generated from command_handlers.js
 */
class Command30 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x30">数据包类型:</label>
                    <select id="field-packet-type-0x30" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE</option>
                    </select>
                </div>
                <div id="response-options-0x30">
                    <div class="form-group">
                        <label for="field-anc-level-0x30">ANC Level (0-255):</label>
                        <input type="number" id="field-anc-level-0x30" min="0" max="255" value="128" style="width: 90%;">
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        attachListeners() {
            document.getElementById('field-packet-type-0x30').addEventListener('change', (e) => {
                document.getElementById('response-options-0x30').style.display = e.target.value === '2' ? 'block' : 'none';
                generateOutput();
            });
        }
        getPayload() {
            if (this.getPacketType() === 0) return [];
            return [parseInt(document.getElementById('field-anc-level-0x30').value) || 0];
        }
        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x30').value, 10);
        }
    
}

// Register the command class globally
window.Command30 = Command30;