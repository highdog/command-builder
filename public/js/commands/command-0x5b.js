/**
 * Command 0x5b - Get Prompt Language
 * 获取提示语言
 */
class Command5B extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x5b">数据包类型:</label>
                <select id="field-packet-type-0x5b" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x5b">
                <div class="form-group">
                    <label for="field-value-0x5b">值:</label>
                    <input type="number" id="field-value-0x5b" min="0" max="255" value="0" style="width: 80px;">
                    <small>0-255</small>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x5b', 'change', (e) => {
            document.getElementById('response-options-0x5b').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回值
        const value = parseInt(document.getElementById('field-value-0x5b').value) || 0;
        return [value];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x5b').value, 10);
    }
}

// Register the command class globally
window.Command5B = Command5B;