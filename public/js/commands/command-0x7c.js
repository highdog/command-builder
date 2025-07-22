/**
 * Command 0x7c - Get Dolby Atmos Config
 * 获取杜比全景声配置
 */
class Command7C extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x7c">数据包类型:</label>
                <select id="field-packet-type-0x7c" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x7c">
                <div class="form-group">
                    <label for="field-value-0x7c">值:</label>
                    <input type="number" id="field-value-0x7c" min="0" max="255" value="0" style="width: 80px;">
                    <small>0-255</small>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x7c', 'change', (e) => {
            document.getElementById('response-options-0x7c').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回值
        const value = parseInt(document.getElementById('field-value-0x7c').value) || 0;
        return [value];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x7c').value, 10);
    }
}

// Register the command class globally
window.Command7C = Command7C;