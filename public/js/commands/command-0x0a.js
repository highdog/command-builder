// 0x0A Set LE Configurations (设置 LE 配置)
class Command0A extends BaseCommand {
    constructor() {
        super();
        this.commandId = '0x0A';
        this.commandName = 'Set LE Configurations';
        this.commandNameZh = '设置 LE 配置';
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';
        
        container.innerHTML = `
            <div class="form-section">
                <h4>${isZh ? '设置LE配置' : 'Set LE Configurations'}</h4>
                
                <div class="form-group">
                    <label for="field-packet-type">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                    <select id="field-packet-type">
                        <option value="0">COMMAND</option>
                        <option value="2">RESPONSE</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="field-google-fast-pair">${isZh ? 'Google Fast Pair:' : 'Google Fast Pair:'}</label>
                    <select id="field-google-fast-pair">
                        <option value="0">${isZh ? '开启 (ON)' : 'On'}</option>
                        <option value="1">${isZh ? '关闭 (OFF)' : 'Off'}</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="field-le-audio">${isZh ? 'LE Audio:' : 'LE Audio:'}</label>
                    <select id="field-le-audio">
                        <option value="0">${isZh ? '开启 (ON)' : 'On'}</option>
                        <option value="1">${isZh ? '关闭 (OFF)' : 'Off'}</option>
                    </select>
                </div>

                <div class="info-box" style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h5>${isZh ? '载荷规范' : 'Payload Specification'}</h5>
                    <p><strong>${isZh ? 'LE配置载荷:' : 'LE configurations payload:'}</strong></p>
                    <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                        <tr style="background: #f8f9fa;">
                            <th style="border: 1px solid #dee2e6; padding: 8px;">${isZh ? '位索引' : 'Bit Index'}</th>
                            <th style="border: 1px solid #dee2e6; padding: 8px;">${isZh ? '类型' : 'Type'}</th>
                            <th style="border: 1px solid #dee2e6; padding: 8px;">${isZh ? '描述' : 'Description'}</th>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">0</td>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">uint 1 bit</td>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">${isZh ? 'GOOGLE_FAST_PAIR 启用状态' : 'GOOGLE_FAST_PAIR enabled status'}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">1</td>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">uint 1 bit</td>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">${isZh ? 'LE_AUDIO 启用状态' : 'LE_AUDIO enabled status'}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">2-7</td>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">uint 6 bits</td>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">${isZh ? '占位符' : 'Placeholder'}</td>
                        </tr>
                    </table>
                    
                    <p><strong>${isZh ? '状态值:' : 'Status Values:'}</strong></p>
                    <ul>
                        <li><code>0x0</code> - ${isZh ? '开启 (ON)' : 'ON'}</li>
                        <li><code>0x1</code> - ${isZh ? '关闭 (OFF)' : 'OFF'}</li>
                    </ul>
                    
                    <p><strong>${isZh ? '默认值:' : 'Default Values:'}</strong></p>
                    <ul>
                        <li>GOOGLE_FAST_PAIR: ${isZh ? '开启' : 'ON'}</li>
                        <li>LE_AUDIO: ${isZh ? '关闭' : 'OFF'}</li>
                    </ul>
                    
                    <p><strong>${isZh ? '示例:' : 'Example:'}</strong></p>
                    <p>${isZh ? '二进制载荷' : 'Binary payload'} <code>00000001</code>:</p>
                    <ul>
                        <li><code>000000__</code> - ${isZh ? '占位符' : 'placeholder'}</li>
                        <li><code>______0_</code> - LE audio (OFF)</li>
                        <li><code>_______1</code> - Google fast pair (ON)</li>
                    </ul>
                </div>
            </div>
        `;
        
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type', 'change');
        this.addListener('field-google-fast-pair', 'change');
        this.addListener('field-le-audio', 'change');
    }

    getPayload() {
        const packetType = this.getPacketType();
        const googleFastPair = document.getElementById('field-google-fast-pair')?.value || '0';
        const leAudio = document.getElementById('field-le-audio')?.value || '1'; // Default OFF
        
        // Build the byte according to bit specification
        let configByte = 0;
        
        // Bit 0: GOOGLE_FAST_PAIR status
        if (googleFastPair === '1') {
            configByte |= 0x01; // Set bit 0 for OFF
        }
        // Bit 0 remains 0 for ON (default)
        
        // Bit 1: LE_AUDIO status  
        if (leAudio === '1') {
            configByte |= 0x02; // Set bit 1 for OFF
        }
        // Bit 1 remains 0 for ON
        
        // Bits 2-7: Placeholder (000000)
        // Already 0 by default
        
        if (packetType === 0) {
            // COMMAND: LE configuration payload
            return [configByte];
        } else {
            // RESPONSE: Same format - the actual data that was applied
            return [configByte];
        }
    }

    getPacketType() {
        const packetType = document.getElementById('field-packet-type')?.value || '0';
        return parseInt(packetType);
    }
}

// 注册命令
window.Command0A = Command0A;
