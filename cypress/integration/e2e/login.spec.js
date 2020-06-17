/// <reference types="cypress" />

context('Login',()=>{
    beforeEach(() => {
        let base = ""
        // if(process.env.NODE_ENV === 'development')
            //   base = 'localhost:3000'
        // else if(process.env.NODE_ENV === 'production')
        base = 'http://47.240.64.77'
        cy.visit(base+'/#/login')
    })

    it("学号有效性校验",()=>{
        //检测学号的可用数字
        cy.get(':nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
        .type('dnsjndskj').blur()
        cy.get('.MuiFormHelperText-root')
        .contains('学号只包含数字')
        //检测学号的位数
        cy.get(':nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
        .clear()
        .type('20172122121345').blur()
        cy.get('.MuiFormHelperText-root')
        .contains('学号位数应该是13位的')
        //检测学号必填
        cy.get(':nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
        .clear().blur()
        cy.get('.MuiFormHelperText-root')
        .contains('请输入学号')
        //检测学号通过
        cy.get(':nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
        .clear().type('2017212212132').blur()
        cy.get('.MuiFormHelperText-root').should('not.exist')
    })

    // 密码有效性校验
    it("密码有效性校验",()=>{  
       //检测密码只由>5数字组成
       cy.get(':nth-child(2) > .MuiInputBase-root > .MuiInputBase-input')
       .clear().type('1234567890').blur()
       cy.get('.MuiFormHelperText-root').should('not.exist')
       //检测密码只由>5大小写字母构成
       cy.get(':nth-child(2) > .MuiInputBase-root > .MuiInputBase-input')
       .clear().type('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').blur()
       cy.get('.MuiFormHelperText-root').should('not.exist')
       //检测密码只由>5下划线组成
       cy.get(':nth-child(2) > .MuiInputBase-root > .MuiInputBase-input')
       .clear().type('______').blur()
       cy.get('.MuiFormHelperText-root').should('not.exist')
       //检测密码只由>5个合法字符组成
       cy.get(':nth-child(2) > .MuiInputBase-root > .MuiInputBase-input')
       .clear().type('1a_1').blur()
       cy.get('.MuiFormHelperText-root').contains('密码是只由数字、大小写字母、下划线组成的至少5位的字符串')
        //检测密码输入其他字符
        cy.get(':nth-child(2) > .MuiInputBase-root > .MuiInputBase-input')
        .clear().type('1a&*+1').blur()
        cy.get('.MuiFormHelperText-root').contains('密码是只由数字、大小写字母、下划线组成的至少5位的字符串')
        //检测密码必须输入
       cy.get(':nth-child(2) > .MuiInputBase-root > .MuiInputBase-input')
       .clear().blur()
       cy.get('.MuiFormHelperText-root').contains('请输入密码')
    })

    it("密码可见性校验",()=>{
        cy.get(':nth-child(2) > .MuiInputBase-root > .MuiInputBase-input')
        .clear().type('123456')
        //切换到text
        cy.get('.MuiInputAdornment-positionEnd > .MuiButtonBase-root')
        .click()
        cy.get(':nth-child(2) > .MuiInputBase-root > .MuiInputBase-input')
        .should('have.attr', 'type', 'text')
        //切换到password
        cy.get('.MuiInputAdornment-positionEnd > .MuiButtonBase-root')
        .click()
        cy.get(':nth-child(2) > .MuiInputBase-root > .MuiInputBase-input')
        .should('have.attr', 'type', 'password')
    })

    // 验证码校验
    it("验证码校验",()=>{
        //检测验证码长度校验
        cy.get(':nth-child(3) > .MuiInputBase-root > .MuiInputBase-input')
        .clear().type('12345').blur()
        cy.get('.MuiFormHelperText-root')
        .contains('验证码有4位')
        //检测验证码必填
        cy.get(':nth-child(3) > .MuiInputBase-root > .MuiInputBase-input')
        .clear().blur()
        cy.get('.MuiFormHelperText-root')
        .contains('请输入验证码')
        //检测验证码正确通过
        cy.get(':nth-child(3) > .MuiInputBase-root > .MuiInputBase-input')
        .clear().type('1234').blur()
        cy.get('.MuiFormHelperText-root').should('not.exist')
    })

    // 政策选择校验
    it("政策选定校验",()=>{
        cy.get('[type="checkbox"]').check()
        cy.get('.policy-error').should('have.value',"")
        cy.get('[type="checkbox"]').uncheck()
        cy.get('.policy-error').contains('您必须同意我们的隐私政策')
    })
    
    //登陆测试
    it("登陆功能测试",()=>{
        //校验不通过测试
        cy.get('.MuiButton-label')
        .click()
        cy.get(':nth-child(1) > .MuiFormHelperText-root')
        .should("not.be.empty")
        cy.get(':nth-child(2) > .MuiFormHelperText-root')
        .should('not.be.empty')
        cy.get(':nth-child(3) > .MuiFormHelperText-root')
        .should('not.be.empty')
        cy.get('.policy-error')
        .should('not.be.empty')
        //校验通过测试
        cy.get(':nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
        .type('2017212212132')
        cy.get(':nth-child(2) > .MuiInputBase-root > .MuiInputBase-input')
        .type('123456')
        cy.get(':nth-child(3) > .MuiInputBase-root > .MuiInputBase-input')
        .type('1234')
        cy.get('[type="checkbox"]').check()
        cy.get('.MuiButton-label')
        .click()
    })
})