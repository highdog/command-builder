// 0x08 Set Bluetooth Led Configurations (设置蓝牙指示灯配置)
class Command08 extends BaseCommand {
    constructor() {
        super();
        this.commandId = '0x08';
        this.commandName = 'Set Bluetooth Led Configurations';
        this.commandNameZh = '设置蓝牙指示灯配置';
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';
        
        container.innerHTML = `
            <div class="form-section">
                <h4>${isZh ? '设置蓝牙LED配置' : 'Set Bluetooth LED Configurations'}</h4>
                
                <div class="form-group">
                    <label for="field-packet-type">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                    <select id="field-packet-type">
                        <option value="0">COMMAND</option>
                        <option value="2">RESPONSE</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="field-led-config">${isZh ? 'LED配置:' : 'LED Configuration:'}</label>
                    <select id="field-led-config">
                        <option value="0">${isZh ? '开启' : 'On'}</option>
                        <option value="1">${isZh ? '关闭' : 'Off'}</option>
                    </select>
                </div>

                <div class="info-box" style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h5>${isZh ? '载荷规范' : 'Payload Specification'}</h5>
                    <p><strong>${isZh ? '蓝牙LED配置载荷:' : 'Bluetooth LED configurations payload:'}</strong></p>
                    <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                        <tr style="background: #f8f9fa;">
                            <th style="border: 1px solid #dee2e6; padding: 8px;">${isZh ? '字节索引' : 'Byte Index'}</th>
                            <th style="border: 1px solid #dee2e6; padding: 8px;">${isZh ? '类型' : 'Type'}</th>
                            <th style="border: 1px solid #dee2e6; padding: 8px;">${isZh ? '描述' : 'Description'}</th>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">0</td>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">uint8</td>
                            <td style="border: 1px solid #dee2e6; padding: 8px;">${isZh ? 'LED配置枚举值' : 'LED configurations enum value'}</td>
                        </tr>
                    </table>
                    
                    <p><strong>${isZh ? '枚举值:' : 'Enum Values:'}</strong></p>
                    <ul>
                        <li><code>0x00</code> - ${isZh ? '开启：蓝牙LED开启' : 'On: Bluetooth LED is on'}</li>
                        <li><code>0x01</code> - ${isZh ? '关闭：蓝牙LED关闭' : 'Off: Bluetooth LED is off'}</li>
                    </ul>
                    
                    <p><em>${isZh ? '默认值：开启' : 'Default value: On'}</em></p>
                </div>
            </div>
        `;
        
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type', 'change');
        this.addListener('field-led-config', 'change');
    }

    getPayload() {
        const packetType = this.getPacketType();
        const ledConfig = document.getElementById('field-led-config')?.value || '0';
        
        if (packetType === 0) {
            // COMMAND: Bluetooth led configurations payload
            return [parseInt(ledConfig)];
        } else {
            // RESPONSE: Same format - the actual data that was applied
            return [parseInt(ledConfig)];
        }
    }

    getPacketType() {
        const packetType = document.getElementById('field-packet-type')?.value || '0';
        return parseInt(packetType);
    }
}

// 注册命令
window.Command08 = Command08;
