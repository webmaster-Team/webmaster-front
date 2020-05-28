/*
 * @Author: Daniel
 * @LastEditTime: 2020-05-28 00:08:24
 * @FilePath: /webmaster-front/src/pages/personalcenter/headerBig.js
 */ 
import styled from 'styled-components';

/**
 * 头像
 */
export const HeaderLogoBig = styled.div`
  width: 50%;
  height: 100%;
  margin-right: auto;
  img{
    width: 100%;
    height: 100%;
  }
`;

/**
 * 名字标签
 */
export const HeadLabel = styled.span`
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 50px;
`;

/**
* 头像框和名字
*/
export const HeadGroupStyle = styled.div`
   width: 100%;
   padding: 5 5 5 5;
   display: flex;
   flex-direction: row
`