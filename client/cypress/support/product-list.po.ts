import { ProductCategory } from 'src/app/products/product';

export class ProductListPage {
  navigateTo() {
    return cy.visit('./products');
  }

  getUrl() {
    return cy.url();
  }

  getProductListTitle() {
    return cy.get('.product-list-title');
  }

  getFilteredProductListItems() {
    return cy.get('.filtered-product-nav-list .filtered-product-list-item');
  }

  getExpansionTitleByCategory(category: string) {
    return cy.get('.' + category.replace(' ', '-') + '-expansion-panel .' + category.replace(' ', '-') + '-panel-title');
  }

  getExpansionItemsByCategory(category: string) {
    return cy.get('.' + category.replace(' ', '-') + '-expansion-panel .' + category.replace(' ', '-') + '-nav-list .product-list-item');
  }

  /**
   * Selects a category to filter in the "Category" selector.
   *
   * @param value The category *value* to select, this is what's found in the mat-option "value" attribute.
   */
  selectCategory(value: ProductCategory) {
    // Find and click the drop down
    return cy.get('[data-test=productCategorySelect]').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  /**
   * Selects a store to filter in the "Category" selector.
   *
   * @param value The store *value* to select, this is what's found in the mat-option "value" attribute.
   */
   selectStore(value: string) {
    // Find and click the drop down
    return cy.get('[data-test=productStoreSelect]').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  addProductButton() {
    return cy.get('[data-test=addProductButton]');
  }

  clickDeleteButton() {
    return this.getFilteredProductListItems()
    .get('.product-item-container:first .delete-container .delete-product-button')
    .click();
  }

  clickExpansionDeleteButton(category: string) {
    return this.getExpansionItemsByCategory(category)
    .get('.product-item-container:first .delete-container .delete-product-button')
    .click();
  }
}
