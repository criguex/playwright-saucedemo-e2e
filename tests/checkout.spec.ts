import { test, expect } from '@playwright/test'
import { LoginPage } from './pageobjects/LoginPage'
import { InventoryPage } from './pageobjects/InventoryPage'
import { CartPage } from './pageobjects/CartPage'
import { CheckoutPage } from './pageobjects/CheckoutPage'

test.describe('E2E Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    const loginPage = new LoginPage(page)
    await loginPage.loginWithCredentials('standard_user', 'secret_sauce')
  })

  test('should complete full purchase flow', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutPage = new CheckoutPage(page)

    // Add two products to cart
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack')
    await inventoryPage.addProductToCartByName('Sauce Labs Bike Light')
    expect(await inventoryPage.getCartItemCount()).toBe('2')

    // Go to cart and verify items
    await inventoryPage.goToCart()
    await cartPage.assertOnCartPage()
    await cartPage.assertCartContains('Sauce Labs Backpack')
    expect(await cartPage.getCartItemCount()).toBe(2)

    // Checkout
    await cartPage.proceedToCheckout()
    await checkoutPage.assertOnCheckoutStep('one')

    // Fill shipping info
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345')
    await checkoutPage.clickContinue()
    await checkoutPage.assertOnCheckoutStep('two')

    // Verify summary and finish
    const total = await checkoutPage.getOrderTotal()
    expect(total).toContain('$')
    await checkoutPage.finishOrder()
    await checkoutPage.assertOrderComplete()
  })

  test('should allow removing item from cart before checkout', async ({ page }) => {
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)

    await inventoryPage.addProductToCartByName('Sauce Labs Backpack')
    await inventoryPage.addProductToCartByName('Sauce Labs Bike Light')
    await inventoryPage.goToCart()

    await cartPage.removeItemByName('Sauce Labs Backpack')
    expect(await cartPage.getCartItemCount()).toBe(1)
  })
})
