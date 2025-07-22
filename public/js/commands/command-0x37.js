/**
 * Command 0x37 - Get ANC On Mode
 * 获取ANC开启模式（自适应/非自适应）
 */
class Command37 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // ANC模式定义
        this.ancModes = {
            'ADAPTIVE': 0x00,
            'NON_ADAPTIVE': 0x01
        };
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x37">数据包类型:</label>
                <select id="field-packet-type-0x37" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x37">
                <div class="form-group">
                    <label for="field-anc-mode-0x37">ANC开启模式:</label>
                    <select id="field-anc-mode-0x37" class="payload-input">
                        <option value="0x00">ADAPTIVE (自适应)</option>
                        <option value="0x01">NON_ADAPTIVE (非自适应)</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x37', 'change', (e) => {
            document.getElementById('response-options-0x37').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回ANC模式
        const ancMode = parseInt(document.getElementById('field-anc-mode-0x37').value, 16);
        return [ancMode];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x37').value, 10);
    }
}

// Register the command class globally
window.Command37 = Command37;
