/**
 * Command 0x47 - Set User Equalizer Configuration
 * 设置用户均衡器配置
 */
class Command47 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // 版本定义
        this.versions = {
            'V1': 1,
            'V2': 2,
            'V3': 3
        };
        
        // 频段数量定义
        this.bandCounts = {
            1: 5,  // v1: 5频段
            2: 8,  // v2: 8频段
            3: 10  // v3: 10频段
        };
        
        // 状态码定义
        this.statusCodes = {
            'SUCCESS': 0x00,
            'FAILED': 0x01,
            'INVALID_VERSION': 0x02,
            'INVALID_GAIN_VALUE': 0x03
        };
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x47">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x47" class="payload-input">
                    <option value="0" selected>COMMAND (set configuration)</option>
                    <option value="2">RESPONSE (result status)</option>
                </select>
            </div>
            <div id="command-options-0x47">
                <div class="form-group">
                    <label for="field-version-0x47">${isZh ? '配置版本:' : 'Config Version:'}</label>
                    <select id="field-version-0x47" class="payload-input">
                        <option value="1">${isZh ? 'V1 (5频段)' : 'V1 (5 bands)'}</option>
                        <option value="2">${isZh ? 'V2 (8频段)' : 'V2 (8 bands)'}</option>
                        <option value="3">${isZh ? 'V3 (10频段)' : 'V3 (10 bands)'}</option>
                    </select>
                </div>
                <div id="eq-bands-container-0x47"></div>
            </div>
            <div id="response-options-0x47" style="display:none;">
                <div class="form-group">
                    <label for="field-status-0x47">${isZh ? '执行状态:' : 'Execution Status:'}</label>
                    <select id="field-status-0x47" class="payload-input">
                        <option value="0x00">${isZh ? 'SUCCESS (成功)' : 'SUCCESS'}</option>
                        <option value="0x01">${isZh ? 'FAILED (失败)' : 'FAILED'}</option>
                        <option value="0x02">${isZh ? 'INVALID_VERSION (版本无效)' : 'INVALID_VERSION'}</option>
                        <option value="0x03">${isZh ? 'INVALID_GAIN_VALUE (增益值无效)' : 'INVALID_GAIN_VALUE'}</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
        this.updateBands(); // 初始化频段
    }

    attachListeners() {
        this.addListener('field-packet-type-0x47', 'change', (e) => {
            const isCommand = e.target.value === '0';
            document.getElementById('command-options-0x47').style.display = 
                isCommand ? 'block' : 'none';
            document.getElementById('response-options-0x47').style.display = 
                isCommand ? 'none' : 'block';
        });

        this.addListener('field-version-0x47', 'change', () => {
            this.updateBands();
        });
    }

    updateBands() {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const version = parseInt(document.getElementById('field-version-0x47').value);
        const bandCount = this.bandCounts[version];
        const container = document.getElementById('eq-bands-container-0x47');

        let html = `<fieldset><legend>${isZh ? '均衡器频段设置 (增益值: -12 到 +12 dB)' : 'Equalizer Band Settings (Gain: -12 to +12 dB)'}</legend>`;

        for (let i = 0; i < bandCount; i++) {
            const frequency = this.getFrequencyLabel(version, i);
            html += `
                <div class="form-group">
                    <label for="band-${i}-0x47">${frequency}:</label>
                    <input type="number" id="band-${i}-0x47" min="-12" max="12" value="0" step="1" style="width: 80px;">
                    <span>dB</span>
                </div>
            `;
        }

        html += '</fieldset>';
        container.innerHTML = html;
    }

    getFrequencyLabel(version, bandIndex) {
        const frequencies = {
            1: ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'],
            2: ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz'],
            3: ['31Hz', '62Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz']
        };
        
        return frequencies[version][bandIndex] || `Band ${bandIndex + 1}`;
    }

    getPayload() {
        const packetType = this.getPacketType();
        
        if (packetType === 0) { // COMMAND
            const version = parseInt(document.getElementById('field-version-0x47').value);
            const bandCount = this.bandCounts[version];
            const payload = [version];
            
            // 添加每个频段的增益值 (转换为有符号字节)
            for (let i = 0; i < bandCount; i++) {
                const gain = parseInt(document.getElementById(`band-${i}-0x47`).value) || 0;
                // 将 -12 到 +12 的范围转换为 0-24
                const gainByte = Math.max(0, Math.min(24, gain + 12));
                payload.push(gainByte);
            }
            
            return payload;
        } else { // RESPONSE
            const status = parseInt(document.getElementById('field-status-0x47').value, 16);
            return [status];
        }
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x47').value, 10);
    }
}

// Register the command class globally
window.Command47 = Command47;
