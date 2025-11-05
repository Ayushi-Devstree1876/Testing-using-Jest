describe("Register Page", () => {
  beforeEach(() => {
    cy.visit("/register"); 
  });

  it("should show alert when fields are empty", () => {
    cy.get("button[type='submit']").click();
    cy.on("window:alert", (txt) => {
      expect(txt).to.contains("All fields are required!");
    });
  });

  it("should show alert when API call fails (invalid data)", () => {
    
    cy.intercept("POST", "**/register", {
      statusCode: 400,
      body: { message: "Invalid registration data" },
    }).as("registerFail");

    cy.get("input[placeholder='Enter username']").type("invaliduser");
    cy.get("input[placeholder='Enter email']").type("invalidemail@gmail.com");
    cy.get("input[placeholder='Enter password']").type("123456");
    cy.get("button[type='submit']").click();

    cy.wait("@registerFail");

    cy.on("window:alert", (txt) => {
      expect(txt).to.contains("Invalid registration data. Please check your inputs.");
    });
  });

  it("should show success alert when registration succeeds", () => {
   
    cy.intercept("POST", "**/register", {
      statusCode: 201,
      body: { message: "User created successfully" },
    }).as("registerSuccess");

    cy.get("input[placeholder='Enter username']").type("newuser");
    cy.get("input[placeholder='Enter email']").type("newuser@example.com");
    cy.get("input[placeholder='Enter password']").type("password123");
    cy.get("button[type='submit']").click();

    cy.wait("@registerSuccess");

    cy.on("window:alert", (txt) => {
      expect(txt).to.contains("Registration successful! Please login.");
    });
  });
});
