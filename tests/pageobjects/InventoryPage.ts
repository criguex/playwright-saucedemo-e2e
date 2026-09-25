import { Locator, Page, expect } from '@playwright/test'

export class InventoryPage {
  private readonly productList: Locator
  private readonly sortDropdown: Locator
  private readonly cartBadge: Locator
  private readonly cartIcon: Locator

  constructor(private readonly page: Page) {
    this.productList = page.locator('.inventory_item')
    this.sortDropdown = page.getByRole('combobox', { name: 'Sort products' })
    this.cartBadge = page.locator('.shopping_cart_badge')
    this.cartIcon = page.locator('.shopping_cart_link')
  }

  async getProductCount(): Promise<number> {
    return await this.productList.count()
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option)
  }

  async addProductToCartByName(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item', { hasText: productName })
    await product.locator('button[data-test^="add-to-cart"]').click()
  }

  async getCartItemCount(): Promise<string> {
    return await this.cartBadge.innerText()
  }

  async getProductNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allInnerTexts()
  }

  async getProductPrices(): Promise<number[]> {
    const priceLocators = this.page.locator('.inventory_item_price')
    const count = await priceLocators.count()
    const prices: number[] = []
    for (let i = 0; i < count; i++) {
      const text = await priceLocators.nth(i).innerText()
      prices.push(parseFloat(text.replace('$', '')))
    }
    return prices
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click()
  }

  async assertOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory/)
    await expect(this.productList.first()).toBeVisible()
  }
}
