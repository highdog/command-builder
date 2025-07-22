/**
 * Command 0x38 - Set ANC On Mode
 * 设置ANC开启模式
 */
class Command38 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // ANC模式定义
        this.ancModes = {
            'ADAPTIVE': 0x00,
            'NON_ADAPTIVE': 0x01
        };
        
        // 状态码定义
        this.statusCodes = {
            'SUCCESS': 0x00,
            'FAILED': 0x01,
            'INVALID_PARAMETER': 0x02
        };
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x38">数据包类型:</label>
                <select id="field-packet-type-0x38" class="payload-input">
                    <option value="0" selected>COMMAND (set mode)</option>
                    <option value="2">RESPONSE (result status)</option>
                </select>
            </div>
            <div id="command-options-0x38">
                <div class="form-group">
                    <label for="field-anc-mode-0x38">ANC开启模式:</label>
                    <select id="field-anc-mode-0x38" class="payload-input">
                        <option value="0x00">ADAPTIVE (自适应)</option>
                        <option value="0x01">NON_ADAPTIVE (非自适应)</option>
                    </select>
                </div>
            </div>
            <div id="response-options-0x38" style="display:none;">
                <div class="form-group">
                    <label for="field-status-0x38">执行状态:</label>
                    <select id="field-status-0x38" class="payload-input">
                        <option value="0x00">SUCCESS (成功)</option>
                        <option value="0x01">FAILED (失败)</option>
                        <option value="0x02">INVALID_PARAMETER (参数无效)</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x38', 'change', (e) => {
            const isCommand = e.target.value === '0';
            document.getElementById('command-options-0x38').style.display = 
                isCommand ? 'block' : 'none';
            document.getElementById('response-options-0x38').style.display = 
                isCommand ? 'none' : 'block';
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        
        if (packetType === 0) { // COMMAND
            const ancMode = parseInt(document.getElementById('field-anc-mode-0x38').value, 16);
            return [ancMode];
        } else { // RESPONSE
            const status = parseInt(document.getElementById('field-status-0x38').value, 16);
            return [status];
        }
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x38').value, 10);
    }
}

// Register the command class globally
window.Command38 = Command38;
