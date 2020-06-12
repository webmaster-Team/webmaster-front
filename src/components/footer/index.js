import React from 'react'
import './style.styl'
import QRCode from '../../assets/img/qrcode.png'
const Footer = props=>{
    return <div className="footer-wrapper">
    <div>
       <ul className="footer-team" id="develope_team">
         <li>开发团队</li>
         <li>顾方宇</li>
         <li>胡毅杰</li>
         <li>林相龙</li>
         <li>倪思涛</li>
         <li>苏灵杰</li>
         <li>王一斐</li>
         <li>叶佳新</li>
         <li>严启铭</li>
         <li>叶行健</li>
       </ul>
       <ul className="footer-team">
       <li>友情链接</li>
       <li>杭州师范大学图书馆</li>
     </ul>
     <ul className="footer-team">
     <li>&copy;2020</li>
     <li>comtlibrary.site</li>
     <li>京ICP备 </li>
     <li>尚无</li>
   </ul>
   </div>
   <div className="footer-icons">
      <img src={QRCode} width={70}/>
      <span>扫描二维码与我们交流</span>
   </div>
    </div>
}

export default Footer