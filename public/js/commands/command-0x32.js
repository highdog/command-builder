/**
 * Command 0x32 - Auto-generated from command_handlers.js
 */
class Command32 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x32">数据包类型:</label>
                    <select id="field-packet-type-0x32" class="payload-input">
                        <option value="0">COMMAND (get)</option>
                        <option value="2" selected>RESPONSE</option>
                    </select>
                </div>
                <div id="response-options-0x32">
                    <div class="form-group">
                        <label for="field-transparency-gain-0x32">Transparency Gain (0-255):</label>
                        <input type="number" id="field-transparency-gain-0x32" min="0" max="255" value="128" style="width: 90%;">
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        attachListeners() {
            document.getElementById('field-packet-type-0x32').addEventListener('change', (e) => {
                document.getElementById('response-options-0x32').style.display = e.target.value === '2' ? 'block' : 'none';
                generateOutput();
            });
        }
        getPayload() {
            if (this.getPacketType() === 0) return [];
            return [parseInt(document.getElementById('field-transparency-gain-0x32').value) || 0];
        }
        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x32').value, 10);
        }
    
}

// Register the command class globally
window.Command32 = Command32;