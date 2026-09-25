import { Locator, Page, expect } from '@playwright/test'

export class LoginPage {
  private readonly usernameTextbox: Locator
  private readonly passwordTextbox: Locator
  private readonly loginButton: Locator
  private readonly shoppingCartIcon: Locator
  private readonly errorMessage: Locator

  constructor(private readonly page: Page) {
    this.usernameTextbox = page.getByRole('textbox', { name: 'Username' })
    this.passwordTextbox = page.getByRole('textbox', { name: 'Password' })
    this.loginButton = page.getByRole('button', { name: 'Login' })
    this.shoppingCartIcon = page.locator('.shopping_cart_link')
    this.errorMessage = page.locator('[data-test="error"]')
  }

  async goto(): Promise<void> {
    await this.page.goto('/')
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameTextbox.fill(username)
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordTextbox.fill(password)
  }

  async clickOnLogin(): Promise<void> {
    await this.loginButton.click()
  }

  async loginWithCredentials(username: string, password: string): Promise<void> {
    await this.fillUsername(username)
    await this.fillPassword(password)
    await this.clickOnLogin()
  }

  async checkSuccessfulLogin(): Promise<void> {
    await expect(this.shoppingCartIcon).toBeVisible()
  }

  async assertErrorContains(text: string): Promise<void> {
    await expect(this.errorMessage).toContainText(text)
  }
}
