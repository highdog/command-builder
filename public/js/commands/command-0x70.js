/**
 * Command 0x70 - Get Sidetone Mode
 * 获取侧音模式
 */
class Command70 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';
        
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x70">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x70" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x70">
                <div class="form-group">
                    <label for="field-value-0x70">${isZh ? '值:' : 'Value:'}</label>
                    <input type="number" id="field-value-0x70" min="0" max="255" value="0" style="width: 80px;">
                    <small>0-255</small>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x70', 'change', (e) => {
            document.getElementById('response-options-0x70').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回值
        const value = parseInt(document.getElementById('field-value-0x70').value) || 0;
        return [value];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x70').value, 10);
    }
}

// Register the command class globally
window.Command70 = Command70;