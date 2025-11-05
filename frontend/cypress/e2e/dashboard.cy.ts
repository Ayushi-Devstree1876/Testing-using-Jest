describe("Dashboard Page", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-jwt-token");

    
    cy.intercept("GET", "http://localhost:3000/todos", {
      statusCode: 200,
      body: [{ id: 1, title: "First Todo", description: "Test todo", completed: false }],
    }).as("getTodos");

    cy.visit("/dashboard");
    cy.wait("@getTodos");
  });

  it("should display the Dashboard heading", () => {
    cy.contains("Todo Dashboard", { matchCase: false }).should("be.visible");
  });

  it("should display existing todos", () => {
    cy.contains("First Todo").should("exist");
  });

  it("should allow adding a new todo", () => {
   
    cy.intercept("POST", "http://localhost:3000/todos", {
      statusCode: 201,
      body: { id: 2, title: "Learn Cypress", description: "E2E testing", completed: false },
    }).as("createTodo");

    
    cy.intercept("GET", "http://localhost:3000/todos", {
      statusCode: 200,
      body: [
        { id: 1, title: "First Todo", description: "Test todo", completed: false },
        { id: 2, title: "Learn Cypress", description: "E2E testing", completed: false },
      ],
    }).as("getTodosAfterAdd");

    cy.get('input[placeholder="Enter todo title"]').clear().type("Learn Cypress");
    cy.get('textarea[placeholder="Enter description (optional)"]').clear().type("E2E testing");

    cy.contains("button", "Add Todo").click();

    cy.wait("@createTodo");
    cy.wait("@getTodosAfterAdd");

    cy.contains("Learn Cypress").should("be.visible");
  });
                                                                       
  it("should edit an existing todo", () => {
    cy.intercept("PATCH", "http://localhost:3000/todos/", {
      statusCode: 200,
      body: { id: 1, title: "Updated Todo",description:"updated Todo is created" },
    }).as("updateTodo");

    cy.intercept("GET", "http://localhost:3000/todos", {
      statusCode: 200,
      body: [{ id: 1, title: "Updated Todo", description: "Test todo", completed: false }],
    }).as("getTodosAfterEdit");

    cy.contains("button", "Edit").first().click();
    cy.get('input[type="text"]').clear().type("Updated Todo");
    cy.contains("button", "Save").click();

    cy.wait("@updateTodo");
    cy.wait("@getTodosAfterEdit");
    cy.contains("Updated Todo").should("be.visible");
  });

  it("should delete a todo", () => {
    cy.intercept("DELETE", "http://localhost:3000/todos/*", {
      statusCode: 200,
    }).as("deleteTodo");

    cy.on("window:confirm", () => true);
    cy.contains("button", "Delete").first().click();
    cy.wait("@deleteTodo");
  });

  it("should redirect to login if no token exists", () => {
    localStorage.removeItem("token");
    cy.visit("/dashboard");
    cy.url().should("include", "/login");
  });
});
