/**
 * Command 0x16 - Auto-generated from command_handlers.js
 */
class Command16 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }


        render(container) {
            let html = `
                <div class="form-group">
                    <label for="field-packet-type-0x16">数据包类型:</label>
                    <select id="field-packet-type-0x16" class="payload-input">
                        <option value="0" selected>COMMAND (set color)</option>
                        <option value="2">RESPONSE (result status)</option>
                    </select>
                </div>
                <div id="command-options-0x16">
                    <div class="form-group">
                        <label for="field-color-0x16">Earbuds Color:</label>
                        <select id="field-color-0x16" class="payload-input">
                            <option value="0x00">Color1</option>
                            <option value="0x01">Color2</option>
                            <option value="0x02">Color3</option>
                            <option value="0x03">Color4</option>
                        </select>
                    </div>
                </div>
                <div id="response-options-0x16" style="display:none;">
                    <div class="form-group">
                        <label for="field-status-0x16">Result Status:</label>
                        <select id="field-status-0x16" class="payload-input">
                            <option value="0x00">FAILED</option>
                            <option value="0x01">LEFT successful</option>
                            <option value="0x02">RIGHT successful</option>
                            <option value="0x03">BOTH successful</option>
                        </select>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            this.attachListeners();
        }
        attachListeners() {
            document.getElementById('field-packet-type-0x16').addEventListener('change', (e) => {
                const isCommand = e.target.value === '0';
                document.getElementById('command-options-0x16').style.display = isCommand ? 'block' : 'none';
                document.getElementById('response-options-0x16').style.display = isCommand ? 'none' : 'block';
                generateOutput();
            });
        }
        getPayload() {
            const packetType = this.getPacketType();
            if (packetType === 0) { // COMMAND
                const color = parseInt(document.getElementById('field-color-0x16').value, 16);
                return [color];
            } else { // RESPONSE
                const status = parseInt(document.getElementById('field-status-0x16').value, 16);
                return [status];
            }
        }
        getPacketType() {
            return parseInt(document.getElementById('field-packet-type-0x16').value, 10);
        }
    
}

// Register the command class globally
window.Command16 = Command16;