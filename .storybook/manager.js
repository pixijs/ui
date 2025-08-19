import {addons} from '@storybook/addons';
import {create} from '@storybook/theming';
import './manager.css';

addons.setConfig({
    theme: create({
        base: 'dark',
        colorPrimary: '#e91e63',
        colorSecondary: '#e91e63',
        appBorderRadius: 4,
        fontCode: 'monospace',
        // inputBg: '#e91e63',
        // input
        // appBg: '#2D2D2D',
        // appContentBg: '#FFFFFF',
        // appBorderColor: '#EAEAEA',
        // fontBase: '"Helvetica Neue", "Segoe UI", sans-serif',
        // textColor: '#333333',
        // textInverseColor: '#FFFFFF',
        // barTextColor: '#FFFFFF',
        // barSelectedColor: '#1EA7FD',
        // barBg: '#e91e63',
        // inputBorder: '#EAEAEA',
        // inputTextColor: '#333333',
        // inputBorderRadius: 4,

        brandTitle: 'PixiUI',
        brandImage: 'https://user-images.githubusercontent.com/11766115/228632186-ea0caf7d-f829-4b38-b005-bc9141b0190b.png',
        brandUrl: 'https://github.com/pixijs/ui',
    }),
});
