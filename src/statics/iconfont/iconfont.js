import { createGlobalStyle } from 'styled-components'

export const IconGlobalStyle = createGlobalStyle`
    @font-face {
      font-family: 'library';  /* project id 1785062 */
      src: url('//at.alicdn.com/t/font_1785062_o35fnfwgwx.eot');
      src: url('//at.alicdn.com/t/font_1785062_o35fnfwgwx.eot?#iefix') format('embedded-opentype'),
      url('//at.alicdn.com/t/font_1785062_o35fnfwgwx.woff2') format('woff2'),
      url('//at.alicdn.com/t/font_1785062_o35fnfwgwx.woff') format('woff'),
      url('//at.alicdn.com/t/font_1785062_o35fnfwgwx.ttf') format('truetype'),
      url('//at.alicdn.com/t/font_1785062_o35fnfwgwx.svg#library') format('svg');
    }
    .iconfont {
      font-family: "library" !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
`
