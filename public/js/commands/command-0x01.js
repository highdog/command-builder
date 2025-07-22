// 0x01 Register Notification Listeners (注册通知监听器)
class Command01 extends BaseCommand {
    constructor() {
        super();
        this.commandId = '0x01';
        this.commandName = 'Register Notification Listeners';
        this.commandNameZh = '注册通知监听器';
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';
        
        container.innerHTML = `
            <div class="form-section">
                <h4>${isZh ? '注册通知监听器' : 'Register Notification Listeners'}</h4>
                
                <div class="form-group">
                    <label for="field-packet-type">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                    <select id="field-packet-type">
                        <option value="0">COMMAND</option>
                        <option value="2">RESPONSE</option>
                    </select>
                </div>

                <div class="info-box" style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h5>${isZh ? '命令说明' : 'Command Description'}</h5>
                    <p>${isZh ? 
                        '此命令用于通知设备注册通知监听器（如电池电量、播放状态等）。主要针对使用 GAIA 客户端的 QCC 平台。' : 
                        'This command notifies the device to register listeners for notifications (battery level, play status, etc.). Primarily intended for QCC platforms using GAIA client.'
                    }</p>
                    <p><strong>${isZh ? '载荷规范:' : 'Payload Specification:'}</strong></p>
                    <ul>
                        <li><strong>COMMAND:</strong> ${isZh ? '固定常量' : 'Constant'} <code>0x11</code></li>
                        <li><strong>RESPONSE:</strong> ${isZh ? '空载荷' : 'Empty payload'}</li>
                    </ul>
                    <p><em>${isZh ? 
                        '注意：如果您的固件平台不需要此命令，请在连接时自动注册监听器。' : 
                        'Note: If your firmware platform doesn\'t require this command, register listeners automatically upon connection.'
                    }</em></p>
                </div>
            </div>
        `;
        
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type', 'change');
    }

    getPayload() {
        const packetType = this.getPacketType();
        
        if (packetType === 0) {
            // COMMAND: Register listeners request payload: constant 0x11
            return [0x11];
        } else {
            // RESPONSE: Empty payload
            return [];
        }
    }

    getPacketType() {
        const packetType = document.getElementById('field-packet-type')?.value || '0';
        return parseInt(packetType);
    }
}

// 注册命令
window.Command01 = Command01;
