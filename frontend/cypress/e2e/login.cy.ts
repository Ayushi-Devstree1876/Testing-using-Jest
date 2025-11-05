describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");
  });

 
  it("should show alert when fields are empty", () => {
    const alertStub = cy.stub();
    cy.on("window:alert", alertStub);

    cy.get("button").contains("Login").click().then(() => {
      expect(alertStub).to.have.been.calledOnce;
      expect(alertStub.getCall(0)).to.be.calledWith("All fields are required!");
    });
  });

  
  it("should show alert when API call fails (invalid credentials)", () => {
    const alertStub = cy.stub();
    cy.on("window:alert", alertStub);

    
    cy.intercept("POST", "http://localhost:3000/authentication/login", {
      statusCode: 401,
      body: { message: "Unauthorized" },
    }).as("loginFail");

    cy.get('input[type="email"]').type("wrong@example.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.get("button").contains("Login").click();

    cy.wait("@loginFail");

    cy.then(() => {
      expect(alertStub).to.have.been.calledOnce;
      expect(alertStub.getCall(0)).to.be.calledWith("Invalid email or password!");
    });
  });

  
  it("should login successfully with valid credentials", () => {
    const alertStub = cy.stub();
    cy.on("window:alert", alertStub);

    
    cy.intercept("POST", "http://localhost:3000/authentication/login", {
      statusCode: 200,
      body: { access_token: "fake_jwt_token" },
    }).as("loginSuccess");

    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get("button").contains("Login").click();

    cy.wait("@loginSuccess");

    cy.then(() => {
      expect(localStorage.getItem("token")).to.eq("fake_jwt_token");
      expect(alertStub).to.have.been.calledWith("Login successful!");
    });
  });
});
