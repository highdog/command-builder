/**
 * Command 0x45 - Set Equalizer Mode
 * 设置均衡器模式
 */
class Command45 extends BaseCommand {
    constructor(commandId) {
        super(commandId);
        
        // 均衡器模式定义
        this.equalizerModes = {
            'OFF': 0x00,
            'ROCK': 0x01,
            'POP': 0x02,
            'JAZZ': 0x03,
            'CLASSICAL': 0x04,
            'ELECTRONIC': 0x05,
            'BASS_BOOST': 0x06,
            'TREBLE_BOOST': 0x07,
            'VOCAL': 0x08,
            'CUSTOM': 0x09,
            'FLAT': 0x0A,
            'ACOUSTIC': 0x0B,
            'LATIN': 0x0C,
            'LOUNGE': 0x0D,
            'PIANO': 0x0E,
            'R_AND_B': 0x0F
        };
        
        // 状态码定义
        this.statusCodes = {
            'SUCCESS': 0x00,
            'FAILED': 0x01,
            'INVALID_MODE': 0x02
        };
    }

    render(container) {
        const html = `
            <div class="form-group">
                <label for="field-packet-type-0x45">数据包类型:</label>
                <select id="field-packet-type-0x45" class="payload-input">
                    <option value="0" selected>COMMAND (set mode)</option>
                    <option value="2">RESPONSE (result status)</option>
                </select>
            </div>
            <div id="command-options-0x45">
                <div class="form-group">
                    <label for="field-eq-mode-0x45">均衡器模式:</label>
                    <select id="field-eq-mode-0x45" class="payload-input">
                        <option value="0x00">OFF (关闭)</option>
                        <option value="0x01">ROCK (摇滚)</option>
                        <option value="0x02">POP (流行)</option>
                        <option value="0x03">JAZZ (爵士)</option>
                        <option value="0x04">CLASSICAL (古典)</option>
                        <option value="0x05">ELECTRONIC (电子)</option>
                        <option value="0x06">BASS_BOOST (低音增强)</option>
                        <option value="0x07">TREBLE_BOOST (高音增强)</option>
                        <option value="0x08">VOCAL (人声)</option>
                        <option value="0x09">CUSTOM (自定义)</option>
                        <option value="0x0A">FLAT (平坦)</option>
                        <option value="0x0B">ACOUSTIC (原声)</option>
                        <option value="0x0C">LATIN (拉丁)</option>
                        <option value="0x0D">LOUNGE (休闲)</option>
                        <option value="0x0E">PIANO (钢琴)</option>
                        <option value="0x0F">R_AND_B (R&B)</option>
                    </select>
                </div>
            </div>
            <div id="response-options-0x45" style="display:none;">
                <div class="form-group">
                    <label for="field-status-0x45">执行状态:</label>
                    <select id="field-status-0x45" class="payload-input">
                        <option value="0x00">SUCCESS (成功)</option>
                        <option value="0x01">FAILED (失败)</option>
                        <option value="0x02">INVALID_MODE (模式无效)</option>
                    </select>
                </div>
            </div>
        `;
        container.innerHTML = html;
        this.attachListeners();
    }

    attachListeners() {
        this.addListener('field-packet-type-0x45', 'change', (e) => {
            const isCommand = e.target.value === '0';
            document.getElementById('command-options-0x45').style.display = 
                isCommand ? 'block' : 'none';
            document.getElementById('response-options-0x45').style.display = 
                isCommand ? 'none' : 'block';
        });
    }

    getPayload() {
        const packetType = this.getPacketType();
        
        if (packetType === 0) { // COMMAND
            const eqMode = parseInt(document.getElementById('field-eq-mode-0x45').value, 16);
            return [eqMode];
        } else { // RESPONSE
            const status = parseInt(document.getElementById('field-status-0x45').value, 16);
            return [status];
        }
    }

    getPacketType() {
        return parseInt(document.getElementById('field-packet-type-0x45').value, 10);
    }
}

// Register the command class globally
window.Command45 = Command45;
