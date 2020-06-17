/// <reference types="cypress" />


describe('Login function unit test',()=>{
    context('Login',()=>{
        beforeEach(() => {
            let base = ""
            if(process.env.NODE_ENV === 'development')
                  base = 'localhost:3000'
            else
                  base = 'http://47.240.64.77'
            cy.visit(base+'/#/login')
        })
    
       it()
    })
    
})