describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });

  it("should navigate to Tuesday", () => {
    cy.visit("/")
      .contains("[data-testid=day]", "Tuesday")
      .click()
      .should("contain.class", "day-list__item--selected");
  });
});