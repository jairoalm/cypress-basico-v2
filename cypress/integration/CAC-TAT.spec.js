/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function(){
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function(){
        cy.title()
          .should('be.equal', 'Central de Atendimento ao Cliente TAT')        
    })
    it('preenche os campos obrigatórios e envia o formulário', function(){
        cy.get('#firstName').type('Jairo')
        cy.get('#lastName').type('Almeida')
        cy.get('#email').type('jairoam85@gmail.com')
        cy.get('#open-text-area').type('Curso básico de cypress')
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
    })

    it('Sem informar campo nome', function(){
        cy.get('#lastName').type('Almeida')
        cy.get('#email').type('jairoam85@gmail.com')
        cy.get('#open-text-area').type('Curso básico de cypress')
        cy.get('button[type="submit"]').click()
    
        cy.get('.error').should('be.visible')
    })

    it('Usando elemento "contains"', function(){
        cy.get('#firstName').type('Jairo')
        cy.get('#lastName').type('Almeida')
        cy.get('#email').type('jairoam85@gmail.com')
        cy.get('#open-text-area').type('Curso básico de cypress')
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })

    it('preenche os campos texto long', function(){
        const longText = 'Curso básico de cypress, Curso básico de cypress, Curso básico de cypress, Curso básico de cypress'
        cy.get('#firstName').type('Jairo')
        cy.get('#lastName').type('Almeida')
        cy.get('#email').type('jairoam85@gmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um e-mail com formatação inválida', function(){
        cy.get('#firstName').type('Jairo')
        cy.get('#lastName').type('Almeida')
        cy.get('#email').type('jairoam85@gmail,com')
        cy.get('#open-text-area').type('Curso básico de cypress')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor numérico', function(){
        cy.get('#phone')
          .type('testeteste')
          .should('have.value', '')        
    })

    it('exibe mensagem de erro quando o telefone se torna obriatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type('Jairo')
        cy.get('#lastName').type('Almeida')
        cy.get('#email').type('jairoam85@gmail,com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('Curso básico de cypress')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })
    it('preenche e limpa os campos nome, sobrenome, e-mail e telefone', function(){
        cy.get('#firstName')
          .type('Jairo')
          .should('have.value', 'Jairo')
          .clear()
          .should('have.value', '')
         cy.get('#lastName')
          .type('Almeida')
          .should('have.value', 'Almeida')
          .clear()
          .should('have.value', '')
        cy.get('#email')
          .type('jairoam85@gmail.com')
          .should('have.value', 'jairoam85@gmail.com')
          .clear()
          .should('have.value', '')
        cy.get('#phone')
          .type('999448035')
          .should('have.value', '999448035')
          .clear()
          .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatório', function(){
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    it('envia o formulário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success')
          .should('be.visible')
    })

    /* Selecionando opções de campos de seleção suspensa */
    it('seleciona um produto (Youtube) por texto', function() {
        cy.get('#product')
          .select('YouTube')
          .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valo (value)', function() {
        cy.get('#product')
          .select('mentoria')
          .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu indice', function() {
        cy.get('#product')
          .select(1)
          .should('have.value', 'blog')
    })

    /** Marcando inputs do tipo radio */
    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('input[type="radio"][value="feedback"]')
          .check()
          .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
          .should('have.length', 3)
          .each(function($radio){
              cy.wrap($radio).check()
              cy.wrap($radio).should('be.checked')
          })
    })

    /** Marcando e desmarcando inputs do tipo checkbox*/
    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]')
          .check()
          .should('be.checked')
          .last()
          .uncheck()
          .should('not.be.checked')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.get('#firstName').type('Jairo')
        cy.get('#lastName').type('Almeida')
        cy.get('#email').type('jairoam85@gmail,com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Curso básico de cypress')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    /** fazendo upload de arquivos*/
    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('input[type="file"]')
          .should('not.have.value')
          .selectFile('./cypress/fixtures/example.json')
          .should(function($input){
              //console.log($input) - navegou no inspecionar para saber qual é o caminho
              expect($input[0].files[0].name).to.equal('example.json')
          })          
    })
    // arrastando arquivo de fora.
    it('seleciona um arquivo simluando um drag-and-drop', function() {
        cy.get('input[type="file"]')
          .should('not.have.value')
          .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop'} )
          .should(function($input){
              //console.log($input) - navegou no inspecionar para saber qual é o caminho
              expect($input[0].files[0].name).to.equal('example.json')
          })          
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
        .selectFile('@sampleFile')
        .should(function($input){
            //console.log($input) - navegou no inspecionar para saber qual é o caminho
            expect($input[0].files[0].name).to.equal('example.json')
        })            
    })

    /** Lidando com links que abrem em outra aba */,
    it('verifica que a política de privacidade acre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })


    // para abrir a página na mesma aba removendo o target do html. O cypress não consegue pegar link aberto em outra aba do navegador
    it('acessa página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
          .invoke('removeAttr', 'target')
          .click()
        cy.contains('Talking About Testing').should('be.visible')
    })

    /**  Simulando viewport de um dispositivo móvel */
})
