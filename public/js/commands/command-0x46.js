/**
 * Command 0x46 - Get User Equalizer Configuration
 * 获取用户均衡器配置（支持v1/v2/v3版本）
 */
class Command46 extends BaseCommand {
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
    }

    render(container) {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x46">${isZh ? '数据包类型:' : 'Packet Type:'}</label>
                <select id="field-packet-type-0x46" class="payload-input">
                    <option value="0">COMMAND (get)</option>
                    <option value="2" selected>RESPONSE (device reply)</option>
                </select>
            </div>
            <div id="command-options-0x46" style="display:none;">
                <div class="form-group">
                    <label for="field-version-0x46">${isZh ? '请求版本:' : 'Request Version:'}</label>
                    <select id="field-version-0x46" class="payload-input">
                        <option value="1">${isZh ? 'V1 (5频段)' : 'V1 (5 bands)'}</option>
                        <option value="2">${isZh ? 'V2 (8频段)' : 'V2 (8 bands)'}</option>
                        <option value="3">${isZh ? 'V3 (10频段)' : 'V3 (10 bands)'}</option>
                    </select>
                </div>
            </div>
            <div id="response-options-0x46">
                <div class="form-group">
                    <label for="field-response-version-0x46">${isZh ? '配置版本:' : 'Config Version:'}</label>
                    <select id="field-response-version-0x46" class="payload-input">
                        <option value="1">${isZh ? 'V1 (5频段)' : 'V1 (5 bands)'}</option>
                        <option value="2">${isZh ? 'V2 (8频段)' : 'V2 (8 bands)'}</option>
                        <option value="3">${isZh ? 'V3 (10频段)' : 'V3 (10 bands)'}</option>
                    </select>
                </div>
                <div id="eq-bands-container-0x46"></div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
        this.updateBands(); // 初始化频段
    }

    attachListeners() {
        this.addListener('field-packet-type-0x46', 'change', (e) => {
            const isCommand = e.target.value === '0';
            document.getElementById('command-options-0x46').style.display = 
                isCommand ? 'block' : 'none';
            document.getElementById('response-options-0x46').style.display = 
                isCommand ? 'none' : 'block';
        });

        this.addListener('field-response-version-0x46', 'change', () => {
            this.updateBands();
        });
    }

    updateBands() {
        const currentLang = i18nManager.getCurrentLanguage();
        const isZh = currentLang === 'zh';

        const version = parseInt(document.getElementById('field-response-version-0x46').value);
        const bandCount = this.bandCounts[version];
        const container = document.getElementById('eq-bands-container-0x46');

        let html = `<fieldset><legend>${isZh ? '均衡器频段设置 (增益值: -12 到 +12 dB)' : 'Equalizer Band Settings (Gain: -12 to +12 dB)'}</legend>`;

        for (let i = 0; i < bandCount; i++) {
            const frequency = this.getFrequencyLabel(version, i);
            html += `
                <div class="form-group">
                    <label for="band-${i}-0x46">${frequency}:</label>
                    <input type="number" id="band-${i}-0x46" min="-12" max="12" value="0" step="1" style="width: 80px;">
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
            const version = parseInt(document.getElementById('field-version-0x46').value);
            return [version];
        } else { // RESPONSE
            const version = parseInt(document.getElementById('field-response-version-0x46').value);
            const bandCount = this.bandCounts[version];
            const payload = [version];
            
            // 添加每个频段的增益值 (转换为有符号字节)
            for (let i = 0; i < bandCount; i++) {
                const gain = parseInt(document.getElementById(`band-${i}-0x46`).value) || 0;
                // 将 -12 到 +12 的范围转换为 0-24，然后转为有符号字节
                const gainByte = Math.max(0, Math.min(24, gain + 12));
                payload.push(gainByte);
            }
            
            return payload;
        }
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x46').value, 10);
    }
}

// Register the command class globally
window.Command46 = Command46;
