import styled from 'styled-components';


export const HeaderWrapper = styled.div`
   display: flex;
   width: 100%;
   height: 100%; 
   align-items: center;
   
   .header-user-icon{
    height: 50%;
    width: 32px;
    border-radius: 50%;
    background: white;
   }
`;

export const HeaderLogo = styled.div`
  width: 200px;
  height: 100%;
  margin-right: auto;
  img{
    width: 100%;
    height: 100%;
  }
`;
