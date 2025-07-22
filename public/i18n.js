// 多语言字符串定义
const i18n = {
    zh: {
        // 导航栏
        nav: {
            commandBuilder: '命令构建器',
            documentation: '文档'
        },
        
        // 页面标题
        pageTitle: '蓝牙命令构建器',
        
        // 侧边栏
        sidebar: {
            selectCommand: '选择命令',
            searchPlaceholder: '搜索命令...',
            noResults: '未找到匹配的命令',
            loading: '加载中...'
        },
        
        // 主要内容区域
        main: {
            protocolLabel: '蓝牙协议:',
            commandLabel: '选择命令:',
            resultLabel: '生成结果:',
            copyButton: '复制',
            copiedButton: '已复制!',
            selectCommand: '-- 请等待 --',
            selectCommandDoc: '请从左侧边栏选择一个命令以查看其文档。',
            noCommandSelected: '未选择命令',
            commandDocumentation: '命令文档',
            payloadBuilder: '载荷构建器',
            generatedOutput: '生成的输出'
        },
        
        // 协议选项
        protocols: {
            gatt: 'GATT (BLE)',
            rfcomm: 'RFCOMM',
            iap2: 'iAP2'
        },
        
        // 按钮和操作
        actions: {
            logout: '退出登录',
            login: '登录',
            save: '保存',
            cancel: '取消',
            confirm: '确认',
            reset: '重置',
            clear: '清除',
            refresh: '刷新'
        },
        
        // 错误和状态消息
        messages: {
            loadingCommands: '正在加载命令...',
            loadingFailed: '加载失败',
            noData: '暂无数据',
            error: '错误',
            success: '成功',
            warning: '警告',
            info: '信息'
        },
        
        // 表单标签
        form: {
            username: '用户名',
            password: '密码',
            email: '邮箱',
            name: '姓名',
            description: '描述',
            value: '值',
            type: '类型',
            required: '必填',
            optional: '可选'
        },
        
        // 命令相关
        command: {
            id: '命令ID',
            name: '命令名称',
            description: '命令描述',
            parameters: '参数',
            response: '响应',
            example: '示例',
            notes: '备注',
            payload: '载荷',
            packetType: '数据包类型',
            hexValue: '十六进制值',
            byteLength: '字节长度'
        }
    },
    
    en: {
        // Navigation
        nav: {
            commandBuilder: 'Command Builder',
            documentation: 'Documentation'
        },
        
        // Page title
        pageTitle: 'Bluetooth Command Builder',
        
        // Sidebar
        sidebar: {
            selectCommand: 'Select Command',
            searchPlaceholder: 'Search commands...',
            noResults: 'No matching commands found',
            loading: 'Loading...'
        },
        
        // Main content area
        main: {
            protocolLabel: 'Bluetooth Protocol:',
            commandLabel: 'Select Command:',
            resultLabel: 'Generated Result:',
            copyButton: 'Copy',
            copiedButton: 'Copied!',
            selectCommand: '-- Please wait --',
            selectCommandDoc: 'Please select a command from the left sidebar to view its documentation.',
            noCommandSelected: 'No command selected',
            commandDocumentation: 'Command Documentation',
            payloadBuilder: 'Payload Builder',
            generatedOutput: 'Generated Output'
        },
        
        // Protocol options
        protocols: {
            gatt: 'GATT (BLE)',
            rfcomm: 'RFCOMM',
            iap2: 'iAP2'
        },
        
        // Buttons and actions
        actions: {
            logout: 'Logout',
            login: 'Login',
            save: 'Save',
            cancel: 'Cancel',
            confirm: 'Confirm',
            reset: 'Reset',
            clear: 'Clear',
            refresh: 'Refresh'
        },
        
        // Error and status messages
        messages: {
            loadingCommands: 'Loading commands...',
            loadingFailed: 'Loading failed',
            noData: 'No data available',
            error: 'Error',
            success: 'Success',
            warning: 'Warning',
            info: 'Information'
        },
        
        // Form labels
        form: {
            username: 'Username',
            password: 'Password',
            email: 'Email',
            name: 'Name',
            description: 'Description',
            value: 'Value',
            type: 'Type',
            required: 'Required',
            optional: 'Optional'
        },
        
        // Command related
        command: {
            id: 'Command ID',
            name: 'Command Name',
            description: 'Command Description',
            parameters: 'Parameters',
            response: 'Response',
            example: 'Example',
            notes: 'Notes',
            payload: 'Payload',
            packetType: 'Packet Type',
            hexValue: 'Hex Value',
            byteLength: 'Byte Length'
        }
    }
};

// 多语言工具函数
class I18nManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'zh';
        this.translations = i18n;
    }
    
    // 获取翻译文本
    t(key, lang = null) {
        const language = lang || this.currentLanguage;
        const keys = key.split('.');
        let value = this.translations[language];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // 如果找不到翻译，尝试使用英文作为后备
                if (language !== 'en') {
                    return this.t(key, 'en');
                }
                console.warn(`Translation not found for key: ${key} in language: ${language}`);
                return key; // 返回key作为后备
            }
        }
        
        return value;
    }
    
    // 设置当前语言
    setLanguage(lang) {
        if (lang in this.translations) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            return true;
        }
        return false;
    }
    
    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // 更新页面中所有带有 data-i18n 属性的元素
    updatePageTexts() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.t(key);
            
            // 根据元素类型更新文本
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
                element.placeholder = text;
            } else if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = text;
            } else if (element.tagName === 'BUTTON') {
                element.textContent = text;
            } else if (element.tagName === 'OPTION') {
                element.textContent = text;
            } else {
                element.textContent = text;
            }
        });
        
        // 更新页面标题
        document.title = this.t('pageTitle');
    }
    
    // 更新HTML lang属性
    updateHtmlLang() {
        document.documentElement.lang = this.currentLanguage === 'zh' ? 'zh-CN' : 'en';
    }
}

// 创建全局实例
window.i18nManager = new I18nManager();
