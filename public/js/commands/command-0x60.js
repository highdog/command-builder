/**
 * Command 0x60 - Get ANC Mode
 * 获取ANC模式
 */
class Command60 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x60">数据包类型:</label>
                <select id="field-packet-type-0x60" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x60">
                <div class="form-group">
                    <label for="field-value-0x60">值:</label>
                    <input type="number" id="field-value-0x60" min="0" max="255" value="0" style="width: 80px;">
                    <small>0-255</small>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x60', 'change', (e) => {
            document.getElementById('response-options-0x60').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回值
        const value = parseInt(document.getElementById('field-value-0x60').value) || 0;
        return [value];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x60').value, 10);
    }
}

// Register the command class globally
window.Command60 = Command60;