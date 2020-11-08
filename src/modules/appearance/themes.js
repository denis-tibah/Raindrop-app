//common theme
const common = {
    color: {
        warning: '#A2845E',
        danger: '#E52E1B',
        article: '#ec8122',
        image: '#1aa051',
        video: '#625AC3',
        audio: '#975DA8',
        document: '#A2845E',
        important: '#F44336',
        broken: '#8791A1',
        tag: '#8791A1'
    },

    text: {},
    
    background: {
        warning: '#fff3cd',
        danger: '#f8d7da'
    }
}

export default {
    light: {
        dark: false,

        color: {...common.color,
            accent: '#1988E0', //colors.primary
            border: '#00000040' //colors.border
        },

        text: {...common.text,
            regular: '#000000',
            secondary: '#00000070',
            tertiary: '#00000050',
            disabled: '#00000040'
        },

        background: {...common.background,
            regular: 'white',
            alternative: '#F0F0F0',
            disabled: '#DEDEDE'
        }
    },

    dark: {
        dark: true,

        color: {...common.color,
            accent: '#dcc28f',
            border: '#ffffff25'
        },

        text: {...common.text,
            regular: '#ffffff',
            secondary: '#ffffff70',
            tertiary: '#ffffff50',
            disabled: '#ffffff40'
        },

        background: {...common.background,
            regular: '#27282B',
            alternative: '#1D1E20',
            disabled: '#35373B'
        }
    }
}