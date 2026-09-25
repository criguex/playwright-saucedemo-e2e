import { Locator, Page, expect } from '@playwright/test'

export class CartPage {
  private readonly cartItems: Locator
  private readonly checkoutButton: Locator
  private readonly continueShoppingButton: Locator

  constructor(private readonly page: Page) {
    this.cartItems = page.locator('.cart_item')
    this.checkoutButton = page.locator('[data-test="checkout"]')
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]')
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count()
  }

  async removeItemByName(productName: string): Promise<void> {
    const item = this.page.locator('.cart_item', { hasText: productName })
    await item.locator('button[data-test^="remove"]').click()
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click()
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click()
  }

  async assertCartContains(productName: string): Promise<void> {
    await expect(this.cartItems.filter({ hasText: productName })).toBeVisible()
  }

  async assertOnCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/cart/)
  }
}
