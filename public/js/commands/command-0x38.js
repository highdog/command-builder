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
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x38">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x38" class="payload-input">
                    <option value="0" selected>COMMAND (set mode)</option>
                    <option value="2">RESPONSE (result status)</option>
                </select>
            </div>
            <div id="command-options-0x38">
                <div class="form-group">
                    <label for="field-anc-mode-0x38">${isZh ? 'ANC开启模式:' : 'ANC Mode:'}</label>
                    <select id="field-anc-mode-0x38" class="payload-input">
                        <option value="0x00">${isZh ? 'ADAPTIVE (自适应)' : 'ADAPTIVE'}</option>
                        <option value="0x01">${isZh ? 'NON_ADAPTIVE (非自适应)' : 'NON_ADAPTIVE'}</option>
                    </select>
                </div>
            </div>
            <div id="response-options-0x38" style="display:none;">
                <div class="form-group">
                    <label for="field-status-0x38">${isZh ? '执行状态:' : 'Execution Status:'}</label>
                    <select id="field-status-0x38" class="payload-input">
                        <option value="0x00">${isZh ? 'SUCCESS (成功)' : 'SUCCESS'}</option>
                        <option value="0x01">${isZh ? 'FAILED (失败)' : 'FAILED'}</option>
                        <option value="0x02">${isZh ? 'INVALID_PARAMETER (参数无效)' : 'INVALID_PARAMETER'}</option>
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
