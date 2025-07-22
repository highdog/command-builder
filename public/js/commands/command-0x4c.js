/**
 * Command 0x4C - Get Auto Shutdown Time
 * 获取自动关机时间
 */
class Command4C extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // 预设时间选项（分钟）
        this.timeOptions = {
            'DISABLED': 0,
            '5_MINUTES': 5,
            '10_MINUTES': 10,
            '15_MINUTES': 15,
            '30_MINUTES': 30,
            '60_MINUTES': 60,
            '120_MINUTES': 120,
            '180_MINUTES': 180
        };
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x4c">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x4c" class="payload-input">
                    <option value="0">COMMAND (get time)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="response-options-0x4c">
                <div class="form-group">
                    <label for="field-shutdown-time-0x4c">${isZh ? '自动关机时间:' : 'Auto Shutdown Time:'}</label>
                    <select id="field-shutdown-time-0x4c" class="payload-input">
                        <option value="0">${isZh ? 'DISABLED (禁用)' : 'DISABLED'}</option>
                        <option value="5">${isZh ? '5分钟' : '5 minutes'}</option>
                        <option value="10">${isZh ? '10分钟' : '10 minutes'}</option>
                        <option value="15" selected>${isZh ? '15分钟' : '15 minutes'}</option>
                        <option value="30">${isZh ? '30分钟' : '30 minutes'}</option>
                        <option value="60">${isZh ? '1小时' : '1 hour'}</option>
                        <option value="120">${isZh ? '2小时' : '2 hours'}</option>
                        <option value="180">${isZh ? '3小时' : '3 hours'}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="field-custom-time-0x4c">${isZh ? '自定义时间 (分钟):' : 'Custom Time (minutes):'}</label>
                    <input type="number" id="field-custom-time-0x4c" min="0" max="65535" value="15" style="width: 100px;">
                    <small>${isZh ? '0=禁用，1-65535分钟' : '0=disabled, 1-65535 minutes'}</small>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="field-use-custom-0x4c">
                        ${isZh ? '使用自定义时间' : 'Use Custom Time'}
                    </label>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x4c', 'change', (e) => {
            document.getElementById('response-options-0x4c').style.display = 
                e.target.value === '2' ? 'block' : 'none';
        });

        this.addListener('field-use-custom-0x4c', 'change', (e) => {
            const customInput = document.getElementById('field-custom-time-0x4c');
            const presetSelect = document.getElementById('field-shutdown-time-0x4c');
            
            if (e.target.checked) {
                customInput.disabled = false;
                presetSelect.disabled = true;
            } else {
                customInput.disabled = true;
                presetSelect.disabled = false;
            }
        });
    }

    getPayload() {
        if (this.getPacketType() === 0) return []; // COMMAND - 空载荷
        
        // RESPONSE - 返回自动关机时间
        let shutdownTime;
        
        if (document.getElementById('field-use-custom-0x4c').checked) {
            shutdownTime = parseInt(document.getElementById('field-custom-time-0x4c').value) || 0;
        } else {
            shutdownTime = parseInt(document.getElementById('field-shutdown-time-0x4c').value) || 0;
        }
        
        // 时间以分钟为单位，使用2字节表示 (小端序)
        return [
            shutdownTime & 0xFF,        // 低字节
            (shutdownTime >> 8) & 0xFF  // 高字节
        ];
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x4c').value, 10);
    }
}

// Register the command class globally
window.Command4C = Command4C;
