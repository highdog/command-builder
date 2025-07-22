/**
 * Command 0x33 - Auto-generated from command_handlers.js
 */
class Command33 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x33">数据包类型:</label>
                    <select id="field-packet-type-0x33" class="payload-input">
                        <option value="0" selected>COMMAND (set)</option>
                        <option value="2">RESPONSE</option>
                    </select>
                </div>
                <div id="command-options-0x33">
                    <div class="form-group">
                        <label for="field-transparency-gain-0x33">Transparency Gain (0-255):</label>
                        <input type="number" id="field-transparency-gain-0x33" min="0" max="255" value="128" style="width: 90%;">
                    </div>
                </div>
                <div id="response-options-0x33" style="display:none;">
                    <div class="form-group">
                        <label for="field-transparency-gain-resp-0x33">Applied Transparency Gain (0-255):</label>
                        <input type="number" id="field-transparency-gain-resp-0x33" min="0" max="255" value="128" style="width: 90%;">
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        attachListeners() {
            document.getElementById('field-packet-type-0x33').addEventListener('change', (e) => {
                const isCommand = e.target.value === '0';
                document.getElementById('command-options-0x33').style.display = isCommand ? 'block' : 'none';
                document.getElementById('response-options-0x33').style.display = isCommand ? 'none' : 'block';
                generateOutput();
            });
        }
        getPayload() {
            const packetType = this.getPacketType();
            if (packetType === 0) {
                return [parseInt(document.getElementById('field-transparency-gain-0x33').value) || 0];
            } else {
                return [parseInt(document.getElementById('field-transparency-gain-resp-0x33').value) || 0];
            }
        }
        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x33').value, 10);
        }
    
}

// Register the command class globally
window.Command33 = Command33;