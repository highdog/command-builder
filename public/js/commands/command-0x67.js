/**
 * Command 0x67 - Set Enabled Voice Prompts
 * 设置启用的语音提示
 */
class Command67 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';
        
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x67">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x67" class="payload-input">
                    <option value="0" selected>COMMAND (execute)</option>
                    <option value="2">RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x67">
                <div class="form-group">
                    <label for="field-value-0x67">${isZh ? '值:' : 'Value:'}</label>
                    <input type="number" id="field-value-0x67" min="0" max="255" value="0" style="width: 80px;">
                    <small>0-255</small>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x67', 'change', (e) => {
            document.getElementById('response-options-0x67').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回值
        const value = parseInt(document.getElementById('field-value-0x67').value) || 0;
        return [value];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x67').value, 10);
    }
}

// Register the command class globally
window.Command67 = Command67;