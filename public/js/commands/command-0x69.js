/**
 * Command 0x69 - Set LED Brightness
 * 设置LED亮度
 */
class Command69 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';
        
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x69">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x69" class="payload-input">
                    <option value="0" selected>COMMAND (execute)</option>
                    <option value="2">RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x69">
                <div class="form-group">
                    <label for="field-value-0x69">${isZh ? '值:' : 'Value:'}</label>
                    <input type="number" id="field-value-0x69" min="0" max="255" value="0" style="width: 80px;">
                    <small>0-255</small>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x69', 'change', (e) => {
            document.getElementById('response-options-0x69').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回值
        const value = parseInt(document.getElementById('field-value-0x69').value) || 0;
        return [value];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x69').value, 10);
    }
}

// Register the command class globally
window.Command69 = Command69;