import { Locator, Page, expect } from '@playwright/test'

export class CheckoutPage {
  private readonly firstNameInput: Locator
  private readonly lastNameInput: Locator
  private readonly postalCodeInput: Locator
  private readonly continueButton: Locator
  private readonly finishButton: Locator
  private readonly orderConfirmation: Locator
  private readonly summaryTotal: Locator

  constructor(private readonly page: Page) {
    this.firstNameInput = page.locator('[data-test="firstName"]')
    this.lastNameInput = page.locator('[data-test="lastName"]')
    this.postalCodeInput = page.locator('[data-test="postalCode"]')
    this.continueButton = page.locator('[data-test="continue"]')
    this.finishButton = page.locator('[data-test="finish"]')
    this.orderConfirmation = page.locator('.complete-header')
    this.summaryTotal = page.locator('.summary_total_label')
  }

  async fillShippingInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName)
    await this.lastNameInput.fill(lastName)
    await this.postalCodeInput.fill(postalCode)
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click()
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click()
  }

  async getOrderTotal(): Promise<string> {
    return await this.summaryTotal.innerText()
  }

  async assertOrderComplete(): Promise<void> {
    await expect(this.orderConfirmation).toHaveText('Thank you for your order!')
  }

  async assertOnCheckoutStep(step: 'one' | 'two' | 'complete'): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`checkout-step-${step}|checkout-complete`))
  }
}
